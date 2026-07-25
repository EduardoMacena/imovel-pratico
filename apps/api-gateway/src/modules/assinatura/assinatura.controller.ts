import type { FastifyReply, FastifyRequest } from "fastify";
import { buscarMinhaAssinatura } from "./assinatura.service.js";

export async function buscarMinhaAssinaturaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = await buscarMinhaAssinatura(request.auth.clienteId);

  if (!result) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Assinatura não encontrada",
    });
  }

  return reply.status(200).send(result);
}
