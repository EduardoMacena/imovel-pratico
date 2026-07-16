import type { BrowserContext, Page } from "playwright";
import { getBrowser } from "../playwright/browser.js";

export type BuscarCpfParams = {
  indiceCadastral: string;
  mesAnoInicio: string;
  mesAnoFinal: string;
};

export type ProprietarioEncontrado = {
  nome: string | null;
  cpf: string | null;
  endereco: string | null;
  indiceCadastral: string | null;
  periodoPesquisado: string;
};

function limitarTexto(texto: string, limite = 1000) {
  return texto.replace(/\s+/g, " ").trim().slice(0, limite);
}

async function aguardarMarcadorResultado(page: Page, timeoutMs: number) {
  const startedAt = Date.now();
  const tabelaResultado = page.locator("#tabelaPrincipal").first();

  while (Date.now() - startedAt < timeoutMs) {
    const encontrouTabela = await tabelaResultado
      .isVisible()
      .catch(() => false);

    if (encontrouTabela) {
      return;
    }

    const textoPagina = await page
      .locator("body")
      .innerText({ timeout: 1000 })
      .catch(() => "");

    if (
      /Nome:\s/i.test(textoPagina) ||
      /CPF:\s/i.test(textoPagina) ||
      /Endere[cç]o:\s/i.test(textoPagina) ||
      /[ÍI]ndice cadastral/i.test(textoPagina) ||
      /nenhum/i.test(textoPagina) ||
      /n[aã]o encontrado/i.test(textoPagina) ||
      /n[aã]o foi poss[ií]vel/i.test(textoPagina) ||
      /inv[aá]lid/i.test(textoPagina) ||
      /obrigat[oó]rio/i.test(textoPagina) ||
      /erro/i.test(textoPagina)
    ) {
      return;
    }

    await page.waitForTimeout(500);
  }

  throw new Error(
    `Resultado CND PBH não apareceu dentro de ${timeoutMs}ms. URL atual: ${page.url()}`
  );
}

async function clicarPesquisarEAguardarResultado(
  context: BrowserContext,
  page: Page
) {
  const novaPaginaPromise = context
    .waitForEvent("page", {
      timeout: 60000,
    })
    .catch(() => null);

  await page.evaluate(() => {
    const btn = document.getElementById(
      "meuForm:pesquisar"
    ) as HTMLElement | null;

    if (!btn) {
      throw new Error("Botão pesquisar não encontrado");
    }

    btn.click();
  });

  const mesmaPaginaPromise = aguardarMarcadorResultado(page, 60000)
    .then(() => page)
    .catch(() => null);

  const paginaEncontrada = await Promise.race([
    novaPaginaPromise,
    mesmaPaginaPromise,
  ]);

  const paginaResultado =
    paginaEncontrada ??
    context.pages().find(pagina => pagina !== page && !pagina.isClosed()) ??
    page;

  await paginaResultado
    .waitForLoadState("load", {
      timeout: 60000,
    })
    .catch(() => undefined);

  await aguardarMarcadorResultado(paginaResultado, 60000).catch(async error => {
    const textoPagina = await paginaResultado
      .locator("body")
      .innerText({ timeout: 2000 })
      .catch(() => "");

    throw new Error(
      `${error.message}. URL: ${paginaResultado.url()}. Texto da página: ${limitarTexto(
        textoPagina
      )}`
    );
  });

  return paginaResultado;
}

async function obterTextoResultado(page: Page) {
  const tabelaResultado = page.locator("#tabelaPrincipal").first();

  const encontrouTabela = await tabelaResultado.isVisible().catch(() => false);

  if (encontrouTabela) {
    return tabelaResultado.innerText();
  }

  const textoPagina = await page
    .locator("body")
    .innerText({ timeout: 5000 })
    .catch(() => "");

  if (!textoPagina) {
    throw new Error(`CND PBH não retornou conteúdo. URL: ${page.url()}`);
  }

  if (!/Nome:\s/i.test(textoPagina) && !/CPF:\s/i.test(textoPagina)) {
    throw new Error(
      `CND PBH não retornou dados do proprietário. URL: ${page.url()}. Texto da página: ${limitarTexto(
        textoPagina
      )}`
    );
  }

  return textoPagina;
}

export async function buscarCpf({
  indiceCadastral,
  mesAnoInicio,
  mesAnoFinal,
}: BuscarCpfParams): Promise<ProprietarioEncontrado> {
  const browser = await getBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Abrindo CND PBH:", indiceCadastral);

    await page.goto("https://cnd.pbh.gov.br/CNDOnline/", {
      waitUntil: "load",
      timeout: 60000,
    });

    await page.locator("#meuForm\\:TIPO4").click({
      force: true,
      timeout: 30000,
    });

    await page.waitForFunction(
      () => document.body.innerText.includes("Mês/Ano Inicial"),
      undefined,
      { timeout: 30000 }
    );

    await page.evaluate(
      values => {
        const panel = document.getElementById("meuForm:panelIPTU");

        if (!panel) {
          throw new Error("Painel IPTU não encontrado");
        }

        const inputs = Array.from(
          panel.querySelectorAll<HTMLInputElement>('input[type="text"]')
        );

        if (inputs.length < 3) {
          throw new Error(`Esperava 3 inputs, encontrou ${inputs.length}`);
        }

        const inicio = inputs[0];
        const final = inputs[1];
        const indice = inputs[2];

        inicio.value = values.mesAnoInicio;
        inicio.dispatchEvent(new Event("input", { bubbles: true }));
        inicio.dispatchEvent(new Event("change", { bubbles: true }));
        inicio.dispatchEvent(new Event("blur", { bubbles: true }));

        final.value = values.mesAnoFinal;
        final.dispatchEvent(new Event("input", { bubbles: true }));
        final.dispatchEvent(new Event("change", { bubbles: true }));
        final.dispatchEvent(new Event("blur", { bubbles: true }));

        indice.value = values.indiceCadastral;
        indice.dispatchEvent(new Event("input", { bubbles: true }));
        indice.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
        indice.dispatchEvent(new Event("change", { bubbles: true }));
        indice.dispatchEvent(new Event("blur", { bubbles: true }));
      },
      {
        mesAnoInicio,
        mesAnoFinal,
        indiceCadastral,
      }
    );

    const paginaResultado = await clicarPesquisarEAguardarResultado(
      context,
      page
    );

    const texto = await obterTextoResultado(paginaResultado);

    const nome = texto.match(/Nome:\s*(.+)/i)?.[1]?.trim() ?? null;

    const cpf = texto.match(/CPF:\s*([0-9.\-]+)/i)?.[1]?.trim() ?? null;

    const endereco =
      texto.match(/Endere[cç]o:\s*(.+)/i)?.[1]?.trim() ?? null;

    const indiceResultado =
      texto
        .match(/[ÍI]ndice cadastral do IPTU:\s*([^\n\r]+)/i)?.[1]
        ?.trim() ?? indiceCadastral;

    return {
      nome,
      cpf,
      endereco,
      indiceCadastral: indiceResultado,
      periodoPesquisado: `${mesAnoInicio} A ${mesAnoFinal}`,
    };
  } finally {
    await context.close();
  }
}
