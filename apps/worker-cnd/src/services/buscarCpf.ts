import { mkdir } from "node:fs/promises";
import type { BrowserContext, Page } from "playwright";
import { getBrowser } from "../playwright/browser.js";

type CndClickMode = "js" | "mouse";

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

function getBrowserContextOptions() {
	return {
		locale: process.env.PLAYWRIGHT_LOCALE ?? "pt-BR",
		timezoneId: process.env.PLAYWRIGHT_TIMEZONE ?? "America/Sao_Paulo",
		viewport: {
			width: 1366,
			height: 768,
		},
		extraHTTPHeaders: {
			"Accept-Language":
				process.env.PLAYWRIGHT_ACCEPT_LANGUAGE ?? "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
		},
	};
}

function isCndDebugScreenshotsEnabled() {
	return process.env.CND_DEBUG_SCREENSHOTS === "true";
}

function normalizarNomeArquivo(value: string) {
	return value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
}

async function salvarScreenshotCnd(page: Page, etapa: string, indiceCadastral: string) {
	if (!isCndDebugScreenshotsEnabled()) {
		return;
	}

	const dir = "/tmp/cnd-debug";
	await mkdir(dir, { recursive: true });

	const arquivo = `${dir}/${Date.now()}-${normalizarNomeArquivo(
		indiceCadastral
	)}-${etapa}.png`;

	await page.screenshot({
		path: arquivo,
		fullPage: true,
	});

	console.log("Screenshot CND PBH salvo:", arquivo);
}

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
			`${label}\\s*:\\s*(.+?)(?=\\s+(?:${proximos})(?:\\s|:)|$)`,
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

	return extrairCampo(
		texto,
		["CPF", "CPF/CNPJ"],
		["Nome", "Endereço", "Endereco", "Índice", "Indice"]
	);
}

function limparIndiceCadastralCnd(value: string | null | undefined, fallback: string) {
	const raw = value?.trim() || fallback;

	const limpo = raw
		.replace(
			/\s+(?:Ressalvando|Nos termos|Per[ií]odo pesquisado|Periodo pesquisado|Certifica)\b.*$/i,
			""
		)
		.replace(/\s+/g, " ")
		.trim();

	return limpo || fallback;
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

async function aguardarPaginaGuiaCnd(
	context: BrowserContext,
	page: Page,
	timeoutMs: number
) {
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		const paginas = context.pages();

		for (const pagina of paginas) {
			if (pagina.isClosed()) {
				continue;
			}

			const url = pagina.url();

			if (/guiaCND\.xhtml/i.test(url)) {
				await pagina
					.waitForLoadState("load", {
						timeout: 60000,
					})
					.catch(() => undefined);

				return pagina;
			}
		}

		if (/guiaCND\.xhtml/i.test(page.url())) {
			await page
				.waitForLoadState("load", {
					timeout: 60000,
				})
				.catch(() => undefined);

			return page;
		}

		await page.waitForTimeout(500);
	}

	return null;
}

async function obterMensagensDaPagina(page: Page) {
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
				.flatMap((seletor) =>
					Array.from(document.querySelectorAll(seletor)).map((elemento) =>
						(elemento.textContent ?? "").replace(/\\s+/g, " ").trim()
					)
				)
				.filter(Boolean);
		})
		.catch(() => []);
}

async function clicarBotaoPesquisarComoUsuario(page: Page) {
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

	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
		steps: 20,
	});

	await page.waitForTimeout(800);

	await page.mouse.down();
	await page.waitForTimeout(250);
	await page.mouse.up();
}

async function obterEstadoCaptcha(page: Page) {
	return page
		.evaluate(() => {
			const response = document.querySelector<HTMLTextAreaElement>(
				'textarea[name="g-recaptcha-response"]'
			);

			const iframes = Array.from(document.querySelectorAll("iframe")).map((iframe) => ({
				title: iframe.getAttribute("title"),
				src: iframe.getAttribute("src"),
			}));

			return {
				grecaptchaDisponivel:
					typeof (window as typeof window & { grecaptcha?: unknown }).grecaptcha !==
					"undefined",
				responseLength: response?.value?.length ?? 0,
				idioma: navigator.language,
				idiomas: navigator.languages,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				iframes,
			};
		})
		.catch((error) => ({
			erro: error instanceof Error ? error.message : String(error),
		}));
}

function getCndClickMode(): CndClickMode {
	const mode = process.env.CND_CLICK_MODE?.trim().toLowerCase();

	if (mode === "mouse") {
		return "mouse";
	}

	return "js";
}

async function clicarBotaoPesquisarViaJavascript(page: Page) {
	await page.evaluate(() => {
		const botao = document.getElementById("meuForm:pesquisar");

		if (!botao) {
			throw new Error("Botão pesquisar não encontrado");
		}

		botao.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
		botao.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		botao.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
		botao.dispatchEvent(new MouseEvent("click", { bubbles: true }));

		if (botao instanceof HTMLElement) {
			botao.click();
		}
	});
}

async function executarCliquePorModo(page: Page, mode: CndClickMode) {
	console.log(`[CND PBH] Executando clique no modo: ${mode}`);

	if (mode === "js") {
		await clicarBotaoPesquisarViaJavascript(page);
		return;
	}

	await clicarBotaoPesquisarComoUsuario(page);
}

async function tentarAbrirGuiaCndComModo(
	context: BrowserContext,
	page: Page,
	mode: CndClickMode,
	timeoutMs: number
) {
	const paginaGuiaPromise = aguardarPaginaGuiaCnd(context, page, timeoutMs);

	console.log(
		`[CND PBH] Estado captcha antes do clique (${mode}):`,
		await obterEstadoCaptcha(page)
	);

	await executarCliquePorModo(page, mode);

	console.log(
		`[CND PBH] Estado captcha depois do clique (${mode}):`,
		await obterEstadoCaptcha(page)
	);

	const paginaResultado = await paginaGuiaPromise;
	const mensagens = await obterMensagensDaPagina(page);
	const textoPagina = await obterTextoDaPagina(page);

	return {
		paginaResultado,
		mensagens,
		textoPagina,
	};
}

async function clicarPesquisarEObterPaginaResultado(context: BrowserContext, page: Page) {
	const modoPreferido = getCndClickMode();

	const modosTentativa: CndClickMode[] =
		modoPreferido === "js" ? ["js", "mouse"] : ["mouse"];

	let ultimasMensagens: string[] = [];
	let ultimoTextoPagina = "";

	for (let index = 0; index < modosTentativa.length; index++) {
		const mode = modosTentativa[index];

		const { paginaResultado, mensagens, textoPagina } = await tentarAbrirGuiaCndComModo(
			context,
			page,
			mode,
			20000
		);

		if (paginaResultado) {
			if (mode !== modosTentativa[0]) {
				console.warn(`[CND PBH] Guia aberta com fallback de clique (${mode}).`);
			}

			return paginaResultado;
		}

		ultimasMensagens = mensagens;
		ultimoTextoPagina = textoPagina;

		const captchaInvalido =
			mensagens.some((mensagem) => /captcha inválido/i.test(mensagem)) ||
			/captcha inválido/i.test(textoPagina);

		const aindaTemFallback = index < modosTentativa.length - 1;

		if (aindaTemFallback) {
			console.warn(
				`[CND PBH] Clique modo=${mode} não abriu a guia. ` +
					`Captcha inválido: ${captchaInvalido}. Tentando fallback...`
			);

			await page.waitForTimeout(2000);
			continue;
		}
	}

	throw new Error(
		`A CND PBH não abriu a guiaCND.xhtml após as tentativas de clique. ` +
			`URL atual: ${page.url()}. Mensagens: ${JSON.stringify(
				ultimasMensagens
			)}. Texto da página: ${limitarTexto(ultimoTextoPagina)}`
	);
}

export async function buscarCpf({
	indiceCadastral,
	mesAnoInicio,
	mesAnoFinal,
}: BuscarCpfParams): Promise<ProprietarioEncontrado> {
	const browser = await getBrowser();
	const context = await browser.newContext(getBrowserContextOptions());
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
			(values) => {
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

		await salvarScreenshotCnd(page, "antes-pesquisar", indiceCadastral);

		let paginaResultado: Page;

		try {
			paginaResultado = await clicarPesquisarEObterPaginaResultado(context, page);
		} catch (error) {
			await salvarScreenshotCnd(page, "erro-apos-pesquisar", indiceCadastral);
			throw error;
		}

		await salvarScreenshotCnd(paginaResultado, "pagina-resultado", indiceCadastral);

		console.log("Página resultado CND PBH:", paginaResultado.url());

		const urlResultado = paginaResultado.url();

		if (!/guiaCND\.xhtml/i.test(urlResultado)) {
			const textoPagina = await obterTextoDaPagina(paginaResultado);

			throw new Error(
				`Página inválida para extração da CND. Esperado guiaCND.xhtml, recebido ${urlResultado}. Texto: ${limitarTexto(
					textoPagina
				)}`
			);
		}

		const tabelaResultado = await aguardarTabelaResultado(paginaResultado);

		const texto = await tabelaResultado.innerText();

		console.log("Texto bruto tabela CND PBH:", limitarTexto(texto, 2000));

		const nome = extrairCampo(
			texto,
			["Nome"],
			["CPF", "CPF/CNPJ", "Endereço", "Endereco", "Índice", "Indice"]
		);

		const cpf = extrairCpf(texto);

		const endereco = extrairCampo(
			texto,
			["Endereco", "Endereço"],
			["Periodo pesquisado", "Período pesquisado", "Indice cadastral", "Índice cadastral"]
		);

		const indiceResultadoRaw =
			extrairCampo(
				texto,
				["Índice cadastral do IPTU", "Indice cadastral do IPTU"],
				["Ressalvando", "Nos termos"]
			) ?? indiceCadastral;

		const indiceResultado = limparIndiceCadastralCnd(indiceResultadoRaw, indiceCadastral);

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
