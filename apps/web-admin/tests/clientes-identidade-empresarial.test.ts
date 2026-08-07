import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const types = read("../src/features/admin/types.ts");
const api = read("../src/features/admin/api.ts");
const onboarding = read("../src/app/clientes/novo/page.tsx");
const onboardingStyles = read("../src/app/clientes/novo/page.styles.ts");
const edit = read("../src/app/clientes/[id]/editar/page.tsx");
const adminService = read(
  "../../api-gateway/src/modules/admin/admin.service.ts",
);

const identityFields = [
  "cnpj",
  "razaoSocial",
  "nomeFantasia",
  "emailComercial",
  "telefoneComercial",
  "enderecoCep",
  "enderecoLogradouro",
  "enderecoNumero",
  "enderecoComplemento",
  "enderecoBairro",
  "enderecoCidade",
  "enderecoUf",
] as const;

test("expõe identidade empresarial nos contratos web", () => {
  for (const field of identityFields) {
    assert.match(types, new RegExp(`\\b${field}\\b`));
  }

  assert.match(types, /type ClienteResumo/);
  assert.match(types, /type CriarClienteOnboardingRequest/);
  assert.match(types, /type ClienteOnboardingResumo/);
  assert.match(types, /type AtualizarClienteRequest/);
});

test("edição usa o endpoint transacional e auditado", () => {
  assert.match(api, /`\/admin\/clientes\/\$\{clienteId\}\/onboarding`/);

  const atualizar = api.slice(
    api.indexOf("export function atualizarCliente"),
    api.indexOf("export function buscarUsuario"),
  );

  assert.doesNotMatch(atualizar, /`\/admin\/clientes\/\$\{clienteId\}`,\s*\{/);
});

test("leitura legada devolve identidade empresarial", () => {
  const listar = adminService.slice(
    adminService.indexOf("export async function listarClientes"),
    adminService.indexOf("export async function criarCliente"),
  );

  const buscar = adminService.slice(
    adminService.indexOf("export async function buscarClientePorId"),
    adminService.indexOf("export async function buscarUsuarioPorId"),
  );

  for (const field of identityFields) {
    assert.match(listar, new RegExp(`${field}:\\s*cliente\\.${field}`));
    assert.match(buscar, new RegExp(`${field}:\\s*cliente\\.${field}`));
  }
});

test("onboarding coleta e envia identidade empresarial", () => {
  for (const label of [
    "CNPJ",
    "Razão social",
    "Nome fantasia",
    "E-mail comercial",
    "Telefone comercial",
    "CEP",
    "Logradouro",
    "Número",
    "Complemento",
    "Bairro",
    "Cidade",
    "UF",
  ]) {
    assert.match(onboarding, new RegExp(`label="${label}"`));
  }

  for (const field of identityFields) {
    assert.match(onboarding, new RegExp(`${field}:\\s*valorNullable`));
  }

  assert.match(onboarding, /Já existe um cliente com esse CNPJ/);
  assert.match(onboardingStyles, /FormSectionTitle/);
});

test("edição carrega e salva identidade pelo fluxo auditado", () => {
  for (const field of identityFields) {
    assert.match(edit, new RegExp(`cliente\\.${field}`));
    assert.match(edit, new RegExp(`${field}:\\s*valorNullable`));
  }

  assert.match(edit, /Identidade empresarial/);
  assert.match(edit, /Endereço comercial/);
  assert.doesNotMatch(edit, /intervaloSegundos:\s*Number/);
  assert.match(edit, /Intervalo entre consultas \(definido pelo plano\)/);
});

test("formatação visual não replica validação de domínio", () => {
  const formatters = read("../src/features/admin/clientes-formatters.ts");

  assert.match(formatters, /export function formatarCnpj/);
  assert.match(formatters, /export function formatarTelefone/);
  assert.match(formatters, /export function formatarCep/);
  assert.match(formatters, /export function formatarUf/);
  assert.match(formatters, /export function valorNullable/);
  assert.doesNotMatch(
    formatters,
    /isValidCnpj|modulo|módulo|dígito verificador|digito verificador/i,
  );
});

test("mantém histórico administrativo fora do C2B-3A", () => {
  assert.doesNotMatch(api, /auditoriaAdministrativa|\/auditoria/i);
});
