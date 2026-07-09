import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@imovel-pratico/database";
import {
  redisConnection,
  getBuscarProprietariosQueueName,
  type BuscarProprietariosJobData,
} from "@imovel-pratico/queue";
import { closeBrowser } from "./playwright/browser.js";
import { processarBuscaProprietariosJob } from "./processarBuscaProprietariosJob.js";

function getWorkerClienteId() {
  const clienteId = process.env.WORKER_CLIENTE_ID?.trim();

  if (!clienteId) {
    throw new Error("WORKER_CLIENTE_ID não configurado neste worker");
  }

  return clienteId;
}

async function validarClienteDoWorker(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
    include: {
      plano: true,
    },
  });

  if (!cliente) {
    throw new Error("Cliente do worker não encontrado");
  }

  if (cliente.status !== "ATIVO") {
    throw new Error(`Cliente ${cliente.nome} não está ativo`);
  }

  if (!cliente.plano) {
    throw new Error(`Cliente ${cliente.nome} está sem plano`);
  }

  if (cliente.plano.status !== "ATIVO") {
    throw new Error(`Plano do cliente ${cliente.nome} está inativo`);
  }

  return cliente;
}

async function main() {
  const clienteId = getWorkerClienteId();

  const cliente = await validarClienteDoWorker(clienteId);

  const queueName = getBuscarProprietariosQueueName(cliente.id);

  const worker = new Worker<BuscarProprietariosJobData>(
    queueName,
    async job => {
      console.log(
        `[worker-cnd] Processando tarefa ${job.data.tarefaId} do cliente ${cliente.nome}`
      );

      await processarBuscaProprietariosJob(job);
    },
    {
      connection: redisConnection,
      concurrency: 1,
      lockDuration: 1000 * 60 * 10,
      stalledInterval: 1000 * 30,
      maxStalledCount: 3,
    }
  );

  worker.on("completed", job => {
    console.log(
      `[worker-cnd] Tarefa ${job.data.tarefaId} concluída para ${cliente.nome}`
    );
  });

  worker.on("failed", (job, error) => {
    if (!job) {
      console.error("[worker-cnd] Job falhou sem referência:", error);
      return;
    }

    console.error(
      `[worker-cnd] Tarefa ${job.data.tarefaId} falhou para ${cliente.nome}:`,
      error
    );
  });

  worker.on("stalled", jobId => {
    console.warn(`[worker-cnd] Job ${jobId} ficou stalled`);
  });

  console.log(
    `[worker-cnd] Worker iniciado para ${cliente.nome} na fila ${queueName}`
  );

  async function shutdown() {
    console.log("[worker-cnd] Encerrando worker...");

    await worker.close();
    await closeBrowser();
    await prisma.$disconnect();

    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch(async error => {
  console.error("[worker-cnd] Erro fatal:", error);

  await closeBrowser();
  await prisma.$disconnect();

  process.exit(1);
});