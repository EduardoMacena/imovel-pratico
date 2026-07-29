import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_CODIGOS_POR_PREVIA,
  analisarCodigosParaInterface,
} from "../src/features/busca/codigos-cadastrais";

test("normaliza códigos separados por linha, vírgula e ponto e vírgula", () => {
  const result = analisarCodigosParaInterface(
    " 001.002.003-4\nabc / 123,009_008;777.666 "
  );

  assert.deepEqual(result.codigosValidos, [
    "001.002.003-4",
    "ABC/123",
    "009_008",
    "777.666",
  ]);
  assert.equal(result.totalRecebidos, 4);
  assert.equal(result.totalValidos, 4);
});

test("remove duplicados depois da normalização", () => {
  const result = analisarCodigosParaInterface(
    "abc-123, ABC - 123;abc-123"
  );

  assert.deepEqual(result.codigosValidos, ["ABC-123"]);
  assert.deepEqual(result.codigosDuplicados, ["ABC-123", "ABC-123"]);
  assert.equal(result.totalDuplicados, 2);
});

test("classifica caracteres e tamanho inválidos", () => {
  const muitoLongo = "A".repeat(65);
  const result = analisarCodigosParaInterface(
    `ABC#123;${muitoLongo};OK-123`
  );

  assert.equal(result.totalValidos, 1);
  assert.equal(result.totalInvalidos, 2);
  assert.deepEqual(
    result.codigosInvalidos.map((item) => item.motivo),
    ["CARACTERES_INVALIDOS", "TAMANHO_INVALIDO"]
  );
});

test("mantém a contagem acima do limite para a interface bloquear o envio", () => {
  const input = Array.from(
    { length: MAX_CODIGOS_POR_PREVIA + 1 },
    (_, index) => `COD-${index}`
  ).join("\n");

  const result = analisarCodigosParaInterface(input);

  assert.equal(result.totalRecebidos, MAX_CODIGOS_POR_PREVIA + 1);
  assert.equal(result.totalValidos, MAX_CODIGOS_POR_PREVIA + 1);
});

test("retorna resumo vazio quando não há códigos", () => {
  const result = analisarCodigosParaInterface("  \n, ; ");

  assert.equal(result.totalRecebidos, 0);
  assert.equal(result.totalValidos, 0);
  assert.deepEqual(result.codigosValidos, []);
});
