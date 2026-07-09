import type { Job } from "bullmq";
import { Prisma, prisma } from "@imovel-pratico/database";
import type { BuscarProprietariosJobData } from "@imovel-pratico/queue";
import { buscarProprietariosPorEndereco } from "./services/buscarProprietariosPorEndereco.js";

function toPrismaJson(
	value: Record<string, unknown> | null | undefined
): Prisma.InputJsonValue | undefined {
	if (!value) {
		return undefined;
	}

	return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function validarLimiteMensalAntesDeSalvarResultado(clienteId: string) {
	const inicioMes = new Date();

	inicioMes.setDate(1);
	inicioMes.setHours(0, 0, 0, 0);

	const fimMes = new Date(inicioMes);

	fimMes.setMonth(fimMes.getMonth() + 1);

	const cliente = await prisma.cliente.findUnique({
		where: {
			id: clienteId,
		},
		include: {
			plano: true,
		},
	});

	if (!cliente) {
		throw new Error("CLIENTE_NAO_ENCONTRADO");
	}

	if (!cliente.plano) {
		throw new Error("CLIENTE_SEM_PLANO");
	}

	const consultasUsadas = await prisma.tarefaResultado.count({
		where: {
			tarefa: {
				clienteId,
			},
			createdAt: {
				gte: inicioMes,
				lt: fimMes,
			},
		},
	});

	if (consultasUsadas >= cliente.plano.limiteMensalConsultas) {
		throw new Error("LIMITE_MENSAL_ATINGIDO");
	}
}

async function tarefaFoiCancelada(tarefaId: string) {
	const tarefa = await prisma.tarefa.findUnique({
		where: {
			id: tarefaId,
		},
		select: {
			status: true,
		},
	});

	return tarefa?.status === "CANCELED";
}

export async function processarBuscaProprietariosJob(
	job: Job<BuscarProprietariosJobData>
) {
	try {
		const canceladaAntesDeIniciar = await tarefaFoiCancelada(job.data.tarefaId);

		if (canceladaAntesDeIniciar) {
			return;
		}

		await prisma.tarefa.update({
			where: {
				id: job.data.tarefaId,
			},
			data: {
				status: "PROCESSING",
				startedAt: new Date(),
				erro: null,
			},
		});

		const resultado = await buscarProprietariosPorEndereco({
			logradouro: job.data.logradouro,
			numero: job.data.numero,
			mesAnoInicio: job.data.mesAnoInicio,
			mesAnoFinal: job.data.mesAnoFinal,
			intervaloSegundos: job.data.intervaloSegundos,
			forceRefresh: job.data.forceRefresh,
			clienteId: job.data.clienteId,
			onProgress: async (progress) => {
				const cancelada = await tarefaFoiCancelada(job.data.tarefaId);

				if (cancelada) {
					throw new Error("TAREFA_CANCELADA");
				}

				await prisma.tarefa.update({
					where: {
						id: job.data.tarefaId,
					},
					data: {
						total: progress.total,
						current: progress.current,
					},
				});

				if (!progress.item) {
					return;
				}

				await validarLimiteMensalAntesDeSalvarResultado(job.data.clienteId);

				const item = progress.item;

				await prisma.tarefaResultado.create({
					data: {
						tarefaId: job.data.tarefaId,
						status: item.status === "success" ? "SUCCESS" : "ERROR",

						logradouro: item.logradouro,
						numero: item.numero,
						complemento: item.imovel,
						indiceCadastral: item.indiceCadastral,

						nome: item.proprietario?.nome ?? null,
						cpf: item.proprietario?.cpf ?? null,
						endereco: item.proprietario?.endereco ?? null,
						telefone: item.telefone ?? null,
						email: item.email ?? null,

						fonteContato: item.fonteContato ?? null,
						dadosContato: toPrismaJson(item.dadosContato),

						erro: item.error ?? null,
					},
				});

				await prisma.consultaLog.create({
					data: {
						clienteId: job.data.clienteId,
						fonte: item.fromCache ? "CACHE" : "CND",
						acao: "BUSCAR_PROPRIETARIO",
						sucesso: item.status === "success",
						mensagemErro: item.error ?? null,
					},
				});

				if (item.fonteContato === "FONTEDATA") {
					await prisma.consultaLog.create({
						data: {
							clienteId: job.data.clienteId,
							fonte: "FONTEDATA",
							acao: "BUSCAR_CONTATO_POR_CPF",
							sucesso: true,
							mensagemErro: null,
						},
					});
				}

				await job.updateProgress({
					total: progress.total,
					current: progress.current,
				});
			},
		});

		await prisma.tarefa.update({
			where: {
				id: job.data.tarefaId,
			},
			data: {
				status: "COMPLETED",
				total: resultado.totalImoveis,
				current: resultado.totalImoveis,
				completedAt: new Date(),
			},
		});
	} catch (error) {
		if (error instanceof Error && error.message === "TAREFA_CANCELADA") {
			await prisma.tarefa.update({
				where: {
					id: job.data.tarefaId,
				},
				data: {
					status: "CANCELED",
					erro: "Tarefa cancelada pelo administrador",
					completedAt: new Date(),
				},
			});

			return;
		}

		if (error instanceof Error && error.message === "LIMITE_MENSAL_ATINGIDO") {
			await prisma.tarefa.update({
				where: {
					id: job.data.tarefaId,
				},
				data: {
					status: "ERROR",
					erro: "Limite mensal de consultas atingido durante o processamento",
					completedAt: new Date(),
				},
			});

			return;
		}

		await prisma.tarefa.update({
			where: {
				id: job.data.tarefaId,
			},
			data: {
				status: "ERROR",
				erro:
					error instanceof Error
						? error.message
						: "Erro desconhecido no processamento",
				completedAt: new Date(),
			},
		});

		throw error;
	}
}
