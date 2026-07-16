import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import {
  loginSchema,
  redefinirSenhaSchema,
  solicitarRedefinicaoSenhaSchema,
  trocarMinhaSenhaSchema,
} from "./auth.schemas.js";
import {
  ClienteInativoError,
  CredenciaisInvalidasError,
  login,
  redefinirSenha,
  SenhaAtualInvalidaError,
  solicitarRedefinicaoSenha,
  TokenRedefinicaoSenhaInvalidoError,
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

export async function solicitarRedefinicaoSenhaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = solicitarRedefinicaoSenhaSchema.parse(request.body);
    const response = await solicitarRedefinicaoSenha(data);

    return reply.send(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, reply);
    }

    request.log.error(error);

    return reply.status(500).send({
      error: "InternalServerError",
      message: "Erro interno ao solicitar redefinição de senha",
    });
  }
}

export async function redefinirSenhaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = redefinirSenhaSchema.parse(request.body);
    const response = await redefinirSenha(data);

    return reply.send(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, reply);
    }

    if (error instanceof TokenRedefinicaoSenhaInvalidoError) {
      return reply.status(400).send({
        error: error.name,
        message: error.message,
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      error: "InternalServerError",
      message: "Erro interno ao redefinir senha",
    });
  }
}