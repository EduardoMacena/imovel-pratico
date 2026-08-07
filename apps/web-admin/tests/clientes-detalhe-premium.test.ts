import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const detailPath = new URL(
  "../src/app/clientes/[id]/page.tsx",
  import.meta.url,
);
const stylesPath = new URL(
  "../src/app/clientes/[id]/page.styles.ts",
  import.meta.url,
);

const detailExists = existsSync(detailPath);
const stylesExist = existsSync(stylesPath);
const detail = detailExists ? read("../src/app/clientes/[id]/page.tsx") : "";
const styles = stylesExist
  ? read("../src/app/clientes/[id]/page.styles.ts")
  : "";

const list = read("../src/app/clientes/page.tsx");
const types = read("../src/features/admin/types.ts");
const service = read(
  "../../api-gateway/src/modules/admin/admin.service.ts",
);

test("cria rota dedicada premium do cliente", () => {
  assert.equal(detailExists, true);
  assert.equal(stylesExist, true);
  assert.match(detail, /useRequireSuperAdmin/);
  assert.match(detail, /<AppHeader/);
  assert.match(detail, /Visão 360º do cliente/);
});

test("carrega resumo, consumo e agents em paralelo", () => {
  assert.match(detail, /buscarCliente/);
  assert.match(detail, /buscarConsumoCliente/);
  assert.match(detail, /listarWorkerAgentsCliente/);
  assert.match(detail, /Promise\.all/);
  assert.match(detail, /ClientConsumptionCard/);
});

test("vira hub para as áreas operacionais do cliente", () => {
  assert.match(detail, /\/editar/);
  assert.match(detail, /\/usuarios/);
  assert.match(detail, /\/tarefas/);
  assert.match(detail, /\/instalador/);
  assert.match(detail, /href="\/financeiro"/);
});

test("usa grupos expansíveis acessíveis para dados extensos", () => {
  assert.match(detail, /aria-expanded=\{isOpen\}/);
  assert.match(detail, /Identidade empresarial/);
  assert.match(detail, /Endereço comercial/);
  assert.match(detail, /Operação e processamento/);
  assert.match(styles, /focus-visible/);
});

test("GET administrativo entrega resumo completo para detalhe", () => {
  assert.match(service, /municipios:\s*\{/);
  assert.match(
    service,
    /municipio:\s*\{\s*status:\s*"ATIVO",?\s*\}/s,
  );
  assert.match(
    service,
    /limiteMensalConsultas:\s*cliente\.limiteMensalConsultas/,
  );
  assert.match(service, /pagamentoStatus:\s*cliente\.pagamentoStatus/);
  assert.match(
    service,
    /pagamentoVenceEm:\s*formatDateOnlyFromDate\(cliente\.pagamentoVenceEm\)/,
  );
  assert.match(
    service,
    /municipioPrincipal:\s*cliente\.municipios\[0\]\?\.municipio\s*\?\?\s*null/,
  );
});

test("contrato diferencia detalhe da listagem", () => {
  assert.match(types, /export type ClienteDetalheResumo = ClienteResumo &/);
  assert.match(types, /limiteMensalConsultas:\s*number/);
  assert.match(types, /municipioPrincipal:\s*MunicipioElegivel \| null/);
  assert.match(
    types,
    /export type BuscarClienteResponse = \{\s*cliente: ClienteDetalheResumo;/s,
  );
});

test("lista principal oferece acesso ao novo hub", () => {
  assert.match(
    list,
    /href=\{`\/clientes\/\$\{cliente\.id\}`\}/,
  );
  assert.match(list, />\s*Visão geral\s*</);
});

test("não antecipa histórico administrativo do C2B-3C", () => {
  assert.doesNotMatch(detail, /AuditoriaAdministrativa/);
  assert.doesNotMatch(detail, /Histórico administrativo/);
  assert.doesNotMatch(detail, /historico administrativo/i);
});
