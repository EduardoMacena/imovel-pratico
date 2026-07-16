import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const indiceCadastral = process.env.CND_INDICE ?? "013003 003A0016";
const mesAnoInicio = process.env.CND_MES_INICIO ?? "07/2026";
const mesAnoFinal = process.env.CND_MES_FINAL ?? "07/2026";

const headless = process.env.PLAYWRIGHT_HEADLESS === "true";
const slowMo = Number(process.env.PLAYWRIGHT_SLOW_MO ?? 800);
const locale = process.env.PLAYWRIGHT_LOCALE ?? "pt-BR";
const timezoneId = process.env.PLAYWRIGHT_TIMEZONE ?? "America/Sao_Paulo";
const acceptLanguage =
  process.env.PLAYWRIGHT_ACCEPT_LANGUAGE ??
  "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7";

const delayAntesPesquisar = Number(
  process.env.CND_BEFORE_SEARCH_DELAY_MS ?? 15000
);

const baseDir = process.env.CND_DIAG_DIR ?? "/tmp/cnd-debug-diag";
const runId = `${Date.now()}-${indiceCadastral.replace(/[^a-zA-Z0-9]/g, "-")}`;
const dir = path.join(baseDir, runId);

const eventos = [];

function log(evento, dados = {}) {
  const item = {
    at: new Date().toISOString(),
    evento,
    dados,
  };

  eventos.push(item);
  console.log(JSON.stringify(item, null, 2));
}

async function screenshot(page, nome) {
  const arquivo = path.join(dir, `${nome}.png`);

  await page.screenshot({
    path: arquivo,
    fullPage: true,
  });

  log("screenshot", { nome, arquivo });
}

function isUrlRelevante(url) {
  return (
    url.includes("cnd.pbh.gov.br") ||
    url.includes("recaptcha") ||
    url.includes("google.com")
  );
}

async function obterTextoPagina(page) {
  return page
    .locator("body")
    .innerText({ timeout: 3000 })
    .catch(() => "");
}

async function obterMensagens(page) {
  return page
    .evaluate(() => {
      const seletores = [
        ".ui-message",
        ".ui-messages",
        ".ui-messages-error",
        ".ui-message-error",
        ".ui-growl",
        ".ui-growl-message",
        ".ui-state-error",
        "[role='alert']",
      ];

      return seletores
        .flatMap(seletor =>
          Array.from(document.querySelectorAll(seletor)).map(elemento =>
            (elemento.textContent ?? "").replace(/\s+/g, " ").trim()
          )
        )
        .filter(Boolean);
    })
    .catch(() => []);
}

async function obterEstadoBrowser(page) {
  return page.evaluate(() => ({
    url: window.location.href,
    title: document.title,
    userAgent: navigator.userAgent,
    webdriver: navigator.webdriver,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
  }));
}

async function obterEstadoCaptcha(page) {
  return page
    .evaluate(() => {
      const response = document.querySelector(
        'textarea[name="g-recaptcha-response"]'
      );

      const iframes = Array.from(document.querySelectorAll("iframe")).map(
        iframe => ({
          title: iframe.getAttribute("title"),
          src: iframe.getAttribute("src"),
          width: iframe.getAttribute("width"),
          height: iframe.getAttribute("height"),
        })
      );

      return {
        grecaptchaDisponivel: typeof window.grecaptcha !== "undefined",
        responseLength: response?.value?.length ?? 0,
        iframes,
      };
    })
    .catch(error => ({
      erro: error instanceof Error ? error.message : String(error),
    }));
}

async function clicarBotaoPesquisarComoUsuario(page) {
  const botaoPesquisar = page.locator("#meuForm\\:pesquisar").first();

  await botaoPesquisar.waitFor({
    state: "visible",
    timeout: 30000,
  });

  await botaoPesquisar.scrollIntoViewIfNeeded();

  const box = await botaoPesquisar.boundingBox();

  if (!box) {
    throw new Error("Botão pesquisar não possui posição visível na tela");
  }

  log("mouse_move", {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
    width: box.width,
    height: box.height,
  });

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 25,
  });

  await page.waitForTimeout(1200);

  await page.mouse.down();
  await page.waitForTimeout(350);
  await page.mouse.up();
}

async function aguardarResultado(context, page, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    for (const pagina of context.pages()) {
      if (!pagina.isClosed() && /guiaCND\.xhtml/i.test(pagina.url())) {
        return {
          tipo: "GUIA_CND",
          page: pagina,
          url: pagina.url(),
        };
      }
    }

    const mensagens = await obterMensagens(page);
    const texto = await obterTextoPagina(page);

    if (/Captcha inválido/i.test(texto)) {
      return {
        tipo: "CAPTCHA_INVALIDO",
        page,
        url: page.url(),
        mensagens,
        texto: texto.replace(/\s+/g, " ").slice(0, 2000),
      };
    }

    if (mensagens.length > 0) {
      log("mensagens_parciais", { mensagens });
    }

    await page.waitForTimeout(500);
  }

  return {
    tipo: "TIMEOUT",
    page,
    url: page.url(),
    mensagens: await obterMensagens(page),
    texto: (await obterTextoPagina(page)).replace(/\s+/g, " ").slice(0, 2000),
  };
}

await mkdir(dir, { recursive: true });

log("inicio", {
  dir,
  indiceCadastral,
  mesAnoInicio,
  mesAnoFinal,
  headless,
  slowMo,
  locale,
  timezoneId,
  acceptLanguage,
  delayAntesPesquisar,
});

const browser = await chromium.launch({
  headless,
  slowMo,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    `--lang=${locale}`,
  ],
});

const context = await browser.newContext({
  locale,
  timezoneId,
  viewport: {
    width: 1366,
    height: 768,
  },
  extraHTTPHeaders: {
    "Accept-Language": acceptLanguage,
  },
  recordHar: {
    path: path.join(dir, "network.har"),
    content: "embed",
  },
});

await context.tracing.start({
  screenshots: true,
  snapshots: true,
  sources: true,
});

context.on("page", pagina => {
  log("nova_pagina", { url: pagina.url() });
});

const page = await context.newPage();

page.on("console", message => {
  log("browser_console", {
    type: message.type(),
    text: message.text(),
  });
});

page.on("pageerror", error => {
  log("browser_pageerror", {
    message: error.message,
  });
});

page.on("request", request => {
  const url = request.url();

  if (!isUrlRelevante(url)) {
    return;
  }

  log("request", {
    method: request.method(),
    resourceType: request.resourceType(),
    url,
  });
});

page.on("response", response => {
  const url = response.url();

  if (!isUrlRelevante(url)) {
    return;
  }

  log("response", {
    status: response.status(),
    url,
  });
});

try {
  await page.goto("https://cnd.pbh.gov.br/CNDOnline/", {
    waitUntil: "load",
    timeout: 60000,
  });

  log("estado_browser_inicial", await obterEstadoBrowser(page));
  await screenshot(page, "01-home");

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
        panel.querySelectorAll('input[type="text"]')
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

  log("estado_browser_preenchido", await obterEstadoBrowser(page));
  log("captcha_antes", await obterEstadoCaptcha(page));
  await screenshot(page, "02-preenchido");

  if (delayAntesPesquisar > 0) {
    log("aguardando_antes_pesquisar", { delayAntesPesquisar });
    await page.waitForTimeout(delayAntesPesquisar);
  }

  await clicarBotaoPesquisarComoUsuario(page);

  await page.waitForTimeout(1500);

  log("captcha_depois_clique", await obterEstadoCaptcha(page));
  await screenshot(page, "03-depois-clique");

  const resultado = await aguardarResultado(context, page, 60000);

  log("resultado", {
    tipo: resultado.tipo,
    url: resultado.url,
    mensagens: resultado.mensagens,
    texto: resultado.texto,
  });

  await screenshot(resultado.page, "04-final");

  if (resultado.tipo === "GUIA_CND") {
    const tabela = resultado.page.locator("#tabelaPrincipal").first();

    await tabela.waitFor({
      state: "visible",
      timeout: 30000,
    });

    const textoTabela = await tabela.innerText();

    log("texto_tabela_resultado", {
      texto: textoTabela.replace(/\s+/g, " ").slice(0, 3000),
    });
  }
} catch (error) {
  log("erro", {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : null,
  });

  await screenshot(page, "99-erro");
} finally {
  await writeFile(
    path.join(dir, "logs.json"),
    JSON.stringify(eventos, null, 2)
  );

  await context.tracing.stop({
    path: path.join(dir, "trace.zip"),
  });

  await context.close();
  await browser.close();

  console.log("");
  console.log("DIAGNÓSTICO FINALIZADO");
  console.log(`Artefatos: ${dir}`);
  console.log("");
}
