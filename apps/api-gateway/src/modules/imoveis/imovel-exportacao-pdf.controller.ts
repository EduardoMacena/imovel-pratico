import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { exportarResultadosTarefaPdf } from "./imovel.service.js";

export async function exportarResultadosTarefaPdfController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const result = await exportarResultadosTarefaPdf(request.auth.clienteId, id);

  if (!result) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Tarefa não encontrada",
    });
  }

  return reply
    .header("Content-Type", "application/pdf")
    .header(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`
    )
    .send(result.buffer);
}
