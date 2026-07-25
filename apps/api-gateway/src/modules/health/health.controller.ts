import type { FastifyReply, FastifyRequest } from "fastify";

export async function healthController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.status(200).send({
    status: "ok",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
}
