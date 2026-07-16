import { z } from "zod";

export const previaIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const preverBuscaSchema = z.object({
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
});

export const buscarProprietariosSchema = z.object({
  previaId: z.string().uuid("Prévia inválida"),
  confirmarExcedente: z.boolean().optional().default(false),
  forceRefresh: z.boolean().optional().default(false),
});

export type PreverBuscaInput = z.infer<typeof preverBuscaSchema>;

export type BuscarProprietariosInput = z.infer<
  typeof buscarProprietariosSchema
>;
