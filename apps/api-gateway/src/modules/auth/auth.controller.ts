import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import {
  loginSchema,
  trocarMinhaSenhaSchema,
} from "./auth.schemas.js";
import {
  ClienteInativoError,
  CredenciaisInvalidasError,
  login,
  SenhaAtualInvalidaError,
  trocarMinhaSenha,
  UsuarioInativoError,
  UsuarioNaoEncontradoError,
} from "./auth.service.js";

function handleZodError(error: ZodError, reply: FastifyReply) {
  return reply.status(400).send({
    error: "ValidationError",
    message: "Dados inválidos",
    issues: error.issues,
  });
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = loginSchema.parse(request.body);

    const response = await login(data);

    return reply.send(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, reply);
    }

    if (error instanceof CredenciaisInvalidasError) {
      return reply.status(401).send({
        error: error.name,
        message: error.message,
      });
    }

    if (
      error instanceof UsuarioInativoError ||
      error instanceof ClienteInativoError
    ) {
      return reply.status(403).send({
        error: error.name,
        message: error.message,
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      error: "InternalServerError",
      message: "Erro interno ao fazer login",
    });
  }
}

export async function trocarMinhaSenhaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = trocarMinhaSenhaSchema.parse(request.body);

    const response = await trocarMinhaSenha(request.auth.usuarioId, data);

    return reply.send(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, reply);
    }

    if (error instanceof SenhaAtualInvalidaError) {
      return reply.status(400).send({
        error: error.name,
        message: error.message,
      });
    }

    if (error instanceof UsuarioNaoEncontradoError) {
      return reply.status(404).send({
        error: error.name,
        message: error.message,
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      error: "InternalServerError",
      message: "Erro interno ao trocar senha",
    });
  }
}