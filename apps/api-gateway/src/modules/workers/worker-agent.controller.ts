import type { FastifyReply, FastifyRequest } from "fastify";
import { autenticarWorkerRequest } from "./worker-agent.auth.js";
import {
  workerClaimSchema,
  workerErrorSchema,
  workerHeartbeatSchema,
  workerJobParamsSchema,
  workerProgressSchema,
  workerRegistroSuccessSchema,
} from "./worker-agent.schemas.js";
import {
  claimProximoJob,
  concluirJobCnd,
  concluirJobComErro,
  concluirJobRegistro,
  registrarHeartbeatAgent,
  registrarProgressoJob,
} from "./worker-agent.service.js";
import { workerBuscarContatoPorCpfSchema } from "./worker-agent-contato.schemas.js";
import { buscarContatoCpfAgent } from "./worker-agent-contato.service.js";

export async function heartbeatWorkerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const agent = await autenticarWorkerRequest(request);
  const body = workerHeartbeatSchema.parse(request.body ?? {});

  const result = await registrarHeartbeatAgent({
    agent,
    versao: body.versao,
    metadata: body.metadata,
  });

  return reply.status(200).send(result);
}

export async function claimWorkerJobController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const agent = await autenticarWorkerRequest(request);

  workerClaimSchema.parse(request.body ?? {});

  const result = await claimProximoJob(agent);

  return reply.status(200).send(result);
}

export async function progressWorkerJobController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const agent = await autenticarWorkerRequest(request);
  const { id } = workerJobParamsSchema.parse(request.params);
  const body = workerProgressSchema.parse(request.body ?? {});

  const result = await registrarProgressoJob({
    agent,
    jobId: id,
    total: body.total,
    current: body.current,
    status: body.status,
    item: body.item,
  });

  return reply.status(200).send(result);
}

export async function successWorkerJobController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const agent = await autenticarWorkerRequest(request);
  const { id } = workerJobParamsSchema.parse(request.params);

  if (agent.tipo === "REGISTRO") {
    const body = workerRegistroSuccessSchema.parse(request.body ?? {});
    const result = await concluirJobRegistro({
      agent,
      jobId: id,
      registros: body.registros,
    });

    return reply.status(200).send(result);
  }

  const result = await concluirJobCnd({
    agent,
    jobId: id,
  });

  return reply.status(200).send(result);
}

export async function errorWorkerJobController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const agent = await autenticarWorkerRequest(request);
  const { id } = workerJobParamsSchema.parse(request.params);
  const body = workerErrorSchema.parse(request.body ?? {});

  const result = await concluirJobComErro({
    agent,
    jobId: id,
    message: body.message,
    stack: body.stack,
    metadata: body.metadata,
  });

  return reply.status(200).send(result);
}

export async function buscarContatoCpfWorkerController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const agent = await autenticarWorkerRequest(request);
	const body = workerBuscarContatoPorCpfSchema.parse(request.body ?? {});

	const result = await buscarContatoCpfAgent({
		agent,
		cpf: body.cpf,
	});

	return reply.status(200).send(result);
}