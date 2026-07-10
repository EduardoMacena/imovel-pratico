import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import { appRoutes } from "./routes.js";
import { env } from "./config/env.js";

function isHttpError(error: unknown): error is {
  statusCode?: number;
  message?: string;
} {
  return typeof error === "object" && error !== null;
}

export async function buildApp() {
  const app = Fastify({
    trustProxy: env.TRUST_PROXY,
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
              },
            }
          : undefined,
    },
  });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  if (env.RATE_LIMIT_ENABLED) {
    await app.register(rateLimit, {
      global: false,
      hook: "onRequest",
      errorResponseBuilder: (_request, context) => {
        return {
          statusCode: 429,
          error: "RateLimitExceeded",
          message: `Muitas tentativas. Aguarde ${context.after} e tente novamente.`,
        };
      },
    });
  }

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "ValidationError",
        message: "Dados inválidos",
        issues: error.issues,
      });
    }

    if (isHttpError(error) && error.statusCode === 429) {
      return reply.status(429).send({
        error: "RateLimitExceeded",
        message:
          error.message ||
          "Muitas tentativas. Aguarde alguns instantes e tente novamente.",
      });
    }

    return reply.status(500).send({
      error: "InternalServerError",
      message: "Erro interno do servidor",
    });
  });

  await app.register(appRoutes, {
    prefix: "/api",
  });

  return app;
}