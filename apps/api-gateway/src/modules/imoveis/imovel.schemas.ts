import { z } from "zod";

export const buscarProprietariosSchema = z.object({
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  forceRefresh: z.boolean().optional().default(false),
});

export type BuscarProprietariosInput = z.infer<
  typeof buscarProprietariosSchema
>;
