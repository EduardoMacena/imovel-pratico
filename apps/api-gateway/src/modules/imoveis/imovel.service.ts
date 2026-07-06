import crypto from "node:crypto";
import type { BuscarProprietariosInput } from "./imovel.schemas.js";

export async function criarTarefaBuscaProprietarios(
  data: BuscarProprietariosInput
) {
  const jobId = crypto.randomUUID();

  return {
    jobId,
    status: "pending",
    message: "Tarefa criada com sucesso",
    input: data,
  };
}
