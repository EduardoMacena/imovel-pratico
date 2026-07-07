import type { FastifyReply, FastifyRequest } from "fastify";

export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (request.auth.role !== "ADMIN") {
    return reply.status(403).send({
      error: "Forbidden",
      message: "Acesso permitido apenas para administradores",
    });
  }
}
