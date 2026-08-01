import type { FastifyReply, FastifyRequest } from "fastify";
import { ClienteAdminError } from "./clientes-admin.errors.js";
import {
  atualizarClienteOnboardingSchema,
  clienteOnboardingParamsSchema,
  criarClienteOnboardingSchema,
} from "./clientes-admin.schemas.js";
import {
  atualizarClienteOnboarding,
  criarClienteOnboarding,
  listarMunicipiosElegiveisParaCliente,
} from "./clientes-admin.service.js";

function responderErroClienteAdmin(
  error: unknown,
  reply: FastifyReply,
  fallbackMessage: string,
) {
  if (error instanceof ClienteAdminError) {
    return reply.status(error.statusCode).send({
      error: error.code,
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  console.error(
    fallbackMessage,
    error instanceof Error ? error.message : "erro desconhecido",
  );

  return reply.status(500).send({
    error: "InternalServerError",
    code: "ERRO_INTERNO_ONBOARDING_CLIENTE",
    message: fallbackMessage,
  });
}

export async function listarMunicipiosElegiveisController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const municipios = await listarMunicipiosElegiveisParaCliente();
  return reply.status(200).send({ municipios });
}

export async function criarClienteOnboardingController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = criarClienteOnboardingSchema.parse(request.body);

  try {
    const resultado = await criarClienteOnboarding(body);
    return reply.status(201).send(resultado);
  } catch (error) {
    return responderErroClienteAdmin(
      error,
      reply,
      "Erro ao concluir o onboarding do cliente",
    );
  }
}

export async function atualizarClienteOnboardingController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = clienteOnboardingParamsSchema.parse(request.params);
  const body = atualizarClienteOnboardingSchema.parse(request.body);

  try {
    const resultado = await atualizarClienteOnboarding(id, body);
    return reply.status(200).send(resultado);
  } catch (error) {
    return responderErroClienteAdmin(
      error,
      reply,
      "Erro ao atualizar o onboarding do cliente",
    );
  }
}
