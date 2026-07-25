import { z } from "zod";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida. Use YYYY-MM-DD.");

export const faturaIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const listarFaturasQuerySchema = z.object({
  clienteId: z.string().uuid().optional(),
  status: z
    .enum(["ABERTA", "FECHADA", "PAGA", "VENCIDA", "CANCELADA"])
    .optional(),
  referenciaMes: z.coerce.number().int().min(1).max(12).optional(),
  referenciaAno: z.coerce.number().int().min(2024).max(2100).optional(),
});

export const gerarFaturaSchema = z.object({
  clienteId: z.string().uuid("Cliente inválido"),
  referenciaMes: z.coerce.number().int().min(1).max(12),
  referenciaAno: z.coerce.number().int().min(2024).max(2100),
  vencimentoEm: dateOnlySchema.optional().nullable(),
  observacao: z.string().optional().nullable(),
});

export type ListarFaturasQuery = z.infer<typeof listarFaturasQuerySchema>;
export type GerarFaturaInput = z.infer<typeof gerarFaturaSchema>;
