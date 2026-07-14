import "dotenv/config";
import Fastify from "fastify";
import { closeBrowser } from "./playwright/browser.js";
import { getRegistroFilaInfo } from "./services/registro-rate-limiter.js";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => ({
  ok: true,
  service: "worker-registro",
}));

app.get("/registro/status", async () => ({
  ok: true,
  service: "worker-registro",
  fila: getRegistroFilaInfo(),
}));

async function main() {
  const port = Number(process.env.PORT ?? 3334);

  await app.listen({
    port,
    host: "0.0.0.0",
  });

  console.log(`[worker-registro] Health server rodando na porta ${port}`);
}

async function shutdown() {
  await app.close();
  await closeBrowser();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch(async error => {
  app.log.error(error);
  await closeBrowser();
  process.exit(1);
});
