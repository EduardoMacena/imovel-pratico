import type { FastifyReply, FastifyRequest } from "fastify";
import {
  auditoriaClienteParamsSchema,
  listarAuditoriaAdministrativaQuerySchema,
} from "./admin-auditoria.schemas.js";
import { listarAuditoriaAdministrativaCliente } from "./admin-auditoria.service.js";

export async function listarAuditoriaAdministrativaClienteController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = auditoriaClienteParamsSchema.parse(request.params);
  const query = listarAuditoriaAdministrativaQuerySchema.parse(
    request.query,
  );

  const result = await listarAuditoriaAdministrativaCliente(
    id,
    query,
  );

  if (!result) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Cliente não encontrado",
    });
  }

  return reply.status(200).send(result);
}
