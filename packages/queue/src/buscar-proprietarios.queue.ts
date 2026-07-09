import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";
import { getBuscarProprietariosQueueName } from "./queue-names.js";
import type { BuscarProprietariosJobData } from "./jobs.js";

const queues = new Map<string, Queue<BuscarProprietariosJobData>>();

function criarFilaBuscaProprietarios(clienteId: string) {
  const queueName = getBuscarProprietariosQueueName(clienteId);

  return new Queue<BuscarProprietariosJobData>(queueName, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: {
        age: 60 * 60 * 24,
        count: 1000,
      },
      removeOnFail: {
        age: 60 * 60 * 24 * 7,
        count: 5000,
      },
    },
  });
}

export function getBuscarProprietariosQueue(clienteId: string) {
  const queue = queues.get(clienteId);

  if (queue) {
    return queue;
  }

  const novaFila = criarFilaBuscaProprietarios(clienteId);

  queues.set(clienteId, novaFila);

  return novaFila;
}

export async function adicionarBuscaProprietariosNaFila(
  data: BuscarProprietariosJobData
) {
  const queue = getBuscarProprietariosQueue(data.clienteId);

  return queue.add("buscar-proprietarios-por-endereco", data, {
    jobId: data.tarefaId,
  });
}

export async function removerBuscaProprietariosDaFila(params: {
  clienteId: string;
  tarefaId: string;
}) {
  const queue = getBuscarProprietariosQueue(params.clienteId);

  const job = await queue.getJob(params.tarefaId);

  if (!job) {
    return {
      removed: false,
      reason: "Job não encontrado na fila do cliente",
    };
  }

  try {
    await job.remove();

    return {
      removed: true,
      reason: "Job removido da fila do cliente",
    };
  } catch {
    return {
      removed: false,
      reason:
        "Job não pôde ser removido da fila. Ele pode já estar em processamento.",
    };
  }
}