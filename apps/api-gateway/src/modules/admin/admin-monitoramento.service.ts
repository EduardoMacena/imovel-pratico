import { Prisma, prisma } from "@imovel-pratico/database";
import {
	getBuscarProprietariosQueue,
	getBuscarRegistrosQueue,
} from "@imovel-pratico/queue";

type MonitoramentoFiltros = {
	clienteId?: string;
	nivel?: "INFO" | "WARN" | "ERROR";
	servico?:
		"API_GATEWAY" | "WORKER_REGISTRO" | "WORKER_CND" | "QUEUE" | "REALTIME";
	tipo?: string;
	dataInicio?: Date;
	dataFim?: Date;
	take?: number;
};

function toIso(value: Date | null | undefined) {
	return value ? value.toISOString() : null;
}

function buildEventoWhere(filtros: MonitoramentoFiltros) {
	const where: Prisma.OperacaoEventoWhereInput = {};

	if (filtros.clienteId) {
		where.clienteId = filtros.clienteId;
	}

	if (filtros.nivel) {
		where.nivel = filtros.nivel;
	}

	if (filtros.servico) {
		where.servico = filtros.servico;
	}

	if (filtros.tipo) {
		where.tipo = {
			contains: filtros.tipo,
			mode: "insensitive",
		};
	}

	if (filtros.dataInicio || filtros.dataFim) {
		where.createdAt = {
			...(filtros.dataInicio ? { gte: filtros.dataInicio } : {}),
			...(filtros.dataFim ? { lte: filtros.dataFim } : {}),
		};
	}

	return where;
}

function calcularStatusWorker(params: {
	status: string;
	ultimoSinalEm: Date;
	staleBefore: Date;
}) {
	if (params.status === "ERROR") {
		return "ERROR";
	}

	if (params.ultimoSinalEm < params.staleBefore) {
		return "OFFLINE";
	}

	return "ONLINE";
}

function calcularStatusAgent(params: {
	status: string;
	ultimoSinalEm: Date | null;
	instavelBefore: Date;
	offlineBefore: Date;
}) {
	if (params.status === "REVOGADO") {
		return "REVOGADO";
	}

	if (params.status === "INATIVO") {
		return "INATIVO";
	}

	if (!params.ultimoSinalEm) {
		return "OFFLINE";
	}

	if (params.ultimoSinalEm < params.offlineBefore) {
		return "OFFLINE";
	}

	if (params.ultimoSinalEm < params.instavelBefore) {
		return "INSTAVEL";
	}

	return "ONLINE";
}

function serializeEvento(evento: {
	id: string;
	clienteId: string | null;
	tarefaId: string | null;
	buscaPreviaId: string | null;
	nivel: string;
	servico: string;
	tipo: string;
	mensagem: string;
	detalhes: string | null;
	metadata: unknown;
	createdAt: Date;
	cliente?: {
		id: string;
		nome: string;
		slug: string;
	} | null;
	tarefa?: {
		id: string;
		status: string;
		logradouro: string;
		numero: string;
	} | null;
	buscaPrevia?: {
		id: string;
		status: string;
		logradouro: string;
		numero: string;
	} | null;
}) {
	return {
		id: evento.id,
		clienteId: evento.clienteId,
		tarefaId: evento.tarefaId,
		buscaPreviaId: evento.buscaPreviaId,
		nivel: evento.nivel,
		servico: evento.servico,
		tipo: evento.tipo,
		mensagem: evento.mensagem,
		detalhes: evento.detalhes,
		metadata: evento.metadata,
		cliente: evento.cliente
			? {
					id: evento.cliente.id,
					nome: evento.cliente.nome,
					slug: evento.cliente.slug,
				}
			: null,
		tarefa: evento.tarefa
			? {
					id: evento.tarefa.id,
					status: evento.tarefa.status,
					endereco: {
						logradouro: evento.tarefa.logradouro,
						numero: evento.tarefa.numero,
					},
				}
			: null,
		buscaPrevia: evento.buscaPrevia
			? {
					id: evento.buscaPrevia.id,
					status: evento.buscaPrevia.status,
					endereco: {
						logradouro: evento.buscaPrevia.logradouro,
						numero: evento.buscaPrevia.numero,
					},
				}
			: null,
		createdAt: evento.createdAt.toISOString(),
	};
}

export async function buscarResumoMonitoramentoAdmin(filtros: {
	clienteId?: string;
}) {
	const agora = new Date();
	const inicioHoje = new Date();

	inicioHoje.setHours(0, 0, 0, 0);

	const ultimas24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
	const staleBefore = new Date(agora.getTime() - 2 * 60 * 1000);
	const agentInstavelBefore = new Date(agora.getTime() - 60 * 1000);
	const agentOfflineBefore = new Date(agora.getTime() - 3 * 60 * 1000);

	const whereCliente = filtros.clienteId
		? {
				clienteId: filtros.clienteId,
			}
		: {};

	const [
		tarefasPendentes,
		tarefasProcessando,
		tarefasComErroHoje,
		eventosErro24h,
		ultimosErros,
		heartbeats,
		workerAgents,
	] = await Promise.all([
		prisma.tarefa.count({
			where: {
				...whereCliente,
				status: "PENDING",
			},
		}),
		prisma.tarefa.count({
			where: {
				...whereCliente,
				status: "PROCESSING",
			},
		}),
		prisma.tarefa.count({
			where: {
				...whereCliente,
				status: "ERROR",
				updatedAt: {
					gte: inicioHoje,
				},
			},
		}),
		prisma.operacaoEvento.count({
			where: {
				...whereCliente,
				nivel: "ERROR",
				createdAt: {
					gte: ultimas24h,
				},
			},
		}),
		prisma.operacaoEvento.findMany({
			where: {
				...whereCliente,
				nivel: "ERROR",
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 5,
			include: {
				cliente: {
					select: {
						id: true,
						nome: true,
						slug: true,
					},
				},
				tarefa: {
					select: {
						id: true,
						status: true,
						logradouro: true,
						numero: true,
					},
				},
				buscaPrevia: {
					select: {
						id: true,
						status: true,
						logradouro: true,
						numero: true,
					},
				},
			},
		}),
		prisma.workerHeartbeat.findMany({
			where: filtros.clienteId
				? {
						clienteId: filtros.clienteId,
					}
				: undefined,
			orderBy: {
				ultimoSinalEm: "desc",
			},
			include: {
				cliente: {
					select: {
						id: true,
						nome: true,
						slug: true,
					},
				},
			},
		}),
		prisma.workerAgent.findMany({
			where: filtros.clienteId
				? {
						clienteId: filtros.clienteId,
					}
				: undefined,
			orderBy: [
				{
					tipo: "asc",
				},
				{
					ultimoSinalEm: "desc",
				},
			],
			include: {
				cliente: {
					select: {
						id: true,
						nome: true,
						slug: true,
						status: true,
						modoProcessamento: true,
					},
				},
			},
		}),
	]);

	const workers = heartbeats.map((heartbeat) => {
		const statusOperacional = calcularStatusWorker({
			status: heartbeat.status,
			ultimoSinalEm: heartbeat.ultimoSinalEm,
			staleBefore,
		});

		return {
			id: heartbeat.id,
			cliente: {
				id: heartbeat.cliente.id,
				nome: heartbeat.cliente.nome,
				slug: heartbeat.cliente.slug,
			},
			servico: heartbeat.servico,
			identificador: heartbeat.identificador,
			fila: heartbeat.fila,
			status: statusOperacional,
			statusRegistrado: heartbeat.status,
			ultimoSinalEm: heartbeat.ultimoSinalEm.toISOString(),
			metadata: heartbeat.metadata,
		};
	});

	const workersOffline = workers.filter(
		(worker) => worker.status !== "ONLINE"
	).length;
	const workersOnline = workers.filter(
		(worker) => worker.status === "ONLINE"
	).length;

	const agents = workerAgents.map((agent) => {
		const statusOperacional = calcularStatusAgent({
			status: agent.status,
			ultimoSinalEm: agent.ultimoSinalEm,
			instavelBefore: agentInstavelBefore,
			offlineBefore: agentOfflineBefore,
		});

		return {
			id: agent.id,
			cliente: {
				id: agent.cliente.id,
				nome: agent.cliente.nome,
				slug: agent.cliente.slug,
				status: agent.cliente.status,
				modoProcessamento: agent.cliente.modoProcessamento,
			},
			tipo: agent.tipo,
			identificador: agent.identificador,
			status: statusOperacional,
			statusRegistrado: agent.status,
			ultimoSinalEm: toIso(agent.ultimoSinalEm),
			metadata: agent.metadata,
			createdAt: agent.createdAt.toISOString(),
			updatedAt: agent.updatedAt.toISOString(),
		};
	});

	const agentsOnline = agents.filter(
		(agent) => agent.status === "ONLINE"
	).length;
	const agentsInstaveis = agents.filter(
		(agent) => agent.status === "INSTAVEL"
	).length;
	const agentsOffline = agents.filter(
		(agent) => agent.status === "OFFLINE"
	).length;
	const agentsRevogados = agents.filter(
		(agent) => agent.status === "REVOGADO"
	).length;

	const agentsComAtencao = agents.filter(
		(agent) => agent.status !== "ONLINE"
	).length;

	const statusGeral =
		eventosErro24h > 0 ||
		workersOffline > 0 ||
		agentsComAtencao > 0 ||
		tarefasComErroHoje > 0
			? "ATENCAO"
			: "OPERACIONAL";

	return {
		atualizadoEm: agora.toISOString(),
		statusGeral,
		tarefas: {
			pendentes: tarefasPendentes,
			processando: tarefasProcessando,
			comErroHoje: tarefasComErroHoje,
		},
		eventos: {
			errosUltimas24h: eventosErro24h,
		},
		workers: {
			total: workers.length,
			online: workersOnline,
			offline: workersOffline,
			itens: workers,
		},
    agents: {
      total: agents.length,
      online: agentsOnline,
      instaveis: agentsInstaveis,
      offline: agentsOffline,
      revogados: agentsRevogados,
      comAtencao: agentsComAtencao,
      itens: agents,
    },
		ultimosErros: ultimosErros.map(serializeEvento),
	};
}

export async function listarEventosMonitoramentoAdmin(
	filtros: MonitoramentoFiltros
) {
	const take = filtros.take ?? 50;
	const where = buildEventoWhere(filtros);

	const eventos = await prisma.operacaoEvento.findMany({
		where,
		orderBy: {
			createdAt: "desc",
		},
		take,
		include: {
			cliente: {
				select: {
					id: true,
					nome: true,
					slug: true,
				},
			},
			tarefa: {
				select: {
					id: true,
					status: true,
					logradouro: true,
					numero: true,
				},
			},
			buscaPrevia: {
				select: {
					id: true,
					status: true,
					logradouro: true,
					numero: true,
				},
			},
		},
	});

	return {
		eventos: eventos.map(serializeEvento),
	};
}

type QueueForCounts =
	| ReturnType<typeof getBuscarProprietariosQueue>
	| ReturnType<typeof getBuscarRegistrosQueue>;

async function getQueueCounts(queue: QueueForCounts) {
	const counts = await queue.getJobCounts(
		"waiting",
		"active",
		"delayed",
		"failed",
		"completed",
		"paused"
	);

	return {
		waiting: counts.waiting ?? 0,
		active: counts.active ?? 0,
		delayed: counts.delayed ?? 0,
		failed: counts.failed ?? 0,
		completed: counts.completed ?? 0,
		paused: counts.paused ?? 0,
	};
}

export async function listarFilasMonitoramentoAdmin(filtros: {
	clienteId?: string;
}) {
	const clientes = await prisma.cliente.findMany({
		where: filtros.clienteId
			? {
					id: filtros.clienteId,
				}
			: undefined,
		orderBy: {
			nome: "asc",
		},
		select: {
			id: true,
			nome: true,
			slug: true,
			status: true,
		},
	});

	const itens = await Promise.all(
		clientes.map(async (cliente) => {
			const filaProprietarios = getBuscarProprietariosQueue(cliente.id);
			const filaRegistros = getBuscarRegistrosQueue(cliente.id);

			const [proprietarios, registros] = await Promise.all([
				getQueueCounts(filaProprietarios),
				getQueueCounts(filaRegistros),
			]);

			return {
				cliente,
				filas: [
					{
						nome: `buscar-proprietarios-${cliente.id}`,
						tipo: "WORKER_CND",
						descricao: "Busca de proprietários, CND e contatos",
						counts: proprietarios,
					},
					{
						nome: `buscar-registros-${cliente.id}`,
						tipo: "WORKER_REGISTRO",
						descricao: "Busca prévia de índices cadastrais no Registro",
						counts: registros,
					},
				],
			};
		})
	);

	return {
		atualizadoEm: new Date().toISOString(),
		itens,
	};
}
