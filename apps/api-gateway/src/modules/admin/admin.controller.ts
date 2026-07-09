import type { FastifyReply, FastifyRequest } from "fastify";
import {
	atualizarClienteSchema,
	atualizarUsuarioSchema,
	atualizarPlanoSchema,
	clienteIdParamsSchema,
	planoIdParamsSchema,
	clienteUsuariosParamsSchema,
	criarClienteSchema,
	criarUsuarioSchema,
	criarPlanoSchema,
	usuarioIdParamsSchema,
} from "./admin.schemas.js";
import {
	atualizarCliente,
	atualizarUsuario,
	buscarClientePorId,
	buscarDashboardAdmin,
	buscarTarefaAdminPorId,
	buscarUsuarioPorId,
	cancelarTarefaAdmin,
	criarCliente,
	criarUsuario,
	exportarResultadosTarefaAdminCsv,
	exportarResultadosTarefaAdminExcel,
	listarClientes,
	listarTarefasDoCliente,
	listarUsuariosDoCliente,
	reprocessarTarefaAdmin,
	atualizarPlano,
	buscarPlanoPorId,
	criarPlano,
	listarPlanos,
	buscarConsumoClienteAdmin,
	listarConsumoClientesAdmin,
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
			message: error instanceof Error ? error.message : "Erro ao criar usuário",
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

export async function buscarTarefaAdminController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = clienteIdParamsSchema.parse(request.params);

	const tarefa = await buscarTarefaAdminPorId(id);

	if (!tarefa) {
		return reply.status(404).send({
			error: "NotFound",
			message: "Tarefa não encontrada",
		});
	}

	return reply.status(200).send({
		tarefa,
	});
}

export async function cancelarTarefaAdminController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = clienteIdParamsSchema.parse(request.params);

	try {
		const result = await cancelarTarefaAdmin(id);

		return reply.status(200).send(result);
	} catch (error) {
		console.error("Erro ao cancelar tarefa:", error);

		return reply.status(400).send({
			error: "BadRequest",
			message:
				error instanceof Error ? error.message : "Erro ao cancelar tarefa",
		});
	}
}

export async function reprocessarTarefaAdminController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = clienteIdParamsSchema.parse(request.params);

	try {
		const result = await reprocessarTarefaAdmin(id);

		return reply.status(200).send(result);
	} catch (error) {
		return reply.status(400).send({
			error: "BadRequest",
			message:
				error instanceof Error ? error.message : "Erro ao reprocessar tarefa",
		});
	}
}

export async function exportarResultadosTarefaAdminController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = clienteIdParamsSchema.parse(request.params);

	const result = await exportarResultadosTarefaAdminCsv(id);

	if (!result) {
		return reply.status(404).send({
			error: "NotFound",
			message: "Tarefa não encontrada",
		});
	}

	return reply
		.header("Content-Type", "text/csv; charset=utf-8")
		.header("Content-Disposition", `attachment; filename="${result.filename}"`)
		.status(200)
		.send(result.csv);
}

export async function exportarResultadosTarefaAdminExcelController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = clienteIdParamsSchema.parse(request.params);

	const result = await exportarResultadosTarefaAdminExcel(id);

	if (!result) {
		return reply.status(404).send({
			error: "NotFound",
			message: "Tarefa não encontrada",
		});
	}

	return reply
		.header(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		)
		.header("Content-Disposition", `attachment; filename="${result.filename}"`)
		.header("Content-Length", result.buffer.length)
		.status(200)
		.send(result.buffer);
}

export async function listarPlanosController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const planos = await listarPlanos();

	return reply.status(200).send({
		planos,
	});
}

export async function buscarPlanoController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = planoIdParamsSchema.parse(request.params);

	const plano = await buscarPlanoPorId(id);

	if (!plano) {
		return reply.status(404).send({
			error: "NotFound",
			message: "Plano não encontrado",
		});
	}

	return reply.status(200).send({
		plano,
	});
}

export async function criarPlanoController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const body = criarPlanoSchema.parse(request.body);

	try {
		const plano = await criarPlano(body);

		return reply.status(201).send({
			plano,
		});
	} catch (error) {
		return reply.status(400).send({
			error: "BadRequest",
			message: error instanceof Error ? error.message : "Erro ao criar plano",
		});
	}
}

export async function atualizarPlanoController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { id } = planoIdParamsSchema.parse(request.params);
	const body = atualizarPlanoSchema.parse(request.body);

	try {
		const plano = await atualizarPlano(id, body);

		return reply.status(200).send({
			plano,
		});
	} catch (error) {
		return reply.status(400).send({
			error: "BadRequest",
			message:
				error instanceof Error ? error.message : "Erro ao atualizar plano",
		});
	}
}

export async function listarConsumoClientesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const consumos = await listarConsumoClientesAdmin();

  return reply.status(200).send({
    consumos,
  });
}

export async function buscarConsumoClienteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = clienteIdParamsSchema.parse(request.params);

  const consumo = await buscarConsumoClienteAdmin(id);

  if (!consumo) {
    return reply.status(404).send({
      error: "NotFound",
      message: "Cliente não encontrado",
    });
  }

  return reply.status(200).send({
    consumo,
  });
}