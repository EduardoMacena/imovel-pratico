import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  listarCamposAlteradosCliente,
  montarSnapshotClienteAuditoria,
  normalizarRoleAuditoria,
} from "../src/modules/clientes-admin/clientes-admin.audit.js";

const read = (p: string) =>
  readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");
const antes = {
  id: "cliente-1",
  nome: "Imobiliária Horizonte",
  slug: "imobiliaria-horizonte",
  status: "ATIVO",
  cnpj: "04252011000110",
  razaoSocial: "Horizonte Imóveis Ltda.",
  nomeFantasia: "Horizonte",
  emailComercial: "contato@horizonte.com.br",
  telefoneComercial: "43999991234",
  enderecoCep: "86870000",
  enderecoLogradouro: "Avenida Brasil",
  enderecoNumero: "1500",
  enderecoComplemento: "Sala 4",
  enderecoBairro: "Centro",
  enderecoCidade: "Ivaiporã",
  enderecoUf: "PR",
  modoProcessamento: "AGENT",
  workerUrl: "https://worker.exemplo.test/segredo",
  intervaloSegundos: 60,
  limiteDiario: 300,
  limiteMensalConsultas: 1000,
  pagamentoStatus: "PAGO",
  pagamentoVenceEm: new Date("2026-08-10T12:00:00.000Z"),
  planoId: "plano-1",
  municipios: [{ municipio: { id: "municipio-1" } }],
};

test("cria modelo dedicado", () => {
  const s = read("../../../packages/database/prisma/schema.prisma");
  const m = read(
    "../../../packages/database/prisma/migrations/20260806170000_adicionar_auditoria_administrativa/migration.sql",
  );
  assert.match(s, /model AuditoriaAdministrativa\s*\{/);
  assert.match(s, /usuarioId\s+String\?/);
  assert.match(s, /executorEmail\s+String/);
  assert.match(s, /dadosAntes\s+Json\?/);
  assert.match(s, /dadosDepois\s+Json\?/);
  assert.match(m, /CREATE TABLE "auditorias_administrativas"/);
  assert.match(m, /auditorias_administrativas_usuarioId_fkey/);
  assert.match(m, /ON DELETE SET NULL/);
});

test("sanitiza snapshots", () => {
  const snap = montarSnapshotClienteAuditoria(antes);
  const json = JSON.stringify(snap);
  assert.equal(snap.cnpj, "04********10");
  assert.equal(snap.emailComercial, "c***@horizonte.com.br");
  assert.equal(snap.telefoneComercial, "*******1234");
  assert.equal((snap.endereco as Record<string, unknown>).cep, "*****000");
  assert.equal(snap.workerConfigurado, true);
  for (const raw of [
    "04252011000110",
    "contato@horizonte.com.br",
    "43999991234",
    "Avenida Brasil",
    "1500",
    "Sala 4",
    "worker.exemplo",
  ]) {
    assert.doesNotMatch(
      json,
      new RegExp(raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
  assert.doesNotMatch(json, /senha|hash|token/i);
});

test("lista alterações reais", () => {
  const depois = {
    ...antes,
    status: "SUSPENSO",
    pagamentoStatus: "PENDENTE",
    municipios: [{ municipio: { id: "municipio-2" } }],
  };
  assert.deepEqual(
    listarCamposAlteradosCliente(
      ["status", "pagamentoStatus", "municipioId", "nome"],
      antes,
      depois,
    ),
    ["municipioId", "pagamentoStatus", "status"],
  );
});

test("normaliza o role autenticado", () => {
  assert.equal(normalizarRoleAuditoria("SUPER_ADMIN"), "SUPER_ADMIN");
  assert.equal(normalizarRoleAuditoria("ADMIN"), "ADMIN");
  assert.throws(
    () => normalizarRoleAuditoria("ROOT"),
    /Role autenticada inválida/,
  );
});

test("controller repassa executor e HTTP", () => {
  const c = read("../src/modules/clientes-admin/clientes-admin.controller.ts");
  for (const p of [
    /request\.auth\.usuarioId/,
    /request\.auth\.email/,
    /request\.auth\.role/,
    /request\.id/,
    /request\.ip/,
    /request\.headers\["user-agent"\]/,
  ])
    assert.match(c, p);
  assert.match(
    c,
    /criarClienteOnboarding\(\s*body,\s*montarContextoAuditoriaAdministrativa\(request\)/s,
  );
  assert.match(
    c,
    /atualizarClienteOnboarding\(\s*id,\s*body,\s*montarContextoAuditoriaAdministrativa\(request\)/s,
  );
});

test("audita criação e atualização dentro da transação", () => {
  const s = read("../src/modules/clientes-admin/clientes-admin.service.ts");
  assert.match(s, /acao:\s*"CLIENTE_CRIADO"/);
  assert.match(s, /acao:\s*"CLIENTE_ATUALIZADO"/);
  assert.match(s, /tx\.auditoriaAdministrativa\.create\(/);
  assert.match(s, /dadosAntes:/);
  assert.match(s, /dadosDepois:/);
  assert.doesNotMatch(s, /prisma\.auditoriaAdministrativa\.create\(/);
  const t = s.indexOf("resultado = await prisma.$transaction");
  const a = s.indexOf("await tx.auditoriaAdministrativa.create", t);
  const e = s.indexOf("await enviarEmailBoasVindasUsuario");
  assert.ok(t >= 0 && a > t && e > a);
});

test("mantém OperacaoEvento separado", () => {
  const s = read("../../../packages/database/prisma/schema.prisma");
  const svc = read("../src/modules/clientes-admin/clientes-admin.service.ts");
  assert.match(s, /model OperacaoEvento\s*\{/);
  assert.match(s, /model AuditoriaAdministrativa\s*\{/);
  assert.doesNotMatch(svc, /operacaoEvento\.create/);
});
