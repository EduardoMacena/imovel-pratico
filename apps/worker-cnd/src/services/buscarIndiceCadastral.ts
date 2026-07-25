import type { Frame, Page } from "playwright";
import { getBrowser } from "../playwright/browser.js";

export type ImovelEncontrado = {
  indiceCadastral: string;
  imovel: string;
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

async function aguardarResultadoPesquisa(frame: Frame) {
  const timeoutMs = 30000;
  const startedAt = Date.now();

  const nenhumImovel = frame.getByText(/Nenhum im[oó]vel encontrado/i).first();

  const verImoveis = frame
    .locator("a", {
      hasText: /Ver im[oó]veis relacionados/i,
    })
    .first();

  while (Date.now() - startedAt < timeoutMs) {
    const encontrouMensagemVazia = await nenhumImovel
      .isVisible()
      .catch(() => false);

    if (encontrouMensagemVazia) {
      return {
        status: "EMPTY" as const,
        verImoveis,
      };
    }

    const encontrouLinkResultado = await verImoveis
      .isVisible()
      .catch(() => false);

    if (encontrouLinkResultado) {
      return {
        status: "FOUND" as const,
        verImoveis,
      };
    }

    await frame.page().waitForTimeout(300);
  }

  throw new Error("Resultado da pesquisa 1RIBH não carregou dentro do tempo esperado");
}

export async function buscarIndiceCadastral(
  logradouro: string,
  numero: string
): Promise<ImovelEncontrado[]> {
  const browser = await getBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Abrindo site 1RIBH...");

    await page.goto("https://web.1ribh.com.br/onderegistrarseuimovel.php", {
      waitUntil: "load",
      timeout: 60000,
    });

    const frame = await waitForPyxisFrame(page);

    console.log("Frame encontrado:", frame.url());

    await preencherEndereco(frame, logradouro, numero);

    console.log("Endereço preenchido");

    await frame.locator('button[type="submit"]').click();

    console.log("Pesquisa enviada");

    const resultadoPesquisa = await aguardarResultadoPesquisa(frame);

    if (resultadoPesquisa.status === "EMPTY") {
      console.log("Nenhum imóvel encontrado no 1RIBH.");

      return [];
    }

    await resultadoPesquisa.verImoveis.click();

    console.log("Abrindo imóveis relacionados");

    const linhas = frame.locator("table.table tbody tr");

    await linhas.first().waitFor({
      state: "visible",
      timeout: 30000,
    });

    const imoveis = await linhas.evaluateAll(rows =>
      rows
        .map(row => {
          const cols = Array.from(row.querySelectorAll("td"));

          return {
            indiceCadastral: cols[0]?.textContent?.trim() ?? "",
            imovel: cols[1]?.textContent?.trim() ?? "",
          };
        })
        .filter(item => item.indiceCadastral.length > 0)
    );

    console.log("Imóveis encontrados:", imoveis.length);

    return imoveis;
  } finally {
    await context.close();
  }
}
