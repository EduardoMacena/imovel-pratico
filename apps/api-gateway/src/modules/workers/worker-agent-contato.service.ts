import { Prisma, prisma } from "@imovel-pratico/database";
import type { WorkerAgentAutenticado } from "./worker-agent.auth.js";

type ContatoCpfResponse = {
	fonte: "FONTEDATA" | "INFOQUALY" | "NONE";
	nome: string | null;
	cpf: string | null;
	telefone: string | null;
	email: string | null;
	endereco: string | null;
	dadosContato: Record<string, unknown> | null;
};

function toPrismaJson(value: unknown): Prisma.InputJsonValue | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function onlyNumbers(value: string) {
	return value.replace(/\D/g, "");
}

function mascararCpfPrimeirosTres(cpf: string | null | undefined) {
	if (!cpf) {
		return null;
	}

	const digits = cpf.replace(/\D/g, "");

	if (digits.length < 3) {
		return null;
	}

	return `${digits.slice(0, 3)}.***.***-**`;
}

function emptyContato(cpf: string | null): ContatoCpfResponse {
	return {
		fonte: "NONE",
		nome: null,
		cpf,
		telefone: null,
		email: null,
		endereco: null,
		dadosContato: null,
	};
}

function getFonteDataConfig() {
	const enabled = process.env.FONTEDATA_ENABLED?.trim().toLowerCase();

	if (enabled && !["true", "1", "sim", "yes"].includes(enabled)) {
		return null;
	}

	const apiKey = process.env.FONTEDATA_API_KEY?.trim();
	const baseUrl = process.env.FONTEDATA_BASE_URL?.trim().replace(/\/$/, "");

	if (!apiKey || !baseUrl) {
		return null;
	}

	return {
		apiKey,
		baseUrl,
	};
}

function getContainers(raw: unknown): Array<Record<string, unknown>> {
	const root = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

	const containers: unknown[] = [
		root,
		root.data,
		root.dados,
		root.result,
		root.resultado,
		root.pessoa,
	];

	return containers
		.flatMap((item) => {
			if (Array.isArray(item)) {
				return item;
			}

			return [item];
		})
		.filter((item): item is Record<string, unknown> => {
			return Boolean(item && typeof item === "object" && !Array.isArray(item));
		});
}

function pickString(raw: unknown, keys: string[]) {
	const containers = getContainers(raw);

	for (const container of containers) {
		for (const key of keys) {
			const value = container[key];

			if (typeof value === "string" && value.trim()) {
				return value.trim();
			}

			if (typeof value === "number") {
				return String(value);
			}
		}
	}

	return null;
}

function pickFromArray(raw: unknown, arrayKeys: string[], valueKeys: string[]) {
	const containers = getContainers(raw);

	for (const container of containers) {
		for (const arrayKey of arrayKeys) {
			const value = container[arrayKey];

			if (!Array.isArray(value)) {
				continue;
			}

			for (const item of value) {
				if (!item || typeof item !== "object") {
					continue;
				}

				const record = item as Record<string, unknown>;

				for (const valueKey of valueKeys) {
					const result = record[valueKey];

					if (typeof result === "string" && result.trim()) {
						return result.trim();
					}

					if (typeof result === "number") {
						return String(result);
					}
				}
			}
		}
	}

	return null;
}

function normalizarFonteData(raw: unknown, cpfOriginal: string): ContatoCpfResponse {
	const telefone =
		pickString(raw, ["telefone", "celular", "whatsapp", "phone"]) ??
		pickFromArray(
			raw,
			["telefones", "phones", "contatos"],
			["telefone", "celular", "numero", "valor", "phone"]
		);

	const email =
		pickString(raw, ["email", "e_mail", "mail"]) ??
		pickFromArray(raw, ["emails", "contatos"], ["email", "valor", "mail"]);

	return {
		fonte: "FONTEDATA",
		nome: pickString(raw, ["nome", "nomeCompleto", "name"]),
		cpf: pickString(raw, ["cpf", "documento"]) ?? cpfOriginal,
		telefone,
		email,
		endereco: pickString(raw, ["endereco", "endereço", "address"]),
		dadosContato: null,
	};
}

async function consultarFonteData(cpf: string) {
	const config = getFonteDataConfig();

	if (!config) {
		return emptyContato(cpf);
	}

	const cpfLimpo = onlyNumbers(cpf);

	const response = await fetch(
		`${config.baseUrl}/consulta/cadastro-pf-basica/${cpfLimpo}`,
		{
			method: "GET",
			headers: {
				"X-API-Key": config.apiKey,
				Accept: "application/json",
			},
		}
	);

	const raw = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(`Erro FonteData: ${response.status}`);
	}

	return normalizarFonteData(raw, cpf);
}

export async function buscarContatoCpfAgent(params: {
	agent: WorkerAgentAutenticado;
	cpf: string;
}) {
	if (params.agent.tipo !== "CND") {
		const error = new Error("Somente Agent CND pode consultar contato por CPF");
		Object.assign(error, { statusCode: 403 });
		throw error;
	}

	const cpfLimpo = onlyNumbers(params.cpf);

	if (cpfLimpo.length !== 11) {
		return emptyContato(params.cpf);
	}

	try {
		const contato = await consultarFonteData(params.cpf);

		await prisma.consultaLog.create({
			data: {
				clienteId: params.agent.clienteId,
				fonte: contato.fonte,
				acao: "BUSCAR_CONTATO_AGENT_API",
				sucesso: contato.fonte !== "NONE",
				mensagemErro: null,
			},
		});

		return contato;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);

		await prisma.consultaLog.create({
			data: {
				clienteId: params.agent.clienteId,
				fonte: "FONTEDATA",
				acao: "BUSCAR_CONTATO_AGENT_API",
				sucesso: false,
				mensagemErro: message,
			},
		});

		await prisma.operacaoEvento.create({
			data: {
				clienteId: params.agent.clienteId,
				servico: "API_GATEWAY",
				nivel: "WARN",
				tipo: "AGENT_CONTATO_ERRO",
				mensagem: "Erro ao consultar contato do proprietário pela API",
				detalhes: message,
				metadata: toPrismaJson({
					agentId: params.agent.id,
					cpf: mascararCpfPrimeirosTres(params.cpf),
				}),
			},
		});

		return emptyContato(params.cpf);
	}
}