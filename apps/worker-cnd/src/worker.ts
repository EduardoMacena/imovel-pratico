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
import { publicarTarefaAtualizada } from "./realtime/tarefa-realtime.js";
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
  const identificador =
    process.env.WORKER_NAME?.trim() || `worker-cnd-${cliente.id}`;

  const heartbeatInterval = iniciarHeartbeatWorker({
    clienteId: cliente.id,
    servico: "WORKER_CND",
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
    servico: "WORKER_CND",
    tipo: "WORKER_INICIADO",
    mensagem: `Worker CND iniciado para ${cliente.nome}`,
    metadata: {
      queueName,
      identificador,
      pid: process.pid,
    },
  });

  const worker = new Worker<BuscarProprietariosJobData>(
    queueName,
    async job => {
      console.log(
        `[worker-cnd] Processando tarefa ${job.data.tarefaId} do cliente ${cliente.nome}`
      );

      await registrarOperacaoEvento({
        clienteId: job.data.clienteId,
        tarefaId: job.data.tarefaId,
        buscaPreviaId: job.data.buscaPreviaId ?? null,
        servico: "WORKER_CND",
        tipo: "JOB_RECEBIDO",
        mensagem: `Worker CND recebeu a tarefa ${job.data.tarefaId}`,
        metadata: {
          jobId: job.id,
          attemptsMade: job.attemptsMade,
          queueName,
        },
      });

      const realtimeInterval = setInterval(() => {
        void publicarTarefaAtualizada(job.data.tarefaId);
      }, 2000);

      try {
        await publicarTarefaAtualizada(job.data.tarefaId);
        await processarBuscaProprietariosJob(job);

        await registrarOperacaoEvento({
          clienteId: job.data.clienteId,
          tarefaId: job.data.tarefaId,
          buscaPreviaId: job.data.buscaPreviaId ?? null,
          servico: "WORKER_CND",
          tipo: "JOB_FINALIZADO",
          mensagem: `Worker CND finalizou a tarefa ${job.data.tarefaId}`,
          metadata: {
            jobId: job.id,
            queueName,
          },
        });
      } catch (error) {
        await registrarErroOperacao(
          {
            clienteId: job.data.clienteId,
            tarefaId: job.data.tarefaId,
            buscaPreviaId: job.data.buscaPreviaId ?? null,
            servico: "WORKER_CND",
            tipo: "JOB_ERRO",
            mensagem: `Worker CND falhou ao processar a tarefa ${job.data.tarefaId}`,
            metadata: {
              jobId: job.id,
              attemptsMade: job.attemptsMade,
              queueName,
            },
          },
          error
        );

        throw error;
      } finally {
        clearInterval(realtimeInterval);
        await publicarTarefaAtualizada(job.data.tarefaId);
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
      `[worker-cnd] Tarefa ${job.data.tarefaId} concluída para ${cliente.nome}`
    );
  });

  worker.on("failed", (job, error) => {
    if (!job) {
      console.error("[worker-cnd] Job falhou sem referência:", error);

      void registrarErroOperacao(
        {
          clienteId: cliente.id,
          servico: "WORKER_CND",
          tipo: "JOB_FALHOU_SEM_REFERENCIA",
          mensagem: "Worker CND recebeu falha sem referência de job",
          metadata: {
            queueName,
          },
        },
        error
      );

      return;
    }

    console.error(
      `[worker-cnd] Tarefa ${job.data.tarefaId} falhou para ${cliente.nome}:`,
      error
    );
  });

  worker.on("stalled", jobId => {
    console.warn(`[worker-cnd] Job ${jobId} ficou stalled`);

    void registrarOperacaoEvento({
      clienteId: cliente.id,
      servico: "WORKER_CND",
      nivel: "WARN",
      tipo: "JOB_STALLED",
      mensagem: `Job ${jobId} ficou stalled no worker CND`,
      metadata: {
        jobId,
        queueName,
      },
    });
  });

  console.log(
    `[worker-cnd] Worker iniciado para ${cliente.nome} na fila ${queueName}`
  );

  async function shutdown() {
    console.log("[worker-cnd] Encerrando worker...");

    clearInterval(heartbeatInterval);

    await registrarOperacaoEvento({
      clienteId: cliente.id,
      servico: "WORKER_CND",
      nivel: "WARN",
      tipo: "WORKER_ENCERRANDO",
      mensagem: `Worker CND encerrando para ${cliente.nome}`,
      metadata: {
        queueName,
        identificador,
      },
    });

    await registrarHeartbeatWorker({
      clienteId: cliente.id,
      servico: "WORKER_CND",
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
  console.error("[worker-cnd] Erro fatal:", error);

  await closeBrowser();
  await prisma.$disconnect();

  process.exit(1);
});
