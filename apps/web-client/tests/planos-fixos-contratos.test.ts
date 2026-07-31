import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  formatarMensagemLimitePlano,
  podeConfirmarPrevia,
} from "../src/features/busca/plano-fixo.js";

const renovacaoEm = "2026-08-01T00:00:00.000Z";

test("permite confirmar quando o saldo é exatamente igual", () => {
  assert.equal(
    podeConfirmarPrevia({
      limiteMensalConsultas: 100,
      consultasUsadas: 70,
      consultasRestantes: 30,
      consultasSolicitadas: 30,
      consultasRestantesAposReserva: 0,
      podeConfirmar: true,
      renovacaoEm,
    }),
    true,
  );
});

test("bloqueia quando a busca ultrapassa o saldo", () => {
  assert.equal(
    podeConfirmarPrevia({
      limiteMensalConsultas: 100,
      consultasUsadas: 70,
      consultasRestantes: 30,
      consultasSolicitadas: 31,
      consultasRestantesAposReserva: 0,
      podeConfirmar: false,
      renovacaoEm,
    }),
    false,
  );
});

test("orienta renovação quando o saldo está zerado", () => {
  const mensagem = formatarMensagemLimitePlano({
    consultasRestantes: 0,
    consultasSolicitadas: 1,
    renovacaoEm,
  });

  assert.match(mensagem, /limite do plano foi atingido/i);
  assert.match(mensagem, /renovação/i);
  assert.doesNotMatch(mensagem, /excedente|cobrança adicional/i);
});

test("os contratos públicos não expõem autorização ou preço adicional", () => {
  const schema = readFileSync(
    new URL(
      "../../api-gateway/src/modules/imoveis/imovel.schemas.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const types = readFileSync(
    new URL("../src/features/busca/types.ts", import.meta.url),
    "utf8",
  );
  const page = readFileSync(
    new URL("../src/app/nova-busca/page.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(schema, /confirmarExcedente/);
  assert.doesNotMatch(types, /precisaConfirmarExcedente/);
  assert.doesNotMatch(types, /valorConsultaAdicionalCentavos/);
  assert.doesNotMatch(page, /cobrança adicional|Autorização individual/);
  assert.match(page, /LIMITE_PLANO_INSUFICIENTE/);
  assert.match(page, /Limite atingido|Limite insuficiente|Saldo disponível/);
});
