import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  buscarResumoMonitoramentoAdmin,
  listarEventosMonitoramentoAdmin,
  listarFilasMonitoramentoAdmin,
} from "./admin-monitoramento.service.js";

const monitoramentoQuerySchema = z.object({
  clienteId: z.string().uuid().optional(),
  nivel: z.enum(["INFO", "WARN", "ERROR"]).optional(),
  servico: z
    .enum(["API_GATEWAY", "WORKER_REGISTRO", "WORKER_CND", "QUEUE", "REALTIME"])
    .optional(),
  tipo: z.string().trim().min(1).optional(),
  dataInicio: z.string().trim().min(1).optional(),
  dataFim: z.string().trim().min(1).optional(),
  take: z.coerce.number().int().min(1).max(200).default(50),
});

function parseOptionalDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Data inválida");
  }

  return date;
}

export async function buscarResumoMonitoramentoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = monitoramentoQuerySchema
    .pick({
      clienteId: true,
    })
    .parse(request.query);

  const resumo = await buscarResumoMonitoramentoAdmin({
    clienteId: query.clienteId,
  });

  return reply.status(200).send({
    resumo,
  });
}

export async function listarEventosMonitoramentoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = monitoramentoQuerySchema.parse(request.query);

  try {
    const result = await listarEventosMonitoramentoAdmin({
      clienteId: query.clienteId,
      nivel: query.nivel,
      servico: query.servico,
      tipo: query.tipo,
      dataInicio: parseOptionalDate(query.dataInicio),
      dataFim: parseOptionalDate(query.dataFim),
      take: query.take,
    });

    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao listar eventos de monitoramento",
    });
  }
}

export async function listarFilasMonitoramentoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = monitoramentoQuerySchema
    .pick({
      clienteId: true,
    })
    .parse(request.query);

  const result = await listarFilasMonitoramentoAdmin({
    clienteId: query.clienteId,
  });

  return reply.status(200).send(result);
}
