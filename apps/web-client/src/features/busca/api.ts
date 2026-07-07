import { apiRequest } from "../../lib/api";
import type {
  CriarTarefaRequest,
  CriarTarefaResponse,
  ListarTarefasResponse,
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
