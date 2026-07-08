import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";
import { QUEUE_NAMES } from "./queue-names.js";
import type { BuscarProprietariosJobData } from "./jobs.js";

export const buscarProprietariosQueue = new Queue<BuscarProprietariosJobData>(
  QUEUE_NAMES.BUSCAR_PROPRIETARIOS,
  {
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
  }
);

export async function adicionarBuscaProprietariosNaFila(
  data: BuscarProprietariosJobData
) {
  return buscarProprietariosQueue.add("buscar-proprietarios-por-endereco", data, {
    jobId: data.tarefaId,
  });
}

export async function removerBuscaProprietariosDaFila(tarefaId: string) {
  const job = await buscarProprietariosQueue.getJob(tarefaId);

  if (!job) {
    return {
      removed: false,
      reason: "Job não encontrado na fila",
    };
  }

  try {
    await job.remove();

    return {
      removed: true,
      reason: "Job removido da fila",
    };
  } catch {
    return {
      removed: false,
      reason:
        "Job não pôde ser removido da fila. Ele pode já estar em processamento.",
    };
  }
}