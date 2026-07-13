import type { FastifyReply, FastifyRequest } from "fastify";
import {
  faturaIdParamsSchema,
  gerarFaturaSchema,
  listarFaturasQuerySchema,
} from "./admin-faturas.schemas.js";
import {
  buscarFaturaAdmin,
  cancelarFaturaAdmin,
  gerarFaturaAdmin,
  listarFaturasAdmin,
  marcarFaturaComoPagaAdmin,
} from "./admin-faturas.service.js";

export async function listarFaturasController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = listarFaturasQuerySchema.parse(request.query);

  const faturas = await listarFaturasAdmin(query);

  return reply.status(200).send({
    faturas,
  });
}

export async function buscarFaturaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = faturaIdParamsSchema.parse(request.params);

  const fatura = await buscarFaturaAdmin(id);

  if (!fatura) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Fatura não encontrada",
    });
  }

  return reply.status(200).send({
    fatura,
  });
}

export async function gerarFaturaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = gerarFaturaSchema.parse(request.body);

  try {
    const fatura = await gerarFaturaAdmin(body);

    return reply.status(201).send({
      fatura,
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error ? error.message : "Erro ao gerar fatura",
    });
  }
}

export async function marcarFaturaPagaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = faturaIdParamsSchema.parse(request.params);

  try {
    const fatura = await marcarFaturaComoPagaAdmin(id);

    return reply.status(200).send({
      fatura,
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error ? error.message : "Erro ao marcar fatura como paga",
    });
  }
}

export async function cancelarFaturaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = faturaIdParamsSchema.parse(request.params);

  try {
    const fatura = await cancelarFaturaAdmin(id);

    return reply.status(200).send({
      fatura,
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error ? error.message : "Erro ao cancelar fatura",
    });
  }
}
