import "dotenv/config";
import Fastify from "fastify";
import { closeBrowser } from "./playwright/browser.js";
import { buscarIndiceCadastral } from "./services/buscarIndiceCadastral.js";

type PreverBuscaBody = {
  logradouro?: string;
  numero?: string;
};

const app = Fastify({
  logger: true,
});

app.get("/health", async () => ({
  ok: true,
  service: "worker-registro",
}));

app.post("/registro/prever-busca", async (request, reply) => {
  const body = request.body as PreverBuscaBody;

  const logradouro = body.logradouro?.trim();
  const numero = body.numero?.trim();

  if (!logradouro || logradouro.length < 3) {
    return reply.status(400).send({
      error: "BadRequest",
      message: "Logradouro é obrigatório",
    });
  }

  if (!numero) {
    return reply.status(400).send({
      error: "BadRequest",
      message: "Número é obrigatório",
    });
  }

  const registros = await buscarIndiceCadastral(logradouro, numero);

  return reply.status(200).send({
    previa: {
      logradouro,
      numero,
      quantidadeRegistros: registros.length,
      registros,
    },
  });
});

async function main() {
  const port = Number(process.env.PORT ?? 3334);

  await app.listen({
    port,
    host: "0.0.0.0",
  });

  console.log(`[worker-registro] Rodando na porta ${port}`);
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
