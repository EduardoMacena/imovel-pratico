import type { FastifyReply, FastifyRequest } from "fastify";
import { loginSchema } from "./auth.schemas.js";
import {
  ClienteInativoError,
  CredenciaisInvalidasError,
  login,
  UsuarioInativoError,
} from "./auth.service.js";

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = loginSchema.parse(request.body);

  try {
    const result = await login(body);

    return reply.status(200).send(result);
  } catch (error) {
    if (
      error instanceof CredenciaisInvalidasError ||
      error instanceof UsuarioInativoError ||
      error instanceof ClienteInativoError
    ) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: error.message,
      });
    }

    throw error;
  }
}
