import { z } from "zod";

export const clienteIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const clienteUsuariosParamsSchema = z.object({
  clienteId: z.string().uuid(),
});

export const usuarioIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const planoIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const criarClienteSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  slug: z.string().min(2).optional(),
  workerUrl: z.string().url("URL inválida").optional().nullable(),
  modoProcessamento: z.enum(["QUEUE", "AGENT"]).default("AGENT"),

  intervaloSegundos: z.coerce
    .number()
    .min(1, "Intervalo mínimo é de 1 segundo")
    .max(300)
    .default(60),

  limiteDiario: z.coerce.number().min(1).default(300),

  planoId: z.string().uuid("Plano inválido"),
});

export const atualizarClienteSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório").optional(),
  slug: z.string().min(2).optional(),

  status: z.enum(["ATIVO", "INATIVO", "SUSPENSO"]).optional(),
  modoProcessamento: z.enum(["QUEUE", "AGENT"]).optional(),

  workerUrl: z.string().url("URL inválida").optional().nullable(),

  intervaloSegundos: z.coerce
    .number()
    .min(1, "Intervalo mínimo é de 1 segundo")
    .max(300)
    .optional(),

  limiteDiario: z.coerce.number().min(1).optional(),

  planoId: z.string().uuid("Plano inválido").optional(),
});

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),

  role: z.enum(["ADMIN", "GERENTE", "OPERADOR"]),

  ativo: z.boolean().default(true),
  precisaTrocarSenha: z.boolean().default(true),
});

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório").optional(),
  email: z.string().email("E-mail inválido").optional(),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),

  role: z.enum(["ADMIN", "GERENTE", "OPERADOR"]).optional(),

  ativo: z.boolean().optional(),
  precisaTrocarSenha: z.boolean().optional(),
});

export const criarPlanoSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  slug: z.string().min(2).optional(),
  descricao: z.string().optional().nullable(),

  limiteMensalConsultas: z.coerce.number().min(1),

  valorConsultaAdicionalCentavos: z.coerce.number().min(0).default(0),

  limiteCorretores: z.coerce.number().min(1).optional().nullable(),

  intervaloSegundos: z.coerce
    .number()
    .min(1, "Intervalo mínimo é de 1 segundo")
    .max(300),

  precoCentavos: z.coerce.number().min(0).default(0),

  status: z.enum(["ATIVO", "INATIVO"]).default("ATIVO"),
});

export const atualizarPlanoSchema = z.object({
  nome: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  descricao: z.string().optional().nullable(),

  limiteMensalConsultas: z.coerce.number().min(1).optional(),

  valorConsultaAdicionalCentavos: z.coerce.number().min(0).optional(),

  limiteCorretores: z.coerce.number().min(1).optional().nullable(),

  intervaloSegundos: z.coerce
    .number()
    .min(1, "Intervalo mínimo é de 1 segundo")
    .max(300)
    .optional(),

  precoCentavos: z.coerce.number().min(0).optional(),

  status: z.enum(["ATIVO", "INATIVO"]).optional(),
});

export const workerAgentIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const criarWorkerAgentSchema = z.object({
  tipo: z.enum(["REGISTRO", "CND"]),
  identificador: z.string().min(2, "Identificador é obrigatório"),
});

export type CriarClienteInput = z.infer<typeof criarClienteSchema>;
export type AtualizarClienteInput = z.infer<typeof atualizarClienteSchema>;

export type CriarUsuarioInput = z.infer<typeof criarUsuarioSchema>;
export type AtualizarUsuarioInput = z.infer<typeof atualizarUsuarioSchema>;

export type CriarPlanoInput = z.infer<typeof criarPlanoSchema>;
export type AtualizarPlanoInput = z.infer<typeof atualizarPlanoSchema>;

export type CriarWorkerAgentInput = z.infer<typeof criarWorkerAgentSchema>;