import { z } from "zod";

export const buscarProprietariosSchema = z.object({
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  forceRefresh: z.boolean().optional().default(false),
  confirmarExcedente: z.boolean().optional().default(false),
  consultasEstimadas: z.coerce.number().int().min(1).optional().default(1),
});

export type BuscarProprietariosInput = z.infer<
  typeof buscarProprietariosSchema
>;
