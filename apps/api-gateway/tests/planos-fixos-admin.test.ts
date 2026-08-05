import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  atualizarPlanoSchema,
  criarPlanoSchema,
} from "../src/modules/admin/admin.schemas.js";
import {
  calcularResumoUsoAdminPlanoFixo,
  calcularValoresFaturaPlanoFixo,
  normalizarItemFaturaHistorica,
  serializarPlanoFixoAdmin,
} from "../src/modules/admin/admin-planos-fixos.js";

function readSource(relative: string) {
  return readFileSync(new URL("../" + relative, import.meta.url), "utf8");
}

function extractBetween(source: string, start: string, end: string) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);

  assert.notEqual(startIndex, -1, "Início ausente: " + start);
  assert.notEqual(endIndex, -1, "Fim ausente: " + end);

  return source.slice(startIndex, endIndex);
}

test("schemas administrativos ignoram preço adicional legado", () => {
  const creation = criarPlanoSchema.parse({
    nome: "Plano Fixo",
    limiteMensalConsultas: 1000,
    intervaloSegundos: 60,
    precoCentavos: 149700,
    limiteCorretores: 26,
    status: "ATIVO",
    valorConsultaAdicionalCentavos: 999,
  });

  const update = atualizarPlanoSchema.parse({
    precoCentavos: 99700,
    valorConsultaAdicionalCentavos: 999,
  });

  assert.equal("valorConsultaAdicionalCentavos" in creation, false);
  assert.equal("valorConsultaAdicionalCentavos" in update, false);
});

test("serializa o plano sem contrato de consulta adicional", () => {
  const plano = serializarPlanoFixoAdmin({
    id: "plano-1",
    nome: "Premium",
    slug: "premium",
    descricao: null,
    limiteMensalConsultas: 1000,
    intervaloSegundos: 60,
    precoCentavos: 149700,
    limiteCorretores: 26,
    status: "ATIVO",
    createdAt: new Date("2026-08-01T00:00:00.000Z"),
    updatedAt: new Date("2026-08-01T00:00:00.000Z"),
  });

  assert.equal("valorConsultaAdicionalCentavos" in plano, false);
  assert.equal(plano.precoCentavos, 149700);
  assert.equal(plano.limiteMensalConsultas, 1000);
});

test("resume uso sem excedente e limita o percentual a cem", () => {
  const resumo = calcularResumoUsoAdminPlanoFixo({
    consultasUsadas: 1200,
    limiteMensal: 1000,
  });

  assert.deepEqual(resumo, {
    consultasUsadas: 1200,
    limiteMensal: 1000,
    consultasRestantes: 0,
    percentualUsado: 100,
  });
});

test("gera valores de fatura somente pela mensalidade fixa", () => {
  const valores = calcularValoresFaturaPlanoFixo({
    consultasInclusas: 1000,
    consultasUsadas: 1400,
    valorMensalidadeCentavos: 149700,
  });

  assert.deepEqual(valores, {
    consultasInclusas: 1000,
    consultasUsadas: 1400,
    consultasExcedentes: 0,
    valorMensalidadeCentavos: 149700,
    valorConsultaAdicionalCentavos: 0,
    valorExcedenteCentavos: 0,
    valorTotalCentavos: 149700,
  });
});

test("neutraliza item histórico sem alterar seu valor", () => {
  const item = normalizarItemFaturaHistorica({
    id: "item-1",
    tipo: "CONSULTA_EXCEDENTE",
    descricao: "100 consultas excedentes",
    quantidade: 100,
    valorUnitarioCentavos: 180,
    valorTotalCentavos: 18000,
  });

  assert.equal(item.tipo, "AJUSTE");
  assert.equal(item.descricao, "Ajuste histórico de faturamento");
  assert.equal(item.valorTotalCentavos, 18000);
});

test("serviços administrativos não calculam novo excedente", () => {
  const admin = readSource("src/modules/admin/admin.service.ts");
  const invoices = readSource("src/modules/admin/admin-faturas.service.ts");

  const taskBlock = extractBetween(
    admin,
    "export async function buscarTarefaAdminPorId",
    "export async function cancelarTarefaAdmin",
  );

  const usageBlock = extractBetween(
    admin,
    "function calcularResumoUsoAdmin",
    "function getInicioMesAtual",
  );

  const invoiceBlock = extractBetween(
    invoices,
    "async function calcularDadosFatura",
    "export async function listarFaturasAdmin",
  );

  assert.doesNotMatch(taskBlock, /\bexcedente\s*:/);
  assert.doesNotMatch(
    usageBlock,
    /consultasExcedentes|valorExcedente|valorConsultaAdicional/,
  );
  assert.match(invoiceBlock, /calcularValoresFaturaPlanoFixo/);
  assert.doesNotMatch(invoiceBlock, /CONSULTA_EXCEDENTE|itens\.push|Math\.max/);
  assert.equal(
    (admin.match(/valorConsultaAdicionalCentavos:\s*0/g) ?? []).length,
    2,
  );
});

test("fluxo legado de imovel.service não está ligado às rotas", () => {
  const routes = readSource("src/modules/imoveis/imovel.routes.ts");

  assert.match(routes, /busca-previa\.controller\.js/);
  assert.doesNotMatch(
    routes,
    /preverBuscaProprietarios|criarTarefaBuscaProprietarios|buscarProprietariosController/,
  );
});
