import type { FastifyInstance } from "fastify";
import { env } from "../../config/env.js";
import {
  loginController,
  redefinirSenhaController,
  solicitarRedefinicaoSenhaController,
  trocarMinhaSenhaController,
} from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/login",
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_LOGIN_MAX,
          timeWindow: env.RATE_LIMIT_LOGIN_TIME_WINDOW,
          groupId: "auth-login",
        },
      },
    },
    loginController
  );

  app.post(
    "/auth/esqueci-senha",
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_ESQUECI_SENHA_MAX,
          timeWindow: env.RATE_LIMIT_ESQUECI_SENHA_TIME_WINDOW,
          groupId: "auth-esqueci-senha",
        },
      },
    },
    solicitarRedefinicaoSenhaController
  );

  app.post(
    "/auth/redefinir-senha",
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_REDEFINIR_SENHA_MAX,
          timeWindow: env.RATE_LIMIT_REDEFINIR_SENHA_TIME_WINDOW,
          groupId: "auth-redefinir-senha",
        },
      },
    },
    redefinirSenhaController
  );

  app.patch(
    "/auth/minha-senha",
    {
      preHandler: authMiddleware,
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_TROCAR_SENHA_MAX,
          timeWindow: env.RATE_LIMIT_TROCAR_SENHA_TIME_WINDOW,
          groupId: "auth-trocar-minha-senha",
        },
      },
    },
    trocarMinhaSenhaController
  );
}