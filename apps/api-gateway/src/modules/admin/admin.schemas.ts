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

export const criarClienteSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  slug: z.string().min(2).optional(),
  workerUrl: z.string().url("URL inválida").optional().nullable(),
  intervaloSegundos: z.coerce.number().min(5).max(300).default(30),
  limiteDiario: z.coerce.number().min(1).default(300),
});

export const atualizarClienteSchema = z.object({
  nome: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  status: z.enum(["ATIVO", "INATIVO", "SUSPENSO"]).optional(),
  workerUrl: z.string().url("URL inválida").optional().nullable(),
  intervaloSegundos: z.coerce.number().min(5).max(300).optional(),
  limiteDiario: z.coerce.number().min(1).optional(),
});

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
  role: z.enum(["ADMIN", "GERENTE", "OPERADOR"]).default("OPERADOR"),
  ativo: z.boolean().default(true),
});

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email("E-mail inválido").optional(),
  senha: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres").optional(),
  role: z.enum(["ADMIN", "GERENTE", "OPERADOR"]).optional(),
  ativo: z.boolean().optional(),
});

export type CriarClienteInput = z.infer<typeof criarClienteSchema>;
export type AtualizarClienteInput = z.infer<typeof atualizarClienteSchema>;
export type CriarUsuarioInput = z.infer<typeof criarUsuarioSchema>;
export type AtualizarUsuarioInput = z.infer<typeof atualizarUsuarioSchema>;
