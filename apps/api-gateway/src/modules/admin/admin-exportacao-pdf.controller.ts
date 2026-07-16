import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { exportarResultadosTarefaAdminPdf } from "./admin.service.js";

export async function exportarResultadosTarefaAdminPdfController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const result = await exportarResultadosTarefaAdminPdf(id);

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
