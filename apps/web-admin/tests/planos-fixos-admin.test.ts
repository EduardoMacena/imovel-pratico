import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const types = read("../src/features/admin/types.ts");
const plans = read("../src/app/planos/page.tsx");
const newPlan = read("../src/app/planos/novo/page.tsx");
const editPlan = read("../src/app/planos/[id]/editar/page.tsx");
const finance = read("../src/app/financeiro/page.tsx");
const newInvoice = read("../src/app/financeiro/nova/page.tsx");
const consumption = read("../src/components/ClientConsumptionCard/index.tsx");

const activeSources = [
  types,
  plans,
  newPlan,
  editPlan,
  finance,
  newInvoice,
  consumption,
].join("\n");

test("remove campos públicos de cobrança variável", () => {
  assert.doesNotMatch(types, /valorConsultaAdicionalCentavos/);
  assert.doesNotMatch(types, /consultasExcedentes/);
  assert.doesNotMatch(types, /valorExcedenteCentavos/);
  assert.doesNotMatch(types, /totalEstimadoCentavos/);
  assert.doesNotMatch(types, /CONSULTA_EXCEDENTE/);
  assert.match(types, /"MENSALIDADE"/);
  assert.match(types, /"AJUSTE"/);
});

test("mantém planos somente com mensalidade e limite", () => {
  assert.match(plans, /valores fixos/);
  assert.match(newPlan, /Mensalidade fixa/);
  assert.match(newPlan, /Preço fixo/);
  assert.match(newPlan, /novas buscas ficam bloqueadas/);
  assert.doesNotMatch(
    [plans, newPlan, editPlan].join("\n"),
    /valorConsultaAdicional|Valor da consulta adicional|excedente/i,
  );
});

test("remove métricas ativas de excedente do financeiro", () => {
  assert.match(finance, /mensalidades fixas/);
  assert.doesNotMatch(
    [finance, newInvoice].join("\n"),
    /totalExcedente|valorExcedenteCentavos|consultasExcedentes|Excedente faturado|consumo excedente/i,
  );
  assert.match(newInvoice, /mensalidade fixa do plano/);
});

test("apresenta consumo somente por plano e saldo", () => {
  assert.doesNotMatch(
    consumption,
    /Consulta adicional|Excedentes|Valor excedente|Total estimado|valorConsultaAdicionalCentavos|consultasExcedentes|valorExcedenteCentavos|totalEstimadoCentavos/,
  );
  assert.match(consumption, /consultasRestantes/);
  assert.match(consumption, /consultasUsadas/);
  assert.match(consumption, /limiteMensal/);

  const compactBlocks = consumption.match(/\{!compact && \(/g) ?? [];

  assert.equal(compactBlocks.length, 7);
  assert.doesNotMatch(consumption, /\{!compact && \(\s*\)\}/m);
});

test("não mantém linguagem operacional de excedente", () => {
  assert.doesNotMatch(
    activeSources,
    /autorizar excedente|cobrança adicional|consulta adicional|consumo excedente|excedente faturado/i,
  );
});
