import type { FastifyInstance } from "fastify";
import {
  loginController,
  trocarMinhaSenhaController,
} from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", loginController);

  app.patch(
    "/auth/minha-senha",
    {
      preHandler: authMiddleware,
    },
    trocarMinhaSenhaController
  );
}