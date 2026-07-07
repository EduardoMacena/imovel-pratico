import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../auth/auth.middleware.js";
import { adminMiddleware } from "./admin.middleware.js";
import {
  atualizarClienteController,
  atualizarUsuarioController,
  criarClienteController,
  criarUsuarioController,
  listarClientesController,
  listarUsuariosDoClienteController,
} from "./admin.controller.js";

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);
  app.addHook("preHandler", adminMiddleware);

  app.get("/admin/clientes", listarClientesController);
  app.post("/admin/clientes", criarClienteController);
  app.patch("/admin/clientes/:id", atualizarClienteController);

  app.get(
    "/admin/clientes/:clienteId/usuarios",
    listarUsuariosDoClienteController
  );

  app.post(
    "/admin/clientes/:clienteId/usuarios",
    criarUsuarioController
  );

  app.patch("/admin/usuarios/:id", atualizarUsuarioController);
}
