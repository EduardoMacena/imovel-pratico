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

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/$/, "");
}

function getCorsOrigins() {
  return env.CORS_ORIGINS.split(",")
    .map(origin => normalizeOrigin(origin))
    .filter(Boolean);
}

function isOriginAllowed(origin: string | undefined, allowedOrigins: string[]) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOrigins.includes(normalizedOrigin);
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

  const allowedOrigins = getCorsOrigins();

  await app.register(cors, {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origem não permitida pelo CORS: ${origin}`), false);
    },
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

    if (
      error instanceof Error &&
      error.message.startsWith("Origem não permitida pelo CORS")
    ) {
      return reply.status(403).send({
        error: "CorsOriginNotAllowed",
        message: "Origem não permitida.",
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