import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (p: string) =>
  readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");

const schemasPath = new URL(
  "../src/modules/admin/admin-auditoria.schemas.ts",
  import.meta.url,
);
const servicePath = new URL(
  "../src/modules/admin/admin-auditoria.service.ts",
  import.meta.url,
);
const controllerPath = new URL(
  "../src/modules/admin/admin-auditoria.controller.ts",
  import.meta.url,
);

const schemas = existsSync(schemasPath)
  ? read("../src/modules/admin/admin-auditoria.schemas.ts")
  : "";
const service = existsSync(servicePath)
  ? read("../src/modules/admin/admin-auditoria.service.ts")
  : "";
const controller = existsSync(controllerPath)
  ? read("../src/modules/admin/admin-auditoria.controller.ts")
  : "";
const routes = read("../src/modules/admin/admin.routes.ts");
const adminService = read("../src/modules/admin/admin.service.ts");

test("cria módulo dedicado sem crescer admin.service", () => {
  assert.equal(existsSync(schemasPath), true);
  assert.equal(existsSync(servicePath), true);
  assert.equal(existsSync(controllerPath), true);
  assert.doesNotMatch(adminService, /listarAuditoriaAdministrativaCliente/);
});

test("expõe GET de auditoria por cliente no admin", () => {
  assert.match(
    routes,
    /app\.get\(\s*"\/admin\/clientes\/:id\/auditoria",\s*listarAuditoriaAdministrativaClienteController\s*\)/s,
  );
  assert.match(
    routes,
    /from "\.\/admin-auditoria\.controller\.js"/,
  );
});

test("valida paginação e filtros no schema dedicado", () => {
  assert.match(schemas, /page:\s*z\.coerce\.number\(\)\.int\(\)\.min\(1\)\.default\(1\)/);
  assert.match(
    schemas,
    /pageSize:\s*z\.coerce\.number\(\)\.int\(\)\.min\(1\)\.max\(100\)\.default\(25\)/,
  );
  assert.match(schemas, /acao:/);
  assert.match(schemas, /executor:/);
  assert.match(schemas, /dataInicio:/);
  assert.match(schemas, /dataFim:/);
  assert.match(schemas, /\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$/);
});

test("filtra AuditoriaAdministrativa por cliente, ação, executor e período", () => {
  assert.match(service, /Prisma\.AuditoriaAdministrativaWhereInput/);
  assert.match(service, /clienteId/);
  assert.match(service, /where\.acao = filtros\.acao/);
  assert.match(service, /where\.executorEmail = \{/);
  assert.match(service, /contains:\s*filtros\.executor/);
  assert.match(service, /mode:\s*"insensitive"/);
  assert.match(service, /gte:/);
  assert.match(service, /lte:/);
  assert.match(service, /prisma\.auditoriaAdministrativa\.findMany/);
  assert.match(service, /prisma\.auditoriaAdministrativa\.count/);
  assert.doesNotMatch(service, /operacaoEvento/);
});

test("pagina e ordena de forma determinística", () => {
  assert.match(service, /skip:\s*\(page - 1\) \* pageSize/);
  assert.match(service, /take:\s*pageSize/);
  assert.match(service, /createdAt:\s*"desc"/);
  assert.match(service, /id:\s*"desc"/);
  assert.match(service, /totalPages/);
  assert.match(service, /hasNextPage/);
  assert.match(service, /hasPreviousPage/);
});

test("não seleciona contexto interno desnecessário", () => {
  assert.match(service, /select:\s*\{/);
  assert.match(service, /dadosAntes:\s*true/);
  assert.match(service, /dadosDepois:\s*true/);
  assert.match(service, /camposAlterados:\s*true/);
  assert.doesNotMatch(service, /requestId:\s*true/);
  assert.doesNotMatch(service, /ipAddress:\s*true/);
  assert.doesNotMatch(service, /userAgent:\s*true/);
  assert.doesNotMatch(service, /metadata:\s*true/);
});

test("sanitiza snapshots novamente na leitura", () => {
  assert.match(service, /sanitizarSnapshotAuditoriaLeitura/);
  assert.match(service, /SENSITIVE_KEYS/);
  assert.match(service, /MASKED_ADDRESS_KEYS/);
  assert.match(service, /mascararCnpj/);
  assert.match(service, /mascararEmail/);
  assert.match(service, /mascararTelefone/);
  assert.match(service, /mascararCep/);
  assert.match(service, /dadosAntes:\s*sanitizarSnapshotAuditoriaLeitura/);
  assert.match(service, /dadosDepois:\s*sanitizarSnapshotAuditoriaLeitura/);
});

test("controller traduz 404 e resposta paginada", () => {
  assert.match(controller, /auditoriaClienteParamsSchema\.parse\(request\.params\)/);
  assert.match(
    controller,
    /listarAuditoriaAdministrativaQuerySchema\.parse\(\s*request\.query,?\s*\)/s,
  );
  assert.match(controller, /listarAuditoriaAdministrativaCliente/);
  assert.match(controller, /reply\.status\(404\)/);
  assert.match(controller, /reply\.status\(200\)\.send\(result\)/);
});
