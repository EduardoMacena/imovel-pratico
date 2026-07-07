import type { FastifyInstance } from "fastify";
import {
  buscarProprietariosController,
  buscarTarefaController,
} from "./imovel.controller.js";

export async function imovelRoutes(app: FastifyInstance) {
  app.post("/imoveis/buscar-proprietarios", buscarProprietariosController);
  app.get("/imoveis/tarefas/:id", buscarTarefaController);
}