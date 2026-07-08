import type { FastifyReply, FastifyRequest } from "fastify";
import {
  atualizarClienteSchema,
  atualizarUsuarioSchema,
  clienteIdParamsSchema,
  clienteUsuariosParamsSchema,
  criarClienteSchema,
  criarUsuarioSchema,
  usuarioIdParamsSchema,
} from "./admin.schemas.js";
import {
  atualizarCliente,
  atualizarUsuario,
  buscarDashboardAdmin,
  buscarClientePorId,
  buscarUsuarioPorId,
  criarCliente,
  criarUsuario,
  listarClientes,
  listarTarefasDoCliente,
  listarUsuariosDoCliente,
} from "./admin.service.js";

export async function listarClientesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const clientes = await listarClientes();

  return reply.status(200).send({
    clientes,
  });
}

export async function criarClienteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = criarClienteSchema.parse(request.body);

  const cliente = await criarCliente(body);

  return reply.status(201).send({
    cliente,
  });
}

export async function atualizarClienteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = clienteIdParamsSchema.parse(request.params);
  const body = atualizarClienteSchema.parse(request.body);

  try {
    const cliente = await atualizarCliente(id, body);

    return reply.status(200).send({
      cliente,
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error ? error.message : "Erro ao atualizar cliente",
    });
  }
}

export async function listarUsuariosDoClienteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { clienteId } = clienteUsuariosParamsSchema.parse(request.params);

  const usuarios = await listarUsuariosDoCliente(clienteId);

  return reply.status(200).send({
    usuarios,
  });
}

export async function criarUsuarioController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { clienteId } = clienteUsuariosParamsSchema.parse(request.params);
  const body = criarUsuarioSchema.parse(request.body);

  try {
    const usuario = await criarUsuario(clienteId, body);

    return reply.status(201).send({
      usuario,
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error ? error.message : "Erro ao criar usuário",
    });
  }
}

export async function atualizarUsuarioController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = usuarioIdParamsSchema.parse(request.params);
  const body = atualizarUsuarioSchema.parse(request.body);

  try {
    const usuario = await atualizarUsuario(id, body);

    return reply.status(200).send({
      usuario,
    });
  } catch (error) {
    return reply.status(400).send({
      error: "BadRequest",
      message:
        error instanceof Error ? error.message : "Erro ao atualizar usuário",
    });
  }
}

export async function listarTarefasDoClienteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { clienteId } = clienteUsuariosParamsSchema.parse(request.params);

  try {
    const result = await listarTarefasDoCliente(clienteId);

    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(404).send({
      error: "NotFound",
      message:
        error instanceof Error
          ? error.message
          : "Erro ao listar tarefas do cliente",
    });
  }
}

export async function buscarClienteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = clienteIdParamsSchema.parse(request.params);

  const cliente = await buscarClientePorId(id);

  if (!cliente) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Cliente não encontrado",
    });
  }

  return reply.status(200).send({
    cliente,
  });
}

export async function buscarUsuarioController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = usuarioIdParamsSchema.parse(request.params);

  const usuario = await buscarUsuarioPorId(id);

  if (!usuario) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Usuário não encontrado",
    });
  }

  return reply.status(200).send({
    usuario,
  });
}

export async function buscarDashboardAdminController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const dashboard = await buscarDashboardAdmin();

  return reply.status(200).send(dashboard);
}
