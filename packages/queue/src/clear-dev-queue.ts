import "dotenv/config";
import { Queue } from "bullmq";
import { QUEUE_NAMES } from "./queue-names.js";
import { redisConnection } from "./redis.js";

async function main() {
  const queue = new Queue(QUEUE_NAMES.BUSCAR_PROPRIETARIOS_BASE, {
    connection: redisConnection,
  });

  await queue.drain(true);

  await queue.clean(0, 1000, "wait");
  await queue.clean(0, 1000, "active");
  await queue.clean(0, 1000, "delayed");
  await queue.clean(0, 1000, "completed");
  await queue.clean(0, 1000, "failed");

  await queue.close();

  console.log("Fila de busca de proprietários limpa com sucesso.");
}

main().catch(error => {
  console.error("Erro ao limpar fila:", error);
  process.exit(1);
});