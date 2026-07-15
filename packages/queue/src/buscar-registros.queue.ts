import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";
import { getBuscarRegistrosQueueName } from "./queue-names.js";
import type { BuscarRegistrosJobData } from "./jobs.js";

const queues = new Map<string, Queue<BuscarRegistrosJobData>>();

function criarFilaBuscarRegistros(clienteId: string) {
  const queueName = getBuscarRegistrosQueueName(clienteId);

  return new Queue<BuscarRegistrosJobData>(queueName, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 10000,
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

export function getBuscarRegistrosQueue(clienteId: string) {
  const queue = queues.get(clienteId);

  if (queue) {
    return queue;
  }

  const novaFila = criarFilaBuscarRegistros(clienteId);

  queues.set(clienteId, novaFila);

  return novaFila;
}

export async function adicionarBuscaRegistrosNaFila(
  data: BuscarRegistrosJobData
) {
  const queue = getBuscarRegistrosQueue(data.clienteId);

  return queue.add("buscar-registros-1ribh", data, {
    jobId: data.buscaPreviaId,
  });
}
