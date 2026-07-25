export type RegistroAgentJob = {
	tipo: "REGISTRO";
	id: string;
	clienteId: string;
	logradouro: string;
	numero: string;
	leaseExpiraEm: string;
};

export type CndAgentJob = {
	tipo: "CND";
	id: string;
	tarefaId: string;
	clienteId: string;
	buscaPreviaId: string | null;
	logradouro: string;
	numero: string;
	mesAnoInicio: string;
	mesAnoFinal: string;
	intervaloSegundos: number;
	forceRefresh: boolean;
	registros: Array<{
		indiceCadastral: string;
		complemento: string | null;
	}>;
	leaseExpiraEm: string;
};

export type ContatoCpfResponse = {
	fonte: "FONTEDATA" | "INFOQUALY" | "NONE";
	nome: string | null;
	cpf: string | null;
	telefone: string | null;
	email: string | null;
	endereco: string | null;
	dadosContato: Record<string, unknown> | null;
};

export type AgentJob = RegistroAgentJob | CndAgentJob;

export type ClaimResponse =
	| {
			hasJob: false;
			job: null;
	  }
	| {
			hasJob: true;
			job: AgentJob;
	  };

export type AgentConfig = {
	apiUrl: string;
	token: string;
	pollIntervalMs: number;
	heartbeatIntervalMs: number;
	errorDelayMs: number;
	versao: string;
};

export class AgentApiError extends Error {
	statusCode: number;
	responseBody: unknown;

	constructor(message: string, statusCode: number, responseBody: unknown) {
		super(message);
		this.name = "AgentApiError";
		this.statusCode = statusCode;
		this.responseBody = responseBody;
	}
}

function getRequiredEnv(name: string) {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`${name} não configurado`);
	}

	return value;
}

function getNumberEnv(name: string, fallback: number) {
	const raw = process.env[name]?.trim();

	if (!raw) {
		return fallback;
	}

	const parsed = Number(raw);

	if (!Number.isFinite(parsed) || parsed <= 0) {
		return fallback;
	}

	return parsed;
}

export function getAgentConfig(): AgentConfig {
	return {
		apiUrl: getRequiredEnv("API_URL").replace(/\/$/, ""),
		token: getRequiredEnv("WORKER_TOKEN"),
		pollIntervalMs: getNumberEnv("WORKER_AGENT_POLL_INTERVAL_MS", 5000),
		heartbeatIntervalMs: getNumberEnv("WORKER_AGENT_HEARTBEAT_INTERVAL_MS", 30000),
		errorDelayMs: getNumberEnv("WORKER_AGENT_ERROR_DELAY_MS", 15000),
		versao: process.env.WORKER_AGENT_VERSION?.trim() || "0.1.0",
	};
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatError(error: unknown) {
	if (error instanceof Error) {
		return {
			message: error.message,
			stack: error.stack,
			name: error.name,
		};
	}

	return {
		message: String(error),
	};
}

export class AgentApiClient {
	private readonly apiUrl: string;
	private readonly token: string;

	constructor(config: Pick<AgentConfig, "apiUrl" | "token">) {
		this.apiUrl = config.apiUrl.replace(/\/$/, "");
		this.token = config.token;
	}

	private buildUrl(path: string) {
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;
		return `${this.apiUrl}${normalizedPath}`;
	}

	private async request<TResponse>(
		path: string,
		options?: {
			method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
			body?: unknown;
			timeoutMs?: number;
		}
	): Promise<TResponse> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 120000);

		try {
			const response = await fetch(this.buildUrl(path), {
				method: options?.method ?? "POST",
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: options?.body === undefined ? undefined : JSON.stringify(options.body),
				signal: controller.signal,
			});

			const text = await response.text();

			let data: unknown = null;

			if (text.trim()) {
				data = JSON.parse(text);
			}

			if (!response.ok) {
				const message =
					typeof data === "object" &&
					data !== null &&
					"message" in data &&
					typeof data.message === "string"
						? data.message
						: `Erro HTTP ${response.status}`;

				throw new AgentApiError(message, response.status, data);
			}

			return data as TResponse;
		} finally {
			clearTimeout(timeout);
		}
	}

	heartbeat(body: { versao: string; metadata?: Record<string, unknown> }) {
		return this.request<{
			ok: boolean;
			status: string;
			receivedAt: string;
		}>("/api/workers/heartbeat", {
			body,
			timeoutMs: 30000,
		});
	}

	claim() {
		return this.request<ClaimResponse>("/api/workers/jobs/claim", {
			body: {},
			timeoutMs: 60000,
		});
	}

	buscarContatoPorCpf(body: { cpf: string | null | undefined }) {
		return this.request<ContatoCpfResponse>("/api/workers/contatos/buscar-por-cpf", {
			body,
			timeoutMs: 120000,
		});
	}

	progress(
		jobId: string,
		body: {
			status?: string;
			total?: number;
			current?: number;
			item?: unknown;
		}
	) {
		return this.request<{
			ok: boolean;
			leaseExpiraEm: string;
		}>(`/api/workers/jobs/${jobId}/progress`, {
			body,
			timeoutMs: 60000,
		});
	}

	success(jobId: string, body?: unknown) {
		return this.request<unknown>(`/api/workers/jobs/${jobId}/success`, {
			body: body ?? {},
			timeoutMs: 120000,
		});
	}

	error(
		jobId: string,
		body: {
			message: string;
			stack?: string;
			metadata?: Record<string, unknown>;
		}
	) {
		return this.request<unknown>(`/api/workers/jobs/${jobId}/error`, {
			body,
			timeoutMs: 60000,
		});
	}
}
