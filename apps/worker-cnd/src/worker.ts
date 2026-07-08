import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@imovel-pratico/database";
import {
	QUEUE_NAMES,
	redisConnection,
	type BuscarProprietariosJobData,
} from "@imovel-pratico/queue";
import { buscarProprietariosPorEndereco } from "./services/buscarProprietariosPorEndereco.js";
import { closeBrowser } from "./playwright/browser.js";

function getDataExpiracaoCache() {
	const date = new Date();
	date.setDate(date.getDate() + 90);
	return date;
}

console.log("Worker CND iniciado");
console.log(`Fila: ${QUEUE_NAMES.BUSCAR_PROPRIETARIOS}`);

const worker = new Worker<BuscarProprietariosJobData>(
	QUEUE_NAMES.BUSCAR_PROPRIETARIOS,
	async (job) => {
		const data = job.data;

		console.log("Job recebido:", {
			jobId: job.id,
			tarefaId: data.tarefaId,
			logradouro: data.logradouro,
			numero: data.numero,
		});

		await prisma.tarefaResultado.deleteMany({
			where: {
				tarefaId: data.tarefaId,
			},
		});

		await prisma.tarefa.update({
			where: {
				id: data.tarefaId,
			},
			data: {
				status: "PROCESSING",
				total: 0,
				current: 0,
				erro: null,
				startedAt: new Date(),
			},
		});

		try {
			const result = await buscarProprietariosPorEndereco({
				logradouro: data.logradouro,
				numero: data.numero,
				mesAnoInicio: data.mesAnoInicio,
				mesAnoFinal: data.mesAnoFinal,
				intervaloSegundos: data.intervaloSegundos,
				forceRefresh: data.forceRefresh,
				onProgress: async ({ total, current, item }) => {
					const tarefaAtual = await prisma.tarefa.findUnique({
						where: {
							id: data.tarefaId,
						},
						select: {
							status: true,
						},
					});

					if (tarefaAtual?.status === "CANCELED") {
						throw new Error("TAREFA_CANCELADA");
					}

					await prisma.tarefa.update({
						where: {
							id: data.tarefaId,
						},
						data: {
							total,
							current,
						},
					});

					if (!item) {
						return;
					}

					const isSuccess = item.status === "success";

					await prisma.tarefaResultado.create({
						data: {
							tarefaId: data.tarefaId,
							status: isSuccess ? "SUCCESS" : "ERROR",

							logradouro: item.logradouro,
							numero: item.numero,
							complemento: item.imovel,
							indiceCadastral: item.indiceCadastral,

							nome: item.proprietario?.nome ?? null,
							cpf: item.proprietario?.cpf ?? null,
							endereco: item.proprietario?.endereco ?? null,
							telefone: null,
							email: null,

							erro: item.error ?? null,
						},
					});

					const fromCache = item?.fromCache ?? false;

					await prisma.consultaLog.create({
						data: {
							clienteId: data.clienteId,
							fonte: fromCache ? "CACHE" : "CND",
							acao: "BUSCAR_PROPRIETARIO",
							sucesso: isSuccess,
							mensagemErro: item.error ?? null,
						},
					});

					if (isSuccess) {
						const agora = new Date();

						await prisma.imovelCache.upsert({
							where: {
                indiceCadastral: item.indiceCadastral,
              },
							update: {
								logradouro: item.logradouro,
								numero: item.numero,
								complemento: item.imovel,
								nome: item.proprietario?.nome ?? null,
								cpf: item.proprietario?.cpf ?? null,
								endereco: item.proprietario?.endereco ?? null,
								status: "VALID",
								ultimaConsultaEm: agora,
								expiraEm: getDataExpiracaoCache(),
							},
							create: {
								logradouro: item.logradouro,
								numero: item.numero,
								complemento: item.imovel,
								indiceCadastral: item.indiceCadastral,
								nome: item.proprietario?.nome ?? null,
								cpf: item.proprietario?.cpf ?? null,
								endereco: item.proprietario?.endereco ?? null,
								status: "VALID",
								ultimaConsultaEm: agora,
								expiraEm: getDataExpiracaoCache(),
							},
						});
					}
				},
			});

			await prisma.tarefa.update({
				where: {
					id: data.tarefaId,
				},
				data: {
					status: "COMPLETED",
					total: result.totalImoveis,
					current: result.totalImoveis,
					completedAt: new Date(),
				},
			});

			console.log("Job concluído:", {
				jobId: job.id,
				tarefaId: data.tarefaId,
				total: result.totalImoveis,
			});

			return {
				success: true,
				tarefaId: data.tarefaId,
				total: result.totalImoveis,
			};
		} catch (error) {
			if (error instanceof Error && error.message === "TAREFA_CANCELADA") {
				await prisma.tarefa.update({
					where: {
						id: data.tarefaId,
					},
					data: {
						status: "CANCELED",
						erro: "Tarefa cancelada pelo administrador",
						completedAt: new Date(),
					},
				});

				return;
			}

			const message =
				error instanceof Error ? error.message : "Erro desconhecido no worker";

			await prisma.tarefa.update({
				where: {
					id: data.tarefaId,
				},
				data: {
					status: "ERROR",
					erro: message,
					completedAt: new Date(),
				},
			});

			await prisma.consultaLog.create({
				data: {
					clienteId: data.clienteId,
					fonte: "WORKER_CND",
					acao: "PROCESSAR_TAREFA",
					sucesso: false,
					mensagemErro: message,
				},
			});

			throw error;
		}
	},
	{
		connection: redisConnection,
		concurrency: 1,

		// Evita o BullMQ considerar o Playwright travado em consultas longas
		lockDuration: 1000 * 60 * 10, // 10 minutos
		stalledInterval: 1000 * 30, // checa stalled a cada 30 segundos
		maxStalledCount: 3,
	}
);

worker.on("completed", (job) => {
	console.log(`Job ${job.id} finalizado com sucesso`);
});

worker.on("stalled", (jobId) => {
	console.warn(`Job ${jobId} ficou stalled no BullMQ`);
});

worker.on("failed", async (job, error) => {
	if (!job) {
		console.error("Job falhou sem referência:", error);
		return;
	}

	console.error(`Job ${job.id} falhou`, error);

	const tarefa = await prisma.tarefa.findUnique({
		where: {
			id: job.data.tarefaId,
		},
		select: {
			status: true,
		},
	});

	if (!tarefa) {
		return;
	}

	// Se foi cancelada pelo admin, não sobrescreve como ERROR
	if (tarefa.status === "CANCELED") {
		return;
	}

	await prisma.tarefa.update({
		where: {
			id: job.data.tarefaId,
		},
		data: {
			status: "ERROR",
			erro:
				error instanceof Error ? error.message : "Erro desconhecido no worker",
			completedAt: new Date(),
		},
	});
});

async function shutdown() {
	console.log("Encerrando worker...");
	await worker.close();
	await closeBrowser();
	await prisma.$disconnect();
	process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
