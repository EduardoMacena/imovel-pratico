import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { buscarProprietariosSchema } from "./imovel.schemas.js";
import {
	buscarProgressoTarefaPorId,
	buscarTarefaPorId,
	criarTarefaBuscaProprietarios,
} from "./imovel.service.js";

export async function buscarProprietariosController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const body = buscarProprietariosSchema.parse(request.body);

	const result = await criarTarefaBuscaProprietarios(body);

	return reply.status(202).send(result);
}

export async function buscarTarefaController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	});

	const { id } = paramsSchema.parse(request.params);

	const tarefa = await buscarTarefaPorId(id);

	if (!tarefa) {
		return reply.status(404).send({
			error: "NotFound",
			message: "Tarefa não encontrada",
		});
	}

	return reply.status(200).send(tarefa);
}

export async function buscarProgressoTarefaController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	});

	const { id } = paramsSchema.parse(request.params);

	const tarefa = await buscarProgressoTarefaPorId(id);

	if (!tarefa) {
		return reply.status(404).send({
			error: "NotFound",
			message: "Tarefa não encontrada",
		});
	}

	return reply.status(200).send(tarefa);
}
