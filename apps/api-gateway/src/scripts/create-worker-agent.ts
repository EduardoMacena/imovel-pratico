import "dotenv/config";
import { randomBytes } from "node:crypto";
import { prisma, type WorkerAgentTipo } from "@imovel-pratico/database";
import { hashWorkerToken } from "../modules/workers/worker-agent.auth.js";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} não configurado`);
  }

  return value;
}

function getTipo(): WorkerAgentTipo {
  const value = getRequiredEnv("WORKER_AGENT_TIPO").toUpperCase();

  if (value !== "REGISTRO" && value !== "CND") {
    throw new Error("WORKER_AGENT_TIPO deve ser REGISTRO ou CND");
  }

  return value;
}

async function main() {
  const clienteId = getRequiredEnv("WORKER_CLIENTE_ID");
  const tipo = getTipo();
  const identificador =
    process.env.WORKER_AGENT_IDENTIFICADOR?.trim() ||
    `agent-${tipo.toLowerCase()}-${clienteId.slice(0, 8)}`;

  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
  });

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  const token = `ipw_${randomBytes(32).toString("base64url")}`;
  const tokenHash = hashWorkerToken(token);

  const agent = await prisma.workerAgent.upsert({
    where: {
      worker_agent_cliente_tipo_identificador_unique: {
        clienteId,
        tipo,
        identificador,
      },
    },
    create: {
      clienteId,
      tipo,
      identificador,
      tokenHash,
      status: "ATIVO",
    },
    update: {
      tokenHash,
      status: "ATIVO",
    },
  });

  console.log("");
  console.log("Worker Agent criado/atualizado com sucesso");
  console.log("");
  console.log(`Cliente: ${cliente.nome}`);
  console.log(`Agent ID: ${agent.id}`);
  console.log(`Tipo: ${agent.tipo}`);
  console.log(`Identificador: ${agent.identificador}`);
  console.log("");
  console.log("TOKEN — salve agora, ele não será exibido novamente:");
  console.log(token);
  console.log("");
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
