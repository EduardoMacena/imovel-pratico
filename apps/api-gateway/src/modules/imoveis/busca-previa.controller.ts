import type { FastifyReply, FastifyRequest } from "fastify";
import { LimitePlanoInsuficienteError } from "../assinatura/plano-fixo.js";
import {
  buscarProprietariosSchema,
  preverBuscaCodigosSchema,
  preverBuscaSchema,
  previaIdParamsSchema,
} from "./imovel.schemas.js";
import {
  buscarPreviaBusca,
  cancelarPreviaBusca,
  confirmarPreviaECriarTarefa,
  criarPreviaBusca,
  criarPreviaBuscaPorCodigos,
  listarPreviasPendentes,
} from "./busca-previa.service.js";

export async function criarPreviaBuscaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = preverBuscaSchema.parse(request.body);

  const result = await criarPreviaBusca(request.auth.clienteId, body);

  return reply.status(202).send(result);
}

export async function criarPreviaBuscaPorCodigosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = preverBuscaCodigosSchema.parse(request.body);

  try {
    const result = await criarPreviaBuscaPorCodigos(
      request.auth.clienteId,
      body
    );

    return reply.status(202).send(result);
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao criar prévia por códigos cadastrais",
    });
  }
}

export async function buscarPreviaBuscaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = previaIdParamsSchema.parse(request.params);

  const result = await buscarPreviaBusca(request.auth.clienteId, id);

  if (!result) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Prévia não encontrada",
    });
  }

  return reply.status(200).send(result);
}

export async function listarPreviasPendentesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const previas = await listarPreviasPendentes(request.auth.clienteId);

  return reply.status(200).send({
    previas,
  });
}

export async function cancelarPreviaBuscaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = previaIdParamsSchema.parse(request.params);

  const result = await cancelarPreviaBusca(request.auth.clienteId, id);

  if (!result) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Prévia não encontrada",
    });
  }

  return reply.status(200).send(result);
}

export async function confirmarPreviaBuscaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = buscarProprietariosSchema.parse(request.body);

  try {
    const result = await confirmarPreviaECriarTarefa(
      request.auth.clienteId,
      body
    );

    return reply.status(202).send(result);
  } catch (error) {
    if (error instanceof LimitePlanoInsuficienteError) {
      return reply.status(409).send({
        error: "Conflict",
        code: error.code,
        message: error.message,
        ...error.detalhes,
      });
    }

    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao confirmar prévia da busca",
    });
  }
}
