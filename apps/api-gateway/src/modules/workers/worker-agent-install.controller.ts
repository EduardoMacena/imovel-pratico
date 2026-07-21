import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  ativarWorkerAgentInstallLinkSchema,
  criarWorkerAgentInstallLinkSchema,
} from "./worker-agent-install.schemas.js";
import {
  ativarWorkerAgentInstallLink,
  cancelarWorkerAgentInstallLink,
  criarWorkerAgentInstallLink,
  listarWorkerAgentInstallLinks,
} from "./worker-agent-install.service.js";

const clienteIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const installLinkIdParamsSchema = z.object({
  id: z.string().uuid(),
});

function obterApiBaseUrl(request: FastifyRequest) {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const forwardedHost = request.headers["x-forwarded-host"];

  const proto = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto;

  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || request.headers.host;

  return `${proto || "https"}://${host}`;
}

export async function listarWorkerAgentInstallLinksController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = clienteIdParamsSchema.parse(request.params);

  try {
    const result = await listarWorkerAgentInstallLinks(id);

    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(404).send({
      error: "NotFound",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao listar links de instalação",
    });
  }
}

export async function criarWorkerAgentInstallLinkController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = clienteIdParamsSchema.parse(request.params);
  const body = criarWorkerAgentInstallLinkSchema.parse(request.body);

  try {
    const result = await criarWorkerAgentInstallLink(id, body);

    const apiBaseUrl = obterApiBaseUrl(request);
    const installUrl = `${apiBaseUrl}/api/agents/install/activate?code=${encodeURIComponent(
      result.code
    )}`;

    return reply.status(201).send({
      ...result,
      installUrl,
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao criar link de instalação",
    });
  }
}

export async function cancelarWorkerAgentInstallLinkController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = installLinkIdParamsSchema.parse(request.params);

  try {
    const result = await cancelarWorkerAgentInstallLink(id);

    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao cancelar link de instalação",
    });
  }
}

export async function ativarWorkerAgentInstallLinkController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = z
    .object({
      code: z.string().optional(),
    })
    .parse(request.query);

  const body = ativarWorkerAgentInstallLinkSchema.parse({
    ...(typeof request.body === "object" && request.body ? request.body : {}),
    code:
      typeof request.body === "object" &&
      request.body &&
      "code" in request.body
        ? (request.body as { code?: string }).code
        : query.code,
  });

  try {
    const result = await ativarWorkerAgentInstallLink(body);

    return reply.status(200).send({
      ...result,
      apiUrl: obterApiBaseUrl(request),
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao ativar instalação do Agent",
    });
  }
}