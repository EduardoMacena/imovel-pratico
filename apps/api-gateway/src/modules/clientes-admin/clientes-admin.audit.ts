import type { Prisma } from "@imovel-pratico/database";

export type UsuarioRoleAuditoria =
  "SUPER_ADMIN" | "ADMIN" | "GERENTE" | "OPERADOR";
export type AuditoriaAdministrativaContexto = {
  usuarioId: string;
  executorEmail: string;
  executorRole: UsuarioRoleAuditoria;
  requestId: string;
  ipAddress: string;
  userAgent: string | null;
};
export function normalizarRoleAuditoria(value: string): UsuarioRoleAuditoria {
  switch (value) {
    case "SUPER_ADMIN":
    case "ADMIN":
    case "GERENTE":
    case "OPERADOR":
      return value;
    default:
      throw new Error(`Role autenticada inválida: ${value}`);
  }
}
type Fonte = {
  id: string;
  nome: string;
  slug: string;
  status: string;
  cnpj: string | null;
  razaoSocial: string | null;
  nomeFantasia: string | null;
  emailComercial: string | null;
  telefoneComercial: string | null;
  enderecoCep: string | null;
  enderecoLogradouro: string | null;
  enderecoNumero: string | null;
  enderecoComplemento: string | null;
  enderecoBairro: string | null;
  enderecoCidade: string | null;
  enderecoUf: string | null;
  modoProcessamento: string;
  workerUrl: string | null;
  intervaloSegundos: number;
  limiteDiario: number;
  limiteMensalConsultas: number;
  pagamentoStatus: string;
  pagamentoVenceEm: Date | null;
  planoId: string | null;
  municipios: Array<{ municipio: { id: string } }>;
};
export const CAMPOS_AUDITADOS_CRIACAO_CLIENTE = [
  "nome",
  "slug",
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
  "status",
  "modoProcessamento",
  "workerUrl",
  "intervaloSegundos",
  "limiteDiario",
  "limiteMensalConsultas",
  "pagamentoStatus",
  "pagamentoVenceEm",
  "planoId",
  "municipioId",
] as const;
const cnpj = (v: string | null) =>
  v ? `${v.slice(0, 2)}********${v.slice(-2)}` : null;
const email = (v: string | null) => {
  if (!v) return null;
  const [l, d] = v.split("@");
  return l && d ? `${l.slice(0, 1)}***@${d}` : "***";
};
const phone = (v: string | null) => (v ? `*******${v.slice(-4)}` : null);
const cep = (v: string | null) => (v ? `*****${v.slice(-3)}` : null);
export function montarSnapshotClienteAuditoria(
  c: Fonte,
): Prisma.InputJsonObject {
  return {
    id: c.id,
    nome: c.nome,
    slug: c.slug,
    status: c.status,
    cnpj: cnpj(c.cnpj),
    razaoSocial: c.razaoSocial,
    nomeFantasia: c.nomeFantasia,
    emailComercial: email(c.emailComercial),
    telefoneComercial: phone(c.telefoneComercial),
    endereco: {
      cep: cep(c.enderecoCep),
      bairro: c.enderecoBairro,
      cidade: c.enderecoCidade,
      uf: c.enderecoUf,
      logradouroInformado: Boolean(c.enderecoLogradouro),
      numeroInformado: Boolean(c.enderecoNumero),
      complementoInformado: Boolean(c.enderecoComplemento),
    },
    modoProcessamento: c.modoProcessamento,
    workerConfigurado: Boolean(c.workerUrl),
    intervaloSegundos: c.intervaloSegundos,
    limiteDiario: c.limiteDiario,
    limiteMensalConsultas: c.limiteMensalConsultas,
    pagamentoStatus: c.pagamentoStatus,
    pagamentoVenceEm: c.pagamentoVenceEm?.toISOString() ?? null,
    planoId: c.planoId,
    municipioPrincipalId: c.municipios[0]?.municipio.id ?? null,
  };
}
function value(c: Fonte, k: string): unknown {
  if (k === "municipioId") return c.municipios[0]?.municipio.id ?? null;
  if (k === "pagamentoVenceEm")
    return c.pagamentoVenceEm?.toISOString() ?? null;
  return (c as unknown as Record<string, unknown>)[k];
}
export function listarCamposAlteradosCliente(
  keys: string[],
  a: Fonte,
  d: Fonte,
) {
  return [...new Set(keys)]
    .filter(
      (k) =>
        JSON.stringify(value(a, k) ?? null) !==
        JSON.stringify(value(d, k) ?? null),
    )
    .sort();
}
