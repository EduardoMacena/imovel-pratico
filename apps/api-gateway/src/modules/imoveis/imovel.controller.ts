import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { buscarProprietariosSchema } from "./imovel.schemas.js";
import {
  buscarProgressoTarefaPorId,
  buscarTarefaPorId,
  criarTarefaBuscaProprietarios,
  exportarResultadosTarefaCsv,
  listarTarefasRecentes,
} from "./imovel.service.js";

export async function buscarProprietariosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = buscarProprietariosSchema.parse(request.body);

  const result = await criarTarefaBuscaProprietarios(
    request.auth.clienteId,
    body
  );

  return reply.status(202).send(result);
}

export async function buscarTarefaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const tarefa = await buscarTarefaPorId(request.auth.clienteId, id);

  if (!tarefa) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Tarefa não encontrada",
    });
  }

  return reply.status(200).send(tarefa);
}

export async function buscarProgressoTarefaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const tarefa = await buscarProgressoTarefaPorId(request.auth.clienteId, id);

  if (!tarefa) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Tarefa não encontrada",
    });
  }

  return reply.status(200).send(tarefa);
}

export async function listarTarefasController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const tarefas = await listarTarefasRecentes(request.auth.clienteId);

  return reply.status(200).send({
    tarefas,
  });
}

export async function exportarResultadosTarefaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const result = await exportarResultadosTarefaCsv(request.auth.clienteId, id);

  if (!result) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Tarefa não encontrada",
    });
  }

  return reply
    .header("Content-Type", "text/csv; charset=utf-8")
    .header(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`
    )
    .status(200)
    .send(result.csv);
}