import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  LimitePlanoInsuficienteError,
  calcularDisponibilidadePlanoFixo,
  validarSaldoPlanoFixo,
} from "../src/modules/assinatura/plano-fixo.js";

const renovacaoEm = new Date("2026-08-01T00:00:00.000Z");

test("permite uma busca exatamente igual ao saldo disponível", () => {
  const resumo = validarSaldoPlanoFixo({
    limiteMensalConsultas: 100,
    consultasUsadas: 70,
    consultasSolicitadas: 30,
    renovacaoEm,
  });

  assert.equal(resumo.consultasRestantes, 30);
  assert.equal(resumo.consultasRestantesAposReserva, 0);
});

test("bloqueia uma busca maior que o saldo disponível", () => {
  assert.throws(
    () =>
      validarSaldoPlanoFixo({
        limiteMensalConsultas: 100,
        consultasUsadas: 70,
        consultasSolicitadas: 31,
        renovacaoEm,
      }),
    (error) => {
      assert.ok(error instanceof LimitePlanoInsuficienteError);
      assert.equal(error.code, "LIMITE_PLANO_INSUFICIENTE");
      assert.equal(error.detalhes.consultasRestantes, 30);
      assert.equal(error.detalhes.consultasSolicitadas, 31);
      return true;
    },
  );
});

test("bloqueia qualquer nova busca quando o saldo está zerado", () => {
  assert.throws(
    () =>
      validarSaldoPlanoFixo({
        limiteMensalConsultas: 100,
        consultasUsadas: 100,
        consultasSolicitadas: 1,
        renovacaoEm,
      }),
    LimitePlanoInsuficienteError,
  );
});

test("nunca apresenta saldo negativo", () => {
  const resumo = calcularDisponibilidadePlanoFixo({
    limiteMensalConsultas: 100,
    consultasUsadas: 120,
    consultasSolicitadas: 0,
    renovacaoEm,
  });

  assert.equal(resumo.consultasRestantes, 0);
  assert.equal(resumo.consultasRestantesAposReserva, 0);
});

test("a confirmação usa transação e lock por cliente", () => {
  const source = readFileSync(
    new URL("../src/modules/imoveis/busca-previa.service.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /prisma\.\$transaction/);
  assert.match(source, /FOR UPDATE/);
  assert.match(source, /validarSaldoPlanoFixo/);
  assert.match(source, /excedenteAutorizado:\s*false/);
  assert.match(source, /tarefa:\s*\{/);
  assert.match(source, /tarefaCriadaId/);
  assert.match(source, /status:\s*"ERROR"/);
  assert.doesNotMatch(source, /!data\.confirmarExcedente/);
});
