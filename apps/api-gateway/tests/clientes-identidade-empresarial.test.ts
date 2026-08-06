import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  atualizarClienteOnboardingSchema,
  criarClienteOnboardingSchema,
} from "../src/modules/clientes-admin/clientes-admin.schemas.js";

const planoId = "00000000-0000-4000-8000-000000000001";
const municipioId = "00000000-0000-4000-8000-000000000002";

function read(relativeUrl: string) {
  return readFileSync(new URL(relativeUrl, import.meta.url), "utf8");
}

test("normaliza a identidade empresarial no onboarding", () => {
  const result = criarClienteOnboardingSchema.parse({
    nome: "Imobiliária Horizonte",
    cnpj: "04.252.011/0001-10",
    razaoSocial: "  Horizonte Negócios Imobiliários Ltda.  ",
    nomeFantasia: "  Imobiliária Horizonte  ",
    emailComercial: "  CONTATO@HORIZONTE.COM.BR ",
    telefoneComercial: "(43) 99999-1234",
    enderecoCep: "86.870-000",
    enderecoLogradouro: "  Avenida Brasil  ",
    enderecoNumero: "  1500 ",
    enderecoComplemento: "  Sala 4  ",
    enderecoBairro: "  Centro  ",
    enderecoCidade: "  Ivaiporã  ",
    enderecoUf: "pr",
    planoId,
    municipioId,
    administradorInicial: {
      nome: "Administrador",
      email: "admin@example.com",
      senha: "senha-segura",
    },
  });

  assert.equal(result.cnpj, "04252011000110");
  assert.equal(result.razaoSocial, "Horizonte Negócios Imobiliários Ltda.");
  assert.equal(result.nomeFantasia, "Imobiliária Horizonte");
  assert.equal(result.emailComercial, "contato@horizonte.com.br");
  assert.equal(result.telefoneComercial, "43999991234");
  assert.equal(result.enderecoCep, "86870000");
  assert.equal(result.enderecoLogradouro, "Avenida Brasil");
  assert.equal(result.enderecoNumero, "1500");
  assert.equal(result.enderecoComplemento, "Sala 4");
  assert.equal(result.enderecoBairro, "Centro");
  assert.equal(result.enderecoCidade, "Ivaiporã");
  assert.equal(result.enderecoUf, "PR");
});

test("normaliza e valida CNPJ alfanumérico conforme a regra oficial", () => {
  const result = criarClienteOnboardingSchema.parse({
    nome: "Imobiliária Alfanumérica",
    cnpj: "12.abc.345/01de-35",
    planoId,
    municipioId,
    administradorInicial: {
      nome: "Administrador",
      email: "alfa@example.com",
      senha: "senha-segura",
    },
  });

  assert.equal(result.cnpj, "12ABC34501DE35");

  assert.throws(() =>
    criarClienteOnboardingSchema.parse({
      nome: "Imobiliária Alfanumérica",
      cnpj: "12.ABC.345/01DE-36",
      planoId,
      municipioId,
      administradorInicial: {
        nome: "Administrador",
        email: "alfa-invalido@example.com",
        senha: "senha-segura",
      },
    }),
  );
});

test("rejeita CNPJ inválido", () => {
  assert.throws(() =>
    criarClienteOnboardingSchema.parse({
      nome: "Imobiliária Horizonte",
      cnpj: "04.252.011/0001-11",
      planoId,
      municipioId,
      administradorInicial: {
        nome: "Administrador",
        email: "admin@example.com",
        senha: "senha-segura",
      },
    }),
  );

  assert.throws(() =>
    criarClienteOnboardingSchema.parse({
      nome: "Imobiliária Horizonte",
      cnpj: "11.111.111/1111-11",
      planoId,
      municipioId,
      administradorInicial: {
        nome: "Administrador",
        email: "admin@example.com",
        senha: "senha-segura",
      },
    }),
  );
});

test("permite limpar campos empresariais na atualização", () => {
  const result = atualizarClienteOnboardingSchema.parse({
    cnpj: null,
    nomeFantasia: "   ",
    emailComercial: null,
    enderecoComplemento: "",
  });

  assert.equal(result.cnpj, null);
  assert.equal(result.nomeFantasia, null);
  assert.equal(result.emailComercial, null);
  assert.equal(result.enderecoComplemento, null);
});

test("mantém os campos opcionais para clientes existentes", () => {
  const result = criarClienteOnboardingSchema.parse({
    nome: "Cliente legado compatível",
    planoId,
    municipioId,
    administradorInicial: {
      nome: "Administrador",
      email: "legado@example.com",
      senha: "senha-segura",
    },
  });

  assert.equal(result.cnpj, undefined);
  assert.equal(result.razaoSocial, undefined);
  assert.equal(result.enderecoCep, undefined);
});

test("persiste a fundação empresarial no modelo e na migration", () => {
  const schema = read("../../../packages/database/prisma/schema.prisma");
  const migration = read(
    "../../../packages/database/prisma/migrations/20260806150000_adicionar_identidade_empresarial_cliente/migration.sql",
  );

  assert.match(
    schema,
    /cnpj\s+String\?\s+@unique\(map:\s*"clientes_cnpj_key"\)/,
  );
  assert.match(schema, /razaoSocial\s+String\?/);
  assert.match(schema, /nomeFantasia\s+String\?/);
  assert.match(schema, /emailComercial\s+String\?/);
  assert.match(schema, /telefoneComercial\s+String\?/);
  assert.match(schema, /enderecoCep\s+String\?/);
  assert.match(schema, /enderecoLogradouro\s+String\?/);
  assert.match(schema, /enderecoNumero\s+String\?/);
  assert.match(schema, /enderecoComplemento\s+String\?/);
  assert.match(schema, /enderecoBairro\s+String\?/);
  assert.match(schema, /enderecoCidade\s+String\?/);
  assert.match(schema, /enderecoUf\s+String\?/);

  assert.match(migration, /ADD COLUMN "cnpj" TEXT/);
  assert.match(
    migration,
    /CREATE UNIQUE INDEX "clientes_cnpj_key" ON "clientes"\("cnpj"\)/,
  );
  assert.doesNotMatch(migration, /NOT NULL/);
});

test("mapeia CNPJ duplicado e inclui os campos na criação e atualização", () => {
  const errors = read("../src/modules/clientes-admin/clientes-admin.errors.ts");
  const service = read(
    "../src/modules/clientes-admin/clientes-admin.service.ts",
  );

  assert.match(errors, /CNPJ_CLIENTE_DUPLICADO/);
  assert.match(service, /CNPJ_CLIENTE_DUPLICADO/);
  assert.match(service, /cnpj:\s*data\.cnpj/);
  assert.match(service, /razaoSocial:\s*data\.razaoSocial/);
  assert.match(service, /nomeFantasia:\s*data\.nomeFantasia/);
  assert.match(service, /emailComercial:\s*data\.emailComercial/);
  assert.match(service, /telefoneComercial:\s*data\.telefoneComercial/);
  assert.match(service, /enderecoCep:\s*data\.enderecoCep/);
  assert.match(service, /enderecoUf:\s*data\.enderecoUf/);
  assert.match(service, /cnpj:\s*cliente\.cnpj/);
  assert.match(service, /enderecoCidade:\s*cliente\.enderecoCidade/);
});
