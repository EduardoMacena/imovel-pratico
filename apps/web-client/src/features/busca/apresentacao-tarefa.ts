import type { TipoBusca } from "./types";

type ReferenciaTarefa = {
  tipoBusca?: TipoBusca | null;
  endereco?: {
    logradouro?: string | null;
    numero?: string | null;
  } | null;
};

export function getTipoBuscaLabel(tipoBusca?: TipoBusca | null) {
  return tipoBusca === "CODIGOS_CADASTRAIS" ? "Códigos cadastrais" : "Endereço";
}

export function getReferenciaTarefaLabel(tipoBusca?: TipoBusca | null) {
  return tipoBusca === "CODIGOS_CADASTRAIS"
    ? "Tipo de busca"
    : "Endereço pesquisado";
}

export function formatarReferenciaTarefa(tarefa: ReferenciaTarefa) {
  if (tarefa.tipoBusca === "CODIGOS_CADASTRAIS") {
    return getTipoBuscaLabel(tarefa.tipoBusca);
  }

  const logradouro = tarefa.endereco?.logradouro?.trim() ?? "";
  const numero = tarefa.endereco?.numero?.trim() ?? "";

  if (logradouro && numero) {
    return `${logradouro}, ${numero}`;
  }

  if (logradouro) {
    return logradouro;
  }

  if (numero) {
    return `Nº ${numero}`;
  }

  return "-";
}
