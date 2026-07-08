import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../auth/auth.middleware.js";
import { adminMiddleware } from "./admin.middleware.js";
import {
  atualizarClienteController,
  atualizarUsuarioController,
  buscarClienteController,
  buscarUsuarioController,
  criarClienteController,
  criarUsuarioController,
  listarClientesController,
  listarTarefasDoClienteController,
  listarUsuariosDoClienteController,
} from "./admin.controller.js";

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);
  app.addHook("preHandler", adminMiddleware);

  app.get("/admin/clientes", listarClientesController);
  app.post("/admin/clientes", criarClienteController);
  app.get("/admin/clientes/:id", buscarClienteController);
  app.patch("/admin/clientes/:id", atualizarClienteController);

  app.get(
    "/admin/clientes/:clienteId/tarefas",
    listarTarefasDoClienteController
  );

  app.get(
    "/admin/clientes/:clienteId/usuarios",
    listarUsuariosDoClienteController
  );

  app.post(
    "/admin/clientes/:clienteId/usuarios",
    criarUsuarioController
  );

  app.get("/admin/usuarios/:id", buscarUsuarioController);
  app.patch("/admin/usuarios/:id", atualizarUsuarioController);
}