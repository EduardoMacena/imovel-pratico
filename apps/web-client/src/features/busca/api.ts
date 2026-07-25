import { apiDownload, apiRequest } from "../../lib/api";
import type {
  CriarTarefaRequest,
  CriarTarefaResponse,
  ListarPreviasPendentesResponse,
  ListarTarefasResponse,
  MinhaAssinaturaResponse,
  PreverBuscaRequest,
  PreverBuscaResponse,
  ProgressoTarefaResponse,
} from "./types";

export function preverBusca(data: PreverBuscaRequest) {
  return apiRequest<PreverBuscaResponse>("/imoveis/prever-busca", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function buscarPrevia(previaId: string) {
  return apiRequest<PreverBuscaResponse>(`/imoveis/prever-busca/${previaId}`);
}

export function listarPreviasPendentes() {
  return apiRequest<ListarPreviasPendentesResponse>(
    "/imoveis/prever-busca/pendentes"
  );
}

export function cancelarPrevia(previaId: string) {
  return apiRequest<PreverBuscaResponse>(
    `/imoveis/prever-busca/${previaId}/cancelar`,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

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


export function exportarResultadosTarefaPdf(tarefaId: string) {
  return apiDownload(
    `/imoveis/tarefas/${tarefaId}/exportar-pdf`,
    `proprietarios-tarefa-${tarefaId}.pdf`
  );
}
