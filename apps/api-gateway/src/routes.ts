import type { FastifyInstance } from "fastify";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { imovelRoutes } from "./modules/imoveis/imovel.routes.js";

export async function appRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(imovelRoutes);
  await app.register(adminRoutes);
}