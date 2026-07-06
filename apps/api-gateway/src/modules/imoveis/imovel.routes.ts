import type { FastifyInstance } from "fastify";
import { buscarProprietariosController } from "./imovel.controller.js";

export async function imovelRoutes(app: FastifyInstance) {
  app.post("/imoveis/buscar-proprietarios", buscarProprietariosController);
}
