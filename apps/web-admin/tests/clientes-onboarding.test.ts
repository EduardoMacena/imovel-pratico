import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const api = read("../src/features/admin/api.ts");
const types = read("../src/features/admin/types.ts");
const list = read("../src/app/clientes/page.tsx");
const onboarding = read("../src/app/clientes/novo/page.tsx");
const styles = read("../src/app/clientes/novo/page.styles.ts");

test("registra os endpoints e tipos do onboarding", () => {
  assert.match(api, /\/admin\/municipios/);
  assert.match(api, /\/admin\/clientes\/onboarding/);
  assert.match(types, /type MunicipioElegivel/);
  assert.match(types, /type CriarClienteOnboardingRequest/);
  assert.match(types, /administradorInicial/);
  assert.match(types, /avisoEmail/);
});

test("substitui a criação lateral por rota dedicada", () => {
  assert.match(list, /href="\/clientes\/novo"/);
  assert.doesNotMatch(list, /handleCriarCliente/);
  assert.doesNotMatch(list, /criarCliente\(/);
  assert.doesNotMatch(list, /<Form/);
});

test("implementa as cinco etapas com guard de super admin", () => {
  assert.match(onboarding, /useRequireSuperAdmin/);
  assert.match(onboarding, /Identificação e operação/);
  assert.match(onboarding, /Plano fixo e pagamento/);
  assert.match(onboarding, /Município principal/);
  assert.match(onboarding, /Administrador inicial/);
  assert.match(onboarding, /Revisão e confirmação/);
  assert.match(onboarding, /aria-current=\{active \? "step"/);
});

test("protege senha e impede envio duplicado", () => {
  assert.match(onboarding, /type="password"/);
  assert.match(onboarding, /autoComplete="new-password"/);
  assert.match(onboarding, /useRef\(false\)/);
  assert.match(onboarding, /submissionLockRef\.current/);
  assert.match(onboarding, /submissionLockRef\.current = false/);
  assert.match(onboarding, /disabled=\{isSubmitting\}/);
  assert.doesNotMatch(onboarding, /console\.(log|info|warn|error)/);
});

test("não apresenta cobrança adicional no novo recorte", () => {
  assert.doesNotMatch(onboarding, /excedente/i);
  assert.doesNotMatch(list, /excedente/i);
  assert.doesNotMatch(onboarding, /valorConsultaAdicional/i);
});

test("possui estados e layout responsivo", () => {
  assert.match(onboarding, /isLoading/);
  assert.match(onboarding, /resultado/);
  assert.match(onboarding, /avisoEmail/);
  assert.match(onboarding, /role="alert"/);
  assert.match(styles, /@media \(max-width: 720px\)/);
  assert.match(styles, /Success/);
});
