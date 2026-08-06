import { z } from "zod";

function isValidDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizarSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizarTextoOpcional(value: unknown) {
  if (typeof value !== "string") return value;

  const normalizado = value.trim();
  return normalizado || null;
}

function normalizarDigitosOpcionais(value: unknown) {
  if (typeof value !== "string") return value;

  const normalizado = value.replace(/\D/g, "");
  return normalizado || null;
}

function normalizarCnpjOpcional(value: unknown) {
  if (typeof value !== "string") return value;

  const normalizado = value
    .trim()
    .toUpperCase()
    .replace(/[.\/\-\s]/g, "");

  return normalizado || null;
}

function normalizarUfOpcional(value: unknown) {
  if (typeof value !== "string") return value;

  const normalizado = value.trim().toUpperCase();
  return normalizado || null;
}

function isValidCnpj(value: string) {
  // Regra oficial do CNPJ alfanumérico:
  // 12 posições A-Z/0-9 + 2 DVs numéricos, com valor ASCII - 48.
  if (!/^[A-Z0-9]{12}\d{2}$/.test(value)) {
    return false;
  }

  const calcularDigito = (base: string, pesos: number[]) => {
    const soma = base
      .split("")
      .reduce(
        (total, caractere, index) =>
          total + (caractere.charCodeAt(0) - 48) * pesos[index],
        0,
      );
    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  };

  const base = value.slice(0, 12);
  const primeiroDigito = calcularDigito(
    base,
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );
  const segundoDigito = calcularDigito(
    `${base}${primeiroDigito}`,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return value === `${base}${primeiroDigito}${segundoDigito}`;
}

function textoEmpresarialSchema(
  mensagemObrigatoria: string,
  tamanhoMaximo: number,
  tamanhoMinimo = 1,
) {
  return z.preprocess(
    normalizarTextoOpcional,
    z
      .string()
      .min(tamanhoMinimo, mensagemObrigatoria)
      .max(tamanhoMaximo, `Máximo de ${tamanhoMaximo} caracteres`)
      .nullable()
      .optional(),
  );
}

const cnpjSchema = z.preprocess(
  normalizarCnpjOpcional,
  z
    .string()
    .regex(
      /^[A-Z0-9]{12}\d{2}$/,
      "CNPJ deve conter 12 posições alfanuméricas e 2 dígitos verificadores",
    )
    .refine(isValidCnpj, "CNPJ inválido")
    .nullable()
    .optional(),
);

const emailComercialSchema = z.preprocess(
  normalizarTextoOpcional,
  z
    .string()
    .email("E-mail comercial inválido")
    .transform((value) => value.toLowerCase())
    .nullable()
    .optional(),
);

const telefoneComercialSchema = z.preprocess(
  normalizarDigitosOpcionais,
  z
    .string()
    .regex(/^\d{10,11}$/, "Telefone comercial deve conter 10 ou 11 dígitos")
    .nullable()
    .optional(),
);

const enderecoCepSchema = z.preprocess(
  normalizarDigitosOpcionais,
  z
    .string()
    .regex(/^\d{8}$/, "CEP deve conter 8 dígitos")
    .nullable()
    .optional(),
);

const enderecoUfSchema = z.preprocess(
  normalizarUfOpcional,
  z
    .string()
    .regex(/^[A-Z]{2}$/, "UF deve conter 2 letras")
    .nullable()
    .optional(),
);

const identidadeEmpresarialFields = {
  cnpj: cnpjSchema,
  razaoSocial: textoEmpresarialSchema(
    "Razão social deve ter no mínimo 2 caracteres",
    200,
    2,
  ),
  nomeFantasia: textoEmpresarialSchema(
    "Nome fantasia deve ter no mínimo 2 caracteres",
    160,
    2,
  ),
  emailComercial: emailComercialSchema,
  telefoneComercial: telefoneComercialSchema,
  enderecoCep: enderecoCepSchema,
  enderecoLogradouro: textoEmpresarialSchema(
    "Logradouro deve ter no mínimo 2 caracteres",
    200,
    2,
  ),
  enderecoNumero: textoEmpresarialSchema("Número do endereço é inválido", 30),
  enderecoComplemento: textoEmpresarialSchema(
    "Complemento do endereço é inválido",
    120,
  ),
  enderecoBairro: textoEmpresarialSchema(
    "Bairro deve ter no mínimo 2 caracteres",
    120,
    2,
  ),
  enderecoCidade: textoEmpresarialSchema(
    "Cidade deve ter no mínimo 2 caracteres",
    120,
    2,
  ),
  enderecoUf: enderecoUfSchema,
};

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato AAAA-MM-DD")
  .refine(isValidDateOnly, "Data de vencimento inválida");

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug deve ter no mínimo 2 caracteres")
  .refine(
    (value) => normalizarSlug(value).length > 0,
    "Slug deve conter letras ou números",
  );

const administradorInicialSchema = z.object({
  nome: z.string().trim().min(2, "Nome do administrador é obrigatório"),
  email: z.string().trim().email("E-mail do administrador inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const clienteOnboardingParamsSchema = z.object({
  id: z.string().uuid("Cliente inválido"),
});

export const criarClienteOnboardingSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  ...identidadeEmpresarialFields,
  slug: slugSchema.optional(),
  status: z.enum(["ATIVO", "INATIVO", "SUSPENSO"]).default("ATIVO"),
  modoProcessamento: z.enum(["QUEUE", "AGENT"]).default("AGENT"),
  workerUrl: z.string().url("URL inválida").optional().nullable(),
  limiteDiario: z.coerce.number().int().min(1).default(300),
  planoId: z.string().uuid("Plano inválido"),
  municipioId: z.string().uuid("Município inválido"),
  pagamentoStatus: z
    .enum(["PAGO", "PENDENTE", "VENCIDO", "CANCELADO"])
    .default("PENDENTE"),
  pagamentoVenceEm: dateOnlySchema.optional().nullable(),
  administradorInicial: administradorInicialSchema,
});

export const atualizarClienteOnboardingSchema = z
  .object({
    nome: z.string().trim().min(2, "Nome é obrigatório").optional(),
    ...identidadeEmpresarialFields,
    slug: slugSchema.optional(),
    status: z.enum(["ATIVO", "INATIVO", "SUSPENSO"]).optional(),
    modoProcessamento: z.enum(["QUEUE", "AGENT"]).optional(),
    workerUrl: z.string().url("URL inválida").optional().nullable(),
    limiteDiario: z.coerce.number().int().min(1).optional(),
    planoId: z.string().uuid("Plano inválido").optional(),
    municipioId: z.string().uuid("Município inválido").optional(),
    pagamentoStatus: z
      .enum(["PAGO", "PENDENTE", "VENCIDO", "CANCELADO"])
      .optional(),
    pagamentoVenceEm: dateOnlySchema.optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização",
  });

export type CriarClienteOnboardingInput = z.infer<
  typeof criarClienteOnboardingSchema
>;
export type AtualizarClienteOnboardingInput = z.infer<
  typeof atualizarClienteOnboardingSchema
>;
