import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@imovel-pratico/database";
import {
  QUEUE_NAMES,
  redisConnection,
  type BuscarProprietariosJobData,
} from "@imovel-pratico/queue";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("Worker CND iniciado");
console.log(`Fila: ${QUEUE_NAMES.BUSCAR_PROPRIETARIOS}`);

const worker = new Worker<BuscarProprietariosJobData>(
  QUEUE_NAMES.BUSCAR_PROPRIETARIOS,
  async job => {
    const data = job.data;

    console.log("Job recebido:", {
      jobId: job.id,
      tarefaId: data.tarefaId,
      logradouro: data.logradouro,
      numero: data.numero,
    });

    await prisma.tarefa.update({
      where: {
        id: data.tarefaId,
      },
      data: {
        status: "PROCESSING",
        startedAt: new Date(),
      },
    });

    try {
      await sleep(3000);

      await prisma.tarefa.update({
        where: {
          id: data.tarefaId,
        },
        data: {
          status: "COMPLETED",
          total: 0,
          current: 0,
          completedAt: new Date(),
        },
      });

      console.log("Job concluído:", {
        jobId: job.id,
        tarefaId: data.tarefaId,
      });

      return {
        success: true,
        tarefaId: data.tarefaId,
      };
    } catch (error) {
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

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 1,
  }
);

worker.on("completed", job => {
  console.log(`Job ${job.id} finalizado com sucesso`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} falhou`, error);
});

process.on("SIGINT", async () => {
  console.log("Encerrando worker...");
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Encerrando worker...");
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});
