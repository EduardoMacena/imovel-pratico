import type { FastifyInstance } from "fastify";
import {
  loginController,
  redefinirSenhaController,
  solicitarRedefinicaoSenhaController,
  trocarMinhaSenhaController,
} from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", loginController);
  app.post("/auth/esqueci-senha", solicitarRedefinicaoSenhaController);
  app.post("/auth/redefinir-senha", redefinirSenhaController);

  app.patch(
    "/auth/minha-senha",
    {
      preHandler: authMiddleware,
    },
    trocarMinhaSenhaController
  );
}