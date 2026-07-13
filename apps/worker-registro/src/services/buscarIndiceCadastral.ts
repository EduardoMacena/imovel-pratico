import type { Frame, Page } from "playwright";
import { getBrowser } from "../playwright/browser.js";

export type RegistroEncontrado = {
  indiceCadastral: string;
  complemento: string | null;
};

async function waitForPyxisFrame(page: Page) {
  const timeoutMs = 60000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const frame = page
      .frames()
      .find(item => item.url().includes("pyxis.maxsystems.com.br"));

    if (frame) {
      return frame;
    }

    await page.waitForTimeout(500);
  }

  throw new Error("Frame pyxis.maxsystems.com.br não encontrado");
}

async function preencherEndereco(frame: Frame, logradouro: string, numero: string) {
  await frame.locator("#logradouro").waitFor({
    state: "visible",
    timeout: 30000,
  });

  await frame.locator("#logradouro").fill(logradouro);
  await frame.locator("#numero").fill(numero);
}

export async function buscarIndiceCadastral(
  logradouro: string,
  numero: string
): Promise<RegistroEncontrado[]> {
  const browser = await getBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("[worker-registro] Abrindo site 1RIBH...");

    await page.goto("https://web.1ribh.com.br/onderegistrarseuimovel.php", {
      waitUntil: "load",
      timeout: 60000,
    });

    const frame = await waitForPyxisFrame(page);

    await preencherEndereco(frame, logradouro, numero);

    await frame.locator('button[type="submit"]').click();

    const verImoveis = frame.locator("a", {
      hasText: /Ver imoveis relacionados/i,
    });

    await verImoveis.first().waitFor({
      state: "visible",
      timeout: 30000,
    });

    await verImoveis.first().click();

    const linhas = frame.locator("table.table tbody tr");

    await linhas.first().waitFor({
      state: "visible",
      timeout: 30000,
    });

    const registros = await linhas.evaluateAll(rows =>
      rows
        .map(row => {
          const cols = Array.from(row.querySelectorAll("td"));

          return {
            indiceCadastral: cols[0]?.textContent?.trim() ?? "",
            complemento: cols[1]?.textContent?.trim() || null,
          };
        })
        .filter(item => item.indiceCadastral.length > 0)
    );

    console.log("[worker-registro] Registros encontrados:", registros.length);

    return registros;
  } finally {
    await context.close();
  }
}
