import { createHash, timingSafeEqual } from "node:crypto";
import type { FastifyRequest } from "fastify";
import { prisma, type WorkerAgentTipo } from "@imovel-pratico/database";

export type WorkerAgentAutenticado = {
  id: string;
  clienteId: string;
  tipo: WorkerAgentTipo;
  identificador: string;
};

export function hashWorkerToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeCompareHash(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function extrairBearerToken(request: FastifyRequest) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token?.trim()) {
    return null;
  }

  return token.trim();
}

export async function autenticarWorkerRequest(
  request: FastifyRequest
): Promise<WorkerAgentAutenticado> {
  const token = extrairBearerToken(request);

  if (!token) {
    const error = new Error("WORKER_TOKEN ausente");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  const tokenHash = hashWorkerToken(token);

  const agent = await prisma.workerAgent.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      clienteId: true,
      tipo: true,
      identificador: true,
      tokenHash: true,
      status: true,
      cliente: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!agent || !safeCompareHash(agent.tokenHash, tokenHash)) {
    const error = new Error("WORKER_TOKEN inválido");
    Object.assign(error, { statusCode: 401 });
    throw error;
  }

  if (agent.status !== "ATIVO") {
    const error = new Error("Worker agent não está ativo");
    Object.assign(error, { statusCode: 403 });
    throw error;
  }

  if (agent.cliente.status !== "ATIVO") {
    const error = new Error("Cliente do worker não está ativo");
    Object.assign(error, { statusCode: 403 });
    throw error;
  }

  return {
    id: agent.id,
    clienteId: agent.clienteId,
    tipo: agent.tipo,
    identificador: agent.identificador,
  };
}
