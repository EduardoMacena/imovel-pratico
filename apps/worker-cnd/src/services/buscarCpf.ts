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

    const [novaPagina] = await Promise.all([
      context.waitForEvent("page", {
        timeout: 60000,
      }),
      page.evaluate(() => {
        const btn = document.getElementById(
          "meuForm:pesquisar"
        ) as HTMLElement | null;

        if (!btn) {
          throw new Error("Botão pesquisar não encontrado");
        }

        btn.click();
      }),
    ]);

    await novaPagina.waitForLoadState("load", {
      timeout: 60000,
    });

    const tabelaResultado = novaPagina.locator("#tabelaPrincipal").first();

    await tabelaResultado.waitFor({
      state: "visible",
      timeout: 30000,
    });

    const texto = await tabelaResultado.innerText();

    const nome = texto.match(/Nome:\s*(.+)/i)?.[1]?.trim() ?? null;

    const cpf = texto.match(/CPF:\s*([0-9.\-]+)/i)?.[1]?.trim() ?? null;

    const endereco = texto.match(/Endereco:\s*(.+)/i)?.[1]?.trim() ?? null;

    const indiceResultado =
      texto.match(/Indice cadastral do IPTU:\s*([0-9A-Z\s]+)/i)?.[1]?.trim() ??
      indiceCadastral;

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