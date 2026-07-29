import assert from "node:assert/strict";
import test from "node:test";
import {
  analisarCodigosCadastrais,
  normalizarCodigoCadastral,
} from "../src/modules/imoveis/codigos-cadastrais.js";

test("normaliza espaços e caixa sem remover a máscara cadastral", () => {
  assert.equal(
    normalizarCodigoCadastral("  123.456 / ab-9  "),
    "123.456/AB-9"
  );
});

test("aceita códigos separados por linha, vírgula e ponto e vírgula", () => {
  const resumo = analisarCodigosCadastrais(
    "001.002-3\n004/005;ABC_10, 999"
  );

  assert.deepEqual(resumo.codigosValidos, [
    "001.002-3",
    "004/005",
    "ABC_10",
    "999",
  ]);
  assert.equal(resumo.totalRecebidos, 4);
  assert.equal(resumo.totalValidos, 4);
});

test("remove duplicados após a normalização", () => {
  const resumo = analisarCodigosCadastrais([
    "abc-1",
    " ABC - 1 ",
    "xyz-2",
  ]);

  assert.deepEqual(resumo.codigosValidos, ["ABC-1", "XYZ-2"]);
  assert.deepEqual(resumo.codigosDuplicados, ["ABC-1"]);
  assert.equal(resumo.totalDuplicados, 1);
});

test("separa entradas com caracteres inválidos", () => {
  const resumo = analisarCodigosCadastrais(
    "123-4; código@invalido; outro#codigo"
  );

  assert.deepEqual(resumo.codigosValidos, ["123-4"]);
  assert.equal(resumo.totalInvalidos, 2);
  assert.deepEqual(
    resumo.codigosInvalidos.map((item) => item.motivo),
    ["CARACTERES_INVALIDOS", "CARACTERES_INVALIDOS"]
  );
});

test("bloqueia lotes acima do limite operacional", () => {
  const codigos = Array.from(
    { length: 1001 },
    (_, index) => `CODIGO-${index}`
  );

  assert.throws(
    () => analisarCodigosCadastrais(codigos),
    /no máximo 1000 códigos cadastrais/
  );
});
