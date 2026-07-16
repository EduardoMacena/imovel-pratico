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

function limitarTexto(texto: string, limite = 1500) {
  return texto.replace(/\s+/g, " ").trim().slice(0, limite);
}

function normalizarTexto(texto: string) {
  return texto.replace(/\s+/g, " ").trim();
}

function extrairCampo(texto: string, labels: string[], proximosLabels: string[]) {
  const textoNormalizado = normalizarTexto(texto);

  for (const label of labels) {
    const proximos = proximosLabels.join("|");

    const regexComDoisPontos = new RegExp(
      `${label}\\s*:\\s*(.+?)(?=\\s+(?:${proximos})\\s*:|$)`,
      "i"
    );

    const matchComDoisPontos = textoNormalizado.match(regexComDoisPontos);

    if (matchComDoisPontos?.[1]) {
      return matchComDoisPontos[1].trim();
    }

    const regexSemDoisPontos = new RegExp(
      `${label}\\s+(.+?)(?=\\s+(?:${proximos})(?:\\s|:)|$)`,
      "i"
    );

    const matchSemDoisPontos = textoNormalizado.match(regexSemDoisPontos);

    if (matchSemDoisPontos?.[1]) {
      return matchSemDoisPontos[1].trim();
    }
  }

  return null;
}

function extrairCpf(texto: string) {
  const cpfFormatado = texto.match(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/);

  if (cpfFormatado?.[0]) {
    return cpfFormatado[0];
  }

  const cpfNumerico = texto.match(/\b\d{11}\b/);

  if (cpfNumerico?.[0]) {
    return cpfNumerico[0];
  }

  return extrairCampo(texto, ["CPF", "CPF/CNPJ"], [
    "Nome",
    "Endereço",
    "Endereco",
    "Índice",
    "Indice",
  ]);
}

async function obterTextoDaPagina(page: Page) {
  return page
    .locator("body")
    .innerText({ timeout: 5000 })
    .catch(() => "");
}

async function aguardarTabelaResultado(page: Page) {
  const tabelaResultado = page.locator("#tabelaPrincipal").first();

  try {
    await tabelaResultado.waitFor({
      state: "visible",
      timeout: 60000,
    });

    return tabelaResultado;
  } catch (error) {
    const textoPagina = await obterTextoDaPagina(page);

    throw new Error(
      `A página da CND abriu, mas a tabela #tabelaPrincipal não apareceu. URL: ${page.url()}. Texto da página: ${limitarTexto(
        textoPagina
      )}`
    );
  }
}

async function clicarPesquisarEObterPaginaResultado(
  context: BrowserContext,
  page: Page
) {
  const novaPaginaPromise = context
    .waitForEvent("page", {
      timeout: 60000,
    })
    .catch(() => null);

  const mesmaPaginaResultadoPromise = Promise.race([
    page
      .waitForURL(/guiaCND\.xhtml/i, {
        timeout: 60000,
      })
      .then(() => page)
      .catch(() => null),
    page
      .locator("#tabelaPrincipal")
      .first()
      .waitFor({
        state: "visible",
        timeout: 60000,
      })
      .then(() => page)
      .catch(() => null),
  ]);

  await page.locator("#meuForm\\:pesquisar").click({
    force: true,
    timeout: 30000,
  });

  const paginaResultado = await Promise.race([
    novaPaginaPromise,
    mesmaPaginaResultadoPromise,
  ]);

  if (!paginaResultado) {
    const textoPagina = await obterTextoDaPagina(page);

    throw new Error(
      `A CND PBH não abriu a página de resultado do IPTU. URL atual: ${page.url()}. Texto da página inicial: ${limitarTexto(
        textoPagina
      )}`
    );
  }

  await paginaResultado
    .waitForLoadState("load", {
      timeout: 60000,
    })
    .catch(() => undefined);

  return paginaResultado;
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

    const paginaResultado = await clicarPesquisarEObterPaginaResultado(
      context,
      page
    );

    console.log("Página resultado CND PBH:", paginaResultado.url());

    const tabelaResultado = await aguardarTabelaResultado(paginaResultado);

    const texto = await tabelaResultado.innerText();

    console.log("Texto bruto tabela CND PBH:", limitarTexto(texto, 2000));

    const nome = extrairCampo(texto, ["Nome"], [
      "CPF",
      "CPF/CNPJ",
      "Endereço",
      "Endereco",
      "Índice",
      "Indice",
    ]);

    const cpf = extrairCpf(texto);

    const endereco = extrairCampo(texto, ["Endereço", "Endereco"], [
      "Nome",
      "CPF",
      "CPF/CNPJ",
      "Índice",
      "Indice",
    ]);

    const indiceResultado =
      extrairCampo(
        texto,
        ["Índice cadastral do IPTU", "Indice cadastral do IPTU"],
        ["Nome", "CPF", "CPF/CNPJ", "Endereço", "Endereco"]
      ) ?? indiceCadastral;

    console.log("Dados extraídos CND PBH:", {
      nome,
      cpf,
      endereco,
      indiceCadastral: indiceResultado,
    });

    if (!nome && !cpf) {
      throw new Error(
        `A CND abriu a página de resultado, mas não foi possível extrair Nome/CPF. Texto da tabela: ${limitarTexto(
          texto
        )}`
      );
    }

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
