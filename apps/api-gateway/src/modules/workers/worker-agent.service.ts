import { Prisma, prisma } from "@imovel-pratico/database";
import type { WorkerAgentAutenticado } from "./worker-agent.auth.js";

const LEASE_MINUTOS = Number(process.env.WORKER_AGENT_LEASE_MINUTES ?? 10);

function adicionarMinutos(date: Date, minutos: number) {
	const next = new Date(date);
	next.setMinutes(next.getMinutes() + minutos);
	return next;
}

function toPrismaJson(value: unknown): Prisma.InputJsonValue | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
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

function normalizarRegistrosPrevia(value: unknown) {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => {
			const registro = item as {
				indiceCadastral?: unknown;
				complemento?: unknown;
			};

			return {
				indiceCadastral:
					typeof registro.indiceCadastral === "string"
						? registro.indiceCadastral.trim()
						: "",
				complemento:
					typeof registro.complemento === "string"
						? registro.complemento.trim() || null
						: null,
			};
		})
		.filter((registro) => registro.indiceCadastral.length > 0);
}

export async function registrarHeartbeatAgent(params: {
	agent: WorkerAgentAutenticado;
	versao?: string;
	metadata?: Record<string, unknown>;
}) {
	const metadata = {
		...(params.metadata ?? {}),
		versao: params.versao ?? null,
		pid: params.metadata?.pid ?? null,
		receivedAt: new Date().toISOString(),
	};

	await prisma.workerAgent.update({
		where: {
			id: params.agent.id,
		},
		data: {
			ultimoSinalEm: new Date(),
			metadata: toPrismaJson(metadata),
		},
	});

	await prisma.workerHeartbeat.upsert({
		where: {
			clienteId_servico_identificador: {
				clienteId: params.agent.clienteId,
				servico: params.agent.tipo === "CND" ? "WORKER_CND" : "WORKER_REGISTRO",
				identificador: params.agent.identificador,
			},
		},
		create: {
			clienteId: params.agent.clienteId,
			servico: params.agent.tipo === "CND" ? "WORKER_CND" : "WORKER_REGISTRO",
			identificador: params.agent.identificador,
			fila: "agent-api",
			status: "ONLINE",
			ultimoSinalEm: new Date(),
			metadata: toPrismaJson(metadata),
		},
		update: {
			status: "ONLINE",
			ultimoSinalEm: new Date(),
			metadata: toPrismaJson(metadata),
		},
	});

	return {
		ok: true,
		status: "ONLINE",
		receivedAt: new Date().toISOString(),
	};
}

async function clienteTemRegistroAtivo(clienteId: string) {
	const now = new Date();

	const ativa = await prisma.buscaPrevia.findFirst({
		where: {
			clienteId,
			agentWorkerId: {
				not: null,
			},
			agentLeaseExpiraEm: {
				gt: now,
			},
			status: {
				in: ["AGUARDANDO_INTERVALO", "CONSULTANDO_REGISTRO"],
			},
		},
		select: {
			id: true,
		},
	});

	return Boolean(ativa);
}

async function clienteTemCndAtivo(clienteId: string) {
	const now = new Date();

	const ativa = await prisma.tarefa.findFirst({
		where: {
			clienteId,
			agentWorkerId: {
				not: null,
			},
			agentLeaseExpiraEm: {
				gt: now,
			},
			status: "PROCESSING",
		},
		select: {
			id: true,
		},
	});

	return Boolean(ativa);
}

async function claimRegistro(agent: WorkerAgentAutenticado) {
	if (await clienteTemRegistroAtivo(agent.clienteId)) {
		return null;
	}

	const now = new Date();
	const leaseExpiraEm = adicionarMinutos(now, LEASE_MINUTOS);

	const previa = await prisma.buscaPrevia.findFirst({
		where: {
			clienteId: agent.clienteId,
			expiraEm: {
				gt: now,
			},
			status: {
				in: ["PROCESSANDO", "AGUARDANDO_INTERVALO", "CONSULTANDO_REGISTRO"],
			},
			OR: [
				{
					agentLeaseExpiraEm: null,
				},
				{
					agentLeaseExpiraEm: {
						lt: now,
					},
				},
			],
		},
		orderBy: {
			createdAt: "asc",
		},
	});

	if (!previa) {
		return null;
	}

	const claimed = await prisma.buscaPrevia.updateMany({
		where: {
			id: previa.id,
			OR: [
				{
					agentLeaseExpiraEm: null,
				},
				{
					agentLeaseExpiraEm: {
						lt: now,
					},
				},
			],
		},
		data: {
			status: "AGUARDANDO_INTERVALO",
			agentWorkerId: agent.id,
			agentLeaseExpiraEm: leaseExpiraEm,
			agentTentativas: {
				increment: 1,
			},
			erro: null,
		},
	});

	if (claimed.count <= 0) {
		return null;
	}

	const atualizada = await prisma.buscaPrevia.findUniqueOrThrow({
		where: {
			id: previa.id,
		},
	});

	await prisma.operacaoEvento.create({
		data: {
			clienteId: agent.clienteId,
			buscaPreviaId: atualizada.id,
			servico: "API_GATEWAY",
			tipo: "AGENT_REGISTRO_CLAIM",
			mensagem: `Agent ${agent.identificador} assumiu a busca prévia`,
			metadata: toPrismaJson({
				agentId: agent.id,
				leaseExpiraEm,
			}),
		},
	});

	return {
		tipo: "REGISTRO" as const,
		id: atualizada.id,
		clienteId: atualizada.clienteId,
		logradouro: atualizada.logradouro,
		numero: atualizada.numero,
		leaseExpiraEm,
	};
}

async function claimCnd(agent: WorkerAgentAutenticado) {
	if (await clienteTemCndAtivo(agent.clienteId)) {
		return null;
	}

	const now = new Date();
	const leaseExpiraEm = adicionarMinutos(now, LEASE_MINUTOS);

	const tarefa = await prisma.tarefa.findFirst({
		where: {
			clienteId: agent.clienteId,
			status: {
				in: ["PENDING", "PROCESSING"],
			},
			OR: [
				{
					agentLeaseExpiraEm: null,
				},
				{
					agentLeaseExpiraEm: {
						lt: now,
					},
				},
			],
		},
		include: {
			buscaPrevia: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	});

	if (!tarefa) {
		return null;
	}

	const claimed = await prisma.tarefa.updateMany({
		where: {
			id: tarefa.id,
			OR: [
				{
					agentLeaseExpiraEm: null,
				},
				{
					agentLeaseExpiraEm: {
						lt: now,
					},
				},
			],
		},
		data: {
			status: "PROCESSING",
			startedAt: tarefa.startedAt ?? now,
			agentWorkerId: agent.id,
			agentLeaseExpiraEm: leaseExpiraEm,
			agentTentativas: {
				increment: 1,
			},
			erro: null,
		},
	});

	if (claimed.count <= 0) {
		return null;
	}

	const atualizada = await prisma.tarefa.findUniqueOrThrow({
		where: {
			id: tarefa.id,
		},
		include: {
			buscaPrevia: true,
		},
	});

	await prisma.operacaoEvento.create({
		data: {
			clienteId: agent.clienteId,
			tarefaId: atualizada.id,
			buscaPreviaId: atualizada.buscaPreviaId,
			servico: "API_GATEWAY",
			tipo: "AGENT_CND_CLAIM",
			mensagem: `Agent ${agent.identificador} assumiu a tarefa CND`,
			metadata: toPrismaJson({
				agentId: agent.id,
				leaseExpiraEm,
			}),
		},
	});

	return {
		tipo: "CND" as const,
		id: atualizada.id,
		tarefaId: atualizada.id,
		clienteId: atualizada.clienteId,
		buscaPreviaId: atualizada.buscaPreviaId,
		logradouro: atualizada.buscaPrevia?.logradouro ?? atualizada.logradouro,
		numero: atualizada.buscaPrevia?.numero ?? atualizada.numero,
		mesAnoInicio: atualizada.mesAnoInicio,
		mesAnoFinal: atualizada.mesAnoFinal,
		intervaloSegundos: atualizada.intervaloSegundos,
		forceRefresh: atualizada.forceRefresh,
		registros: normalizarRegistrosPrevia(atualizada.buscaPrevia?.registros),
		leaseExpiraEm,
	};
}

export async function claimProximoJob(agent: WorkerAgentAutenticado) {
	await registrarHeartbeatAgent({
		agent,
		metadata: {
			action: "claim",
		},
	});

	const job =
		agent.tipo === "REGISTRO"
			? await claimRegistro(agent)
			: await claimCnd(agent);

	if (!job) {
		return {
			hasJob: false,
			job: null,
		};
	}

	return {
		hasJob: true,
		job,
	};
}

export async function registrarProgressoJob(params: {
	agent: WorkerAgentAutenticado;
	jobId: string;
	total?: number;
	current?: number;
	status?: string;
	item?: {
		status: "success" | "error";
		logradouro: string;
		numero: string;
		imovel?: string | null;
		indiceCadastral: string;
		proprietario?: {
			nome?: string | null;
			cpf?: string | null;
			endereco?: string | null;
		} | null;
		telefone?: string | null;
		email?: string | null;
		fonteContato?: string | null;
		dadosContato?: Record<string, unknown> | null;
		error?: string | null;
		fromCache?: boolean;
	};
}) {
	const now = new Date();
	const leaseExpiraEm = adicionarMinutos(now, LEASE_MINUTOS);

	if (params.agent.tipo === "REGISTRO") {
		await prisma.buscaPrevia.updateMany({
			where: {
				id: params.jobId,
				clienteId: params.agent.clienteId,
				agentWorkerId: params.agent.id,
			},
			data: {
				agentLeaseExpiraEm: leaseExpiraEm,
				status:
					params.status === "CONSULTANDO_REGISTRO"
						? "CONSULTANDO_REGISTRO"
						: undefined,
			},
		});

		return {
			ok: true,
			leaseExpiraEm,
		};
	}

	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id: params.jobId,
			clienteId: params.agent.clienteId,
			agentWorkerId: params.agent.id,
		},
	});

	if (!tarefa) {
		const error = new Error("Tarefa não encontrada para este agent");
		Object.assign(error, { statusCode: 404 });
		throw error;
	}

	await prisma.tarefa.update({
		where: {
			id: tarefa.id,
		},
		data: {
			total: params.total ?? tarefa.total,
			current: params.current ?? tarefa.current,
			agentLeaseExpiraEm: leaseExpiraEm,
		},
	});

	const item = params.item;

	if (item) {
		const existente = await prisma.tarefaResultado.findFirst({
			where: {
				tarefaId: tarefa.id,
				indiceCadastral: item.indiceCadastral,
			},
		});

		const dataResultado = {
			status:
				item.status === "success" ? ("SUCCESS" as const) : ("ERROR" as const),
			logradouro: item.logradouro,
			numero: item.numero,
			complemento: item.imovel ?? null,
			indiceCadastral: item.indiceCadastral,
			nome: item.proprietario?.nome ?? null,

			// CPF completo nunca é persistido.
			// No modo Agent, salvamos apenas CPF mascarado com os 3 primeiros dígitos.
			cpf: mascararCpfPrimeirosTres(item.proprietario?.cpf),

			endereco: item.proprietario?.endereco ?? null,
			telefone: item.telefone ?? null,
			email: item.email ?? null,
			fonteContato: item.fonteContato ?? null,
			dadosContato: toPrismaJson(item.dadosContato) ?? Prisma.JsonNull,
			erro: item.error ?? null,
		};

		if (existente) {
			await prisma.tarefaResultado.update({
				where: {
					id: existente.id,
				},
				data: dataResultado,
			});
		} else {
			await prisma.tarefaResultado.create({
				data: {
					tarefaId: tarefa.id,
					...dataResultado,
				},
			});
		}

		await prisma.consultaLog.create({
			data: {
				clienteId: tarefa.clienteId,
				fonte: item.fromCache ? "CACHE" : "CND",
				acao: "BUSCAR_PROPRIETARIO_AGENT",
				sucesso: item.status === "success",
				mensagemErro: item.error ?? null,
			},
		});

		if (item.fonteContato) {
			await prisma.consultaLog.create({
				data: {
					clienteId: tarefa.clienteId,
					fonte: item.fonteContato,
					acao: "BUSCAR_CONTATO_AGENT",
					sucesso: item.status === "success",
					mensagemErro: item.error ?? null,
				},
			});
		}

		await prisma.operacaoEvento.create({
			data: {
				clienteId: tarefa.clienteId,
				tarefaId: tarefa.id,
				buscaPreviaId: tarefa.buscaPreviaId,
				servico: "API_GATEWAY",
				nivel: item.status === "success" ? "INFO" : "WARN",
				tipo: "AGENT_RESULTADO_PROCESSADO",
				mensagem:
					item.status === "success"
						? "Resultado recebido do agent com sucesso"
						: "Resultado recebido do agent com erro",
				metadata: toPrismaJson({
					agentId: params.agent.id,
					indiceCadastral: item.indiceCadastral,
					complemento: item.imovel ?? null,
					fonteContato: item.fonteContato ?? null,
					erro: item.error ?? null,
				}),
			},
		});
	}

	return {
		ok: true,
		leaseExpiraEm,
	};
}

export async function concluirJobRegistro(params: {
	agent: WorkerAgentAutenticado;
	jobId: string;
	registros: Array<{
		indiceCadastral: string;
		complemento?: string | null;
	}>;
}) {
	const previa = await prisma.buscaPrevia.findFirst({
		where: {
			id: params.jobId,
			clienteId: params.agent.clienteId,
			agentWorkerId: params.agent.id,
		},
	});

	if (!previa) {
		const error = new Error("Busca prévia não encontrada para este agent");
		Object.assign(error, { statusCode: 404 });
		throw error;
	}

	const registros = params.registros.map((registro) => ({
		indiceCadastral: registro.indiceCadastral,
		complemento: registro.complemento ?? null,
	}));

	const atualizada = await prisma.buscaPrevia.update({
		where: {
			id: previa.id,
		},
		data: {
			status: "PRONTA",
			quantidadeRegistros: registros.length,
			registros: toPrismaJson(registros),
			erro: null,
			agentLeaseExpiraEm: null,
		},
	});

	await prisma.operacaoEvento.create({
		data: {
			clienteId: params.agent.clienteId,
			buscaPreviaId: atualizada.id,
			servico: "API_GATEWAY",
			tipo: "AGENT_REGISTRO_CONCLUIDO",
			mensagem: `Busca prévia concluída pelo agent com ${registros.length} registro(s)`,
			metadata: toPrismaJson({
				agentId: params.agent.id,
				quantidadeRegistros: registros.length,
			}),
		},
	});

	return {
		ok: true,
		status: atualizada.status,
		quantidadeRegistros: atualizada.quantidadeRegistros,
	};
}

export async function concluirJobCnd(params: {
	agent: WorkerAgentAutenticado;
	jobId: string;
}) {
	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id: params.jobId,
			clienteId: params.agent.clienteId,
			agentWorkerId: params.agent.id,
		},
	});

	if (!tarefa) {
		const error = new Error("Tarefa não encontrada para este agent");
		Object.assign(error, { statusCode: 404 });
		throw error;
	}

	const totalResultados = await prisma.tarefaResultado.count({
		where: {
			tarefaId: tarefa.id,
		},
	});

	const atualizada = await prisma.tarefa.update({
		where: {
			id: tarefa.id,
		},
		data: {
			status: "COMPLETED",
			total: Math.max(tarefa.total, totalResultados),
			current: Math.max(tarefa.current, totalResultados),
			completedAt: new Date(),
			agentLeaseExpiraEm: null,
			erro: null,
		},
	});

	await prisma.operacaoEvento.create({
		data: {
			clienteId: tarefa.clienteId,
			tarefaId: tarefa.id,
			buscaPreviaId: tarefa.buscaPreviaId,
			servico: "API_GATEWAY",
			tipo: "AGENT_CND_CONCLUIDO",
			mensagem: "Tarefa CND concluída pelo agent",
			metadata: toPrismaJson({
				agentId: params.agent.id,
				totalResultados,
			}),
		},
	});

	return {
		ok: true,
		status: atualizada.status,
		total: atualizada.total,
		current: atualizada.current,
	};
}

export async function concluirJobComErro(params: {
	agent: WorkerAgentAutenticado;
	jobId: string;
	message: string;
	stack?: string;
	metadata?: Record<string, unknown>;
}) {
	if (params.agent.tipo === "REGISTRO") {
		const previa = await prisma.buscaPrevia.findFirst({
			where: {
				id: params.jobId,
				clienteId: params.agent.clienteId,
				agentWorkerId: params.agent.id,
			},
		});

		if (!previa) {
			const error = new Error("Busca prévia não encontrada para este agent");
			Object.assign(error, { statusCode: 404 });
			throw error;
		}

		await prisma.buscaPrevia.update({
			where: {
				id: previa.id,
			},
			data: {
				status: "ERRO",
				erro: params.message,
				agentLeaseExpiraEm: null,
			},
		});

		await prisma.operacaoEvento.create({
			data: {
				clienteId: params.agent.clienteId,
				buscaPreviaId: previa.id,
				servico: "API_GATEWAY",
				nivel: "ERROR",
				tipo: "AGENT_REGISTRO_ERRO",
				mensagem: params.message,
				detalhes: params.stack ?? null,
				metadata: toPrismaJson({
					agentId: params.agent.id,
					...(params.metadata ?? {}),
				}),
			},
		});

		return {
			ok: true,
			status: "ERRO",
		};
	}

	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id: params.jobId,
			clienteId: params.agent.clienteId,
			agentWorkerId: params.agent.id,
		},
	});

	if (!tarefa) {
		const error = new Error("Tarefa não encontrada para este agent");
		Object.assign(error, { statusCode: 404 });
		throw error;
	}

	await prisma.tarefa.update({
		where: {
			id: tarefa.id,
		},
		data: {
			status: "ERROR",
			erro: params.message,
			completedAt: new Date(),
			agentLeaseExpiraEm: null,
		},
	});

	await prisma.operacaoEvento.create({
		data: {
			clienteId: tarefa.clienteId,
			tarefaId: tarefa.id,
			buscaPreviaId: tarefa.buscaPreviaId,
			servico: "API_GATEWAY",
			nivel: "ERROR",
			tipo: "AGENT_CND_ERRO",
			mensagem: params.message,
			detalhes: params.stack ?? null,
			metadata: toPrismaJson({
				agentId: params.agent.id,
				...(params.metadata ?? {}),
			}),
		},
	});

	return {
		ok: true,
		status: "ERROR",
	};
}
