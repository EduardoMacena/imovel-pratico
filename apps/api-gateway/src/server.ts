import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { realtimeRoutes } from "./modules/realtime/realtime.routes.js";

const app = await buildApp();

try {
app.register(realtimeRoutes, { prefix: "/api" });
  await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });

  app.log.info(`API Gateway rodando na porta ${env.PORT}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
