import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../auth/auth.middleware.js";
import { buscarMinhaAssinaturaController } from "./assinatura.controller.js";

export async function assinaturaRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.get("/imoveis/minha-assinatura", buscarMinhaAssinaturaController);
}
