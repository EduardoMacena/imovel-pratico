import type { FastifyReply, FastifyRequest } from "fastify";
import { buscarProprietariosSchema } from "./imovel.schemas.js";
import { criarTarefaBuscaProprietarios } from "./imovel.service.js";

export async function buscarProprietariosController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const body = buscarProprietariosSchema.parse(request.body);

	const result = await criarTarefaBuscaProprietarios(body);

	return reply.status(202).send(result);
}
