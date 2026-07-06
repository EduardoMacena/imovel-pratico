import { z } from "zod";

export const buscarProprietariosSchema = z.object({
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  mesAnoInicio: z.string().min(7, "Mês/Ano inicial é obrigatório"),
  mesAnoFinal: z.string().min(7, "Mês/Ano final é obrigatório"),
  intervaloSegundos: z.coerce.number().min(30).max(300).default(30),
  forceRefresh: z.boolean().optional().default(false),
});

export type BuscarProprietariosInput = z.infer<
  typeof buscarProprietariosSchema
>;
