import Fastify from "fastify";
import cors from "@fastify/cors";
import { ZodError } from "zod";
import { appRoutes } from "./routes.js";
import { env } from "./config/env.js";

export async function buildApp() {
  const app = Fastify({
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

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "ValidationError",
        message: "Dados inválidos",
        issues: error.issues,
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
