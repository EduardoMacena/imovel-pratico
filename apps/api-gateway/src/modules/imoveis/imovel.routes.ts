import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
	buscarProgressoTarefaController,
	buscarProprietariosController,
	buscarTarefaController,
	exportarResultadosTarefaController,
	listarTarefasController,
} from "./imovel.controller.js";

export async function imovelRoutes(app: FastifyInstance) {
	app.addHook("preHandler", authMiddleware);

	app.post("/imoveis/buscar-proprietarios", buscarProprietariosController);

	app.get("/imoveis/tarefas", listarTarefasController);
  
	app.get("/imoveis/tarefas/:id/exportar", exportarResultadosTarefaController);

	app.get("/imoveis/tarefas/:id", buscarTarefaController);

	app.get("/imoveis/tarefas/:id/progresso", buscarProgressoTarefaController);
}
