import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../auth/auth.middleware.js";
import { adminMiddleware } from "./admin.middleware.js";
import {
	atualizarClienteController,
	atualizarUsuarioController,
	buscarClienteController,
	buscarDashboardAdminController,
	buscarTarefaAdminController,
	buscarUsuarioController,
	cancelarTarefaAdminController,
	criarClienteController,
	criarUsuarioController,
	listarClientesController,
	listarTarefasDoClienteController,
	listarUsuariosDoClienteController,
	reprocessarTarefaAdminController,
} from "./admin.controller.js";

export async function adminRoutes(app: FastifyInstance) {
	app.addHook("preHandler", authMiddleware);
	app.addHook("preHandler", adminMiddleware);

	app.get("/admin/dashboard", buscarDashboardAdminController);

	app.get("/admin/tarefas/:id", buscarTarefaAdminController);
	app.post("/admin/tarefas/:id/cancelar", cancelarTarefaAdminController);
	app.post("/admin/tarefas/:id/reprocessar", reprocessarTarefaAdminController);

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

	app.post("/admin/clientes/:clienteId/usuarios", criarUsuarioController);

	app.get("/admin/usuarios/:id", buscarUsuarioController);
	app.patch("/admin/usuarios/:id", atualizarUsuarioController);
}
