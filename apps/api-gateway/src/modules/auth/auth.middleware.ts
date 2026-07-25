import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import type { AuthTokenPayload } from "./auth.service.js";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Token não informado",
    });
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Token inválido",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

    request.auth = {
      usuarioId: decoded.usuarioId,
      clienteId: decoded.clienteId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Token inválido ou expirado",
    });
  }
}
