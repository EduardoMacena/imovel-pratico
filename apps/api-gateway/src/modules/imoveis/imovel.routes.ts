import type {
  FastifyInstance,
  RouteHandlerMethod,
} from "fastify";
import { authMiddleware } from "../auth/auth.middleware.js";
import * as imovelController from "./imovel.controller.js";
import * as buscaPreviaController from "./busca-previa.controller.js";
import { exportarResultadosTarefaPdfController } from "./imovel-exportacao-pdf.controller.js";

function getHandler(
  source: Record<string, unknown>,
  name: string
): RouteHandlerMethod {
  const handler = source[name];

  if (typeof handler !== "function") {
    throw new Error(`Controller não encontrado: ${name}`);
  }

  return handler as RouteHandlerMethod;
}

export async function imovelRoutes(app: FastifyInstance) {
  const imovel = imovelController as unknown as Record<string, unknown>;
  const previa = buscaPreviaController as unknown as Record<string, unknown>;

  app.addHook("preHandler", authMiddleware);

  app.post(
    "/imoveis/prever-busca",
    getHandler(previa, "criarPreviaBuscaController")
  );

  app.get(
    "/imoveis/prever-busca/pendentes",
    getHandler(previa, "listarPreviasPendentesController")
  );

  app.get(
    "/imoveis/prever-busca/:id",
    getHandler(previa, "buscarPreviaBuscaController")
  );

  app.post(
    "/imoveis/prever-busca/:id/cancelar",
    getHandler(previa, "cancelarPreviaBuscaController")
  );

  app.post(
    "/imoveis/buscar-proprietarios",
    getHandler(previa, "confirmarPreviaBuscaController")
  );

  app.get(
    "/imoveis/tarefas",
    getHandler(imovel, "listarTarefasController")
  );

  app.get(
    "/imoveis/tarefas/:id/exportar",
    getHandler(imovel, "exportarResultadosTarefaController")
  );

  app.get(
    "/imoveis/tarefas/:id/exportar-excel",
    getHandler(imovel, "exportarResultadosTarefaExcelController")
  );

  app.get(
    "/imoveis/tarefas/:id/exportar-pdf",
    exportarResultadosTarefaPdfController
  );

  app.get(
    "/imoveis/tarefas/:id/progresso",
    getHandler(imovel, "buscarProgressoTarefaController")
  );

  app.get(
    "/imoveis/tarefas/:id",
    getHandler(imovel, "buscarTarefaController")
  );
}
