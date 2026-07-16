import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../auth/auth.middleware.js";
import { adminMiddleware } from "./admin.middleware.js";
import { exportarResultadosTarefaAdminPdfController } from "./admin-exportacao-pdf.controller.js";
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
	exportarResultadosTarefaAdminController,
	exportarResultadosTarefaAdminExcelController,
	listarClientesController,
	listarTarefasDoClienteController,
	listarUsuariosDoClienteController,
	reprocessarTarefaAdminController,
	atualizarPlanoController,
	buscarPlanoController,
	criarPlanoController,
	listarPlanosController,
	buscarConsumoClienteController,
	listarConsumoClientesController,
} from "./admin.controller.js";
import {
  buscarFaturaController,
  cancelarFaturaController,
  gerarFaturaController,
  listarFaturasController,
  marcarFaturaPagaController,
} from "./admin-faturas.controller.js";
import {
  buscarResumoMonitoramentoController,
  listarEventosMonitoramentoController,
  listarFilasMonitoramentoController,
} from "./admin-monitoramento.controller.js";

export async function adminRoutes(app: FastifyInstance) {
	app.addHook("preHandler", authMiddleware);
	app.addHook("preHandler", adminMiddleware);

	app.get("/admin/dashboard", buscarDashboardAdminController);

  app.get("/admin/monitoramento/resumo", buscarResumoMonitoramentoController);
  app.get("/admin/monitoramento/eventos", listarEventosMonitoramentoController);
  app.get("/admin/monitoramento/filas", listarFilasMonitoramentoController);

	app.get("/admin/consumo/clientes", listarConsumoClientesController);
	app.get("/admin/consumo/clientes/:id", buscarConsumoClienteController);

  app.get("/admin/faturas", listarFaturasController);
  app.post("/admin/faturas/gerar", gerarFaturaController);
  app.get("/admin/faturas/:id", buscarFaturaController);
  app.post("/admin/faturas/:id/marcar-paga", marcarFaturaPagaController);
  app.post("/admin/faturas/:id/cancelar", cancelarFaturaController);

	app.get("/admin/planos", listarPlanosController);
	app.post("/admin/planos", criarPlanoController);
	app.get("/admin/planos/:id", buscarPlanoController);
	app.patch("/admin/planos/:id", atualizarPlanoController);

	app.get("/admin/tarefas/:id", buscarTarefaAdminController);

	app.get(
		"/admin/tarefas/:id/exportar",
		exportarResultadosTarefaAdminController
	);

	app.get(
		"/admin/tarefas/:id/exportar-excel",
		exportarResultadosTarefaAdminExcelController
	);

  app.get(
    "/admin/tarefas/:id/exportar-pdf",
    exportarResultadosTarefaAdminPdfController
  );

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
