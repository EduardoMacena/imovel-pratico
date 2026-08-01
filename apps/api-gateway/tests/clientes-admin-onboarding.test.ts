import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  atualizarClienteOnboardingSchema,
  criarClienteOnboardingSchema,
} from "../src/modules/clientes-admin/clientes-admin.schemas.js";

const planoId = "00000000-0000-4000-8000-000000000001";
const municipioId = "00000000-0000-4000-8000-000000000002";

test("aceita o contrato completo do onboarding administrativo", () => {
  const result = criarClienteOnboardingSchema.parse({
    nome: "Imobiliária Horizonte",
    planoId,
    municipioId,
    pagamentoStatus: "PENDENTE",
    pagamentoVenceEm: "2026-08-10",
    administradorInicial: {
      nome: "Administrador",
      email: "admin@example.com",
      senha: "senha-segura",
    },
  });

  assert.equal(result.status, "ATIVO");
  assert.equal(result.modoProcessamento, "AGENT");
  assert.equal(result.administradorInicial.email, "admin@example.com");
});

test("exige município e administrador inicial", () => {
  assert.throws(() =>
    criarClienteOnboardingSchema.parse({
      nome: "Imobiliária Horizonte",
      planoId,
    }),
  );
});

test("aceita atualização de município e pagamento", () => {
  const result = atualizarClienteOnboardingSchema.parse({
    municipioId,
    pagamentoStatus: "PAGO",
    pagamentoVenceEm: null,
  });

  assert.equal(result.municipioId, municipioId);
  assert.equal(result.pagamentoStatus, "PAGO");
  assert.equal(result.pagamentoVenceEm, null);
});

test("registra endpoints novos sem remover endpoints legados", () => {
  const source = readFileSync(
    new URL("../src/modules/admin/admin.routes.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /\/admin\/municipios/);
  assert.match(source, /\/admin\/clientes\/onboarding/);
  assert.match(source, /\/admin\/clientes\/:id\/onboarding/);
  assert.match(
    source,
    /app\.post\("\/admin\/clientes", criarClienteController\)/,
  );
});

test("cria cliente, município e administrador na mesma transação", () => {
  const source = readFileSync(
    new URL(
      "../src/modules/clientes-admin/clientes-admin.service.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /prisma\.\$transaction/);
  assert.match(source, /tx\.cliente\.create/);
  assert.match(source, /municipios:\s*\{\s*create:/s);
  assert.match(source, /usuarios:\s*\{\s*create:/s);
  assert.match(source, /role:\s*"ADMIN"/);
  assert.match(source, /precisaTrocarSenha:\s*true/);
  assert.doesNotMatch(source, /MUNICIPIO_BELO_HORIZONTE_ID/);
});

test("valida plano e município ativos e sincroniza o plano", () => {
  const source = readFileSync(
    new URL(
      "../src/modules/clientes-admin/clientes-admin.service.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /plano\.status !== "ATIVO"/);
  assert.match(source, /municipio\.status !== "ATIVO"/);
  assert.match(source, /limiteMensalConsultas:\s*plano\.limiteMensalConsultas/);
  assert.match(source, /intervaloSegundos:\s*plano\.intervaloSegundos/);
});

test("envia e-mail somente depois da transação", () => {
  const source = readFileSync(
    new URL(
      "../src/modules/clientes-admin/clientes-admin.service.ts",
      import.meta.url,
    ),
    "utf8",
  );

  const transactionIndex = source.indexOf("await prisma.$transaction");
  const emailIndex = source.indexOf("await enviarEmailBoasVindasUsuario");

  assert.ok(transactionIndex >= 0);
  assert.ok(emailIndex > transactionIndex);
  assert.match(source, /EMAIL_BOAS_VINDAS_NAO_ENVIADO/);
});

test("troca município principal transacionalmente", () => {
  const source = readFileSync(
    new URL(
      "../src/modules/clientes-admin/clientes-admin.service.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /tx\.clienteMunicipio\.updateMany/);
  assert.match(source, /tx\.clienteMunicipio\.upsert/);
  assert.match(source, /pagamentoStatus:\s*data\.pagamentoStatus/);
  assert.match(source, /limiteDiario:\s*data\.limiteDiario/);
});

test("não registra conteúdo nem dados do e-mail no modo simulado", () => {
  const source = readFileSync(
    new URL("../src/services/email.service.ts", import.meta.url),
    "utf8",
  );

  const markerIndex = source.indexOf("[EMAIL_SIMULADO]");

  assert.ok(markerIndex >= 0);

  const statementStart = source.lastIndexOf("\n", markerIndex) + 1;
  const statementEnd = source.indexOf(");", markerIndex);
  const statement = source.slice(statementStart, statementEnd + 2);

  assert.match(statement, /conteúdo do e-mail omitido/);
  assert.doesNotMatch(
    statement,
    /\bto\b|\bsubject\b|\btext\b|\bhtml\b|senhaTemporaria/,
  );
});

test("rejeita slug vazio após normalização e data civil impossível", () => {
  const base = {
    nome: "Imobiliária Casos Limite",
    planoId,
    municipioId,
    administradorInicial: {
      nome: "Administrador",
      email: "limites@example.com",
      senha: "senha-segura",
    },
  };

  assert.throws(() =>
    criarClienteOnboardingSchema.parse({
      ...base,
      slug: "---",
    }),
  );

  assert.throws(() =>
    criarClienteOnboardingSchema.parse({
      ...base,
      pagamentoVenceEm: "2026-02-31",
    }),
  );
});

test("mapeia unicidade pelo campo e permite suspensão com plano inativo", () => {
  const source = readFileSync(
    new URL(
      "../src/modules/clientes-admin/clientes-admin.service.ts",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /EMAIL_USUARIO_DUPLICADO/);
  assert.match(source, /field\.includes\("email"\)/);
  assert.match(
    source,
    /data\.planoId !== undefined \|\| statusFinal === "ATIVO"/,
  );
  assert.match(source, /validarSlugNormalizado/);
  assert.match(source, /PAGAMENTO_VENCIMENTO_INVALIDO/);
});
