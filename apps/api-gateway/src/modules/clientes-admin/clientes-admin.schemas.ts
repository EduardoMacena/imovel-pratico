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
