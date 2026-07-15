import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "@imovel-pratico/database";
import {
  getBuscarRegistrosQueueName,
  redisConnection,
  type BuscarRegistrosJobData,
} from "@imovel-pratico/queue";
import { closeBrowser } from "./playwright/browser.js";
import { processarBuscaRegistrosJob } from "./processarBuscaRegistrosJob.js";
import {
  iniciarHeartbeatWorker,
  registrarErroOperacao,
  registrarHeartbeatWorker,
  registrarOperacaoEvento,
} from "./monitoramento/operacao-monitoramento.js";

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
    throw new Error("Cliente do worker-registro não encontrado");
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
  const queueName = getBuscarRegistrosQueueName(cliente.id);
  const identificador =
    process.env.WORKER_NAME?.trim() || `worker-registro-${cliente.id}`;

  const heartbeatInterval = iniciarHeartbeatWorker({
    clienteId: cliente.id,
    servico: "WORKER_REGISTRO",
    identificador,
    fila: queueName,
    metadata: {
      clienteNome: cliente.nome,
      pid: process.pid,
      startedAt: new Date().toISOString(),
    },
  });

  await registrarOperacaoEvento({
    clienteId: cliente.id,
    servico: "WORKER_REGISTRO",
    tipo: "WORKER_INICIADO",
    mensagem: `Worker Registro iniciado para ${cliente.nome}`,
    metadata: {
      queueName,
      identificador,
      pid: process.pid,
    },
  });

  const worker = new Worker<BuscarRegistrosJobData>(
    queueName,
    async job => {
      console.log(
        `[worker-registro] Processando prévia ${job.data.buscaPreviaId} do cliente ${cliente.nome}`
      );

      await registrarOperacaoEvento({
        clienteId: job.data.clienteId,
        buscaPreviaId: job.data.buscaPreviaId,
        servico: "WORKER_REGISTRO",
        tipo: "JOB_RECEBIDO",
        mensagem: `Worker Registro recebeu a prévia ${job.data.buscaPreviaId}`,
        metadata: {
          jobId: job.id,
          attemptsMade: job.attemptsMade,
          queueName,
        },
      });

      try {
        await processarBuscaRegistrosJob(job);

        await registrarOperacaoEvento({
          clienteId: job.data.clienteId,
          buscaPreviaId: job.data.buscaPreviaId,
          servico: "WORKER_REGISTRO",
          tipo: "JOB_FINALIZADO",
          mensagem: `Worker Registro finalizou a prévia ${job.data.buscaPreviaId}`,
          metadata: {
            jobId: job.id,
            queueName,
          },
        });
      } catch (error) {
        await registrarErroOperacao(
          {
            clienteId: job.data.clienteId,
            buscaPreviaId: job.data.buscaPreviaId,
            servico: "WORKER_REGISTRO",
            tipo: "JOB_ERRO",
            mensagem: `Worker Registro falhou ao processar a prévia ${job.data.buscaPreviaId}`,
            metadata: {
              jobId: job.id,
              attemptsMade: job.attemptsMade,
              queueName,
            },
          },
          error
        );

        throw error;
      }
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
      `[worker-registro] Prévia ${job.data.buscaPreviaId} concluída para ${cliente.nome}`
    );
  });

  worker.on("failed", (job, error) => {
    if (!job) {
      console.error("[worker-registro] Job falhou sem referência:", error);

      void registrarErroOperacao(
        {
          clienteId: cliente.id,
          servico: "WORKER_REGISTRO",
          tipo: "JOB_FALHOU_SEM_REFERENCIA",
          mensagem: "Worker Registro recebeu falha sem referência de job",
          metadata: {
            queueName,
          },
        },
        error
      );

      return;
    }

    console.error(
      `[worker-registro] Prévia ${job.data.buscaPreviaId} falhou para ${cliente.nome}:`,
      error
    );
  });

  worker.on("stalled", jobId => {
    console.warn(`[worker-registro] Job ${jobId} ficou stalled`);

    void registrarOperacaoEvento({
      clienteId: cliente.id,
      servico: "WORKER_REGISTRO",
      nivel: "WARN",
      tipo: "JOB_STALLED",
      mensagem: `Job ${jobId} ficou stalled no worker Registro`,
      metadata: {
        jobId,
        queueName,
      },
    });
  });

  console.log(
    `[worker-registro] Worker iniciado para ${cliente.nome} na fila ${queueName}`
  );

  async function shutdown() {
    console.log("[worker-registro] Encerrando worker...");

    clearInterval(heartbeatInterval);

    await registrarOperacaoEvento({
      clienteId: cliente.id,
      servico: "WORKER_REGISTRO",
      nivel: "WARN",
      tipo: "WORKER_ENCERRANDO",
      mensagem: `Worker Registro encerrando para ${cliente.nome}`,
      metadata: {
        queueName,
        identificador,
      },
    });

    await registrarHeartbeatWorker({
      clienteId: cliente.id,
      servico: "WORKER_REGISTRO",
      identificador,
      fila: queueName,
      status: "OFFLINE",
      metadata: {
        stoppedAt: new Date().toISOString(),
      },
    });

    await worker.close();
    await closeBrowser();
    await prisma.$disconnect();

    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch(async error => {
  console.error("[worker-registro] Erro fatal:", error);

  await closeBrowser();
  await prisma.$disconnect();

  process.exit(1);
});
