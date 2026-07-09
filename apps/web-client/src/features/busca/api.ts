import { apiDownload, apiRequest } from "../../lib/api";
import type {
  CriarTarefaRequest,
  CriarTarefaResponse,
  ListarTarefasResponse,
  MinhaAssinaturaResponse,
  ProgressoTarefaResponse,
} from "./types";

export function criarTarefaBusca(data: CriarTarefaRequest) {
  return apiRequest<CriarTarefaResponse>("/imoveis/buscar-proprietarios", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function buscarProgressoTarefa(tarefaId: string) {
  return apiRequest<ProgressoTarefaResponse>(
    `/imoveis/tarefas/${tarefaId}/progresso`
  );
}

export function listarTarefas() {
  return apiRequest<ListarTarefasResponse>("/imoveis/tarefas");
}

export function exportarResultadosTarefa(tarefaId: string) {
  return apiDownload(
    `/imoveis/tarefas/${tarefaId}/exportar`,
    `resultados-tarefa-${tarefaId}.csv`
  );
}

export function exportarResultadosTarefaExcel(tarefaId: string) {
  return apiDownload(
    `/imoveis/tarefas/${tarefaId}/exportar-excel`,
    `resultados-tarefa-${tarefaId}.xlsx`
  );
}

export function buscarMinhaAssinatura() {
  return apiRequest<MinhaAssinaturaResponse>("/imoveis/minha-assinatura");
}
