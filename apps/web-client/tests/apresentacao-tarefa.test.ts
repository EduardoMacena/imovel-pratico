import assert from "node:assert/strict";
import test from "node:test";
import {
  formatarReferenciaTarefa,
  getReferenciaTarefaLabel,
  getTipoBuscaLabel,
} from "../src/features/busca/apresentacao-tarefa";

test("apresenta endereço sem alterar o fluxo legado", () => {
  assert.equal(
    formatarReferenciaTarefa({
      tipoBusca: "ENDERECO",
      endereco: {
        logradouro: "Rua da Bahia",
        numero: "100",
      },
    }),
    "Rua da Bahia, 100",
  );

  assert.equal(getReferenciaTarefaLabel("ENDERECO"), "Endereço pesquisado");
  assert.equal(getTipoBuscaLabel("ENDERECO"), "Endereço");
});

test("oculta os valores técnicos da busca direta por códigos", () => {
  assert.equal(
    formatarReferenciaTarefa({
      tipoBusca: "CODIGOS_CADASTRAIS",
      endereco: {
        logradouro: "CÓDIGOS CADASTRAIS",
        numero: "ENTRADA DIRETA",
      },
    }),
    "Códigos cadastrais",
  );

  assert.equal(getReferenciaTarefaLabel("CODIGOS_CADASTRAIS"), "Tipo de busca");

  assert.equal(getTipoBuscaLabel("CODIGOS_CADASTRAIS"), "Códigos cadastrais");
});

test("mantém compatibilidade defensiva com tarefas antigas", () => {
  assert.equal(
    formatarReferenciaTarefa({
      endereco: {
        logradouro: "Avenida Brasil",
        numero: "",
      },
    }),
    "Avenida Brasil",
  );

  assert.equal(formatarReferenciaTarefa({}), "-");
});
