import type { FastifyInstance } from "fastify";
import {
	buscarProgressoTarefaController,
	buscarProprietariosController,
	buscarTarefaController,
	listarTarefasController,
} from "./imovel.controller.js";

export async function imovelRoutes(app: FastifyInstance) {
	app.post("/imoveis/buscar-proprietarios", buscarProprietariosController);
	app.get("/imoveis/tarefas", listarTarefasController);
	app.get("/imoveis/tarefas/:id", buscarTarefaController);
	app.get("/imoveis/tarefas/:id/progresso", buscarProgressoTarefaController);
}
