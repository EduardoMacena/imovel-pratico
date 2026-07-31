import { z } from "zod";

export const previaIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const preverBuscaSchema = z.object({
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
});

export const preverBuscaCodigosSchema = z.object({
  codigos: z.union([
    z
      .string()
      .min(1, "Informe ao menos um código cadastral")
      .max(100_000, "Entrada de códigos muito grande"),
    z
      .array(
        z
          .string()
          .min(1, "Código cadastral vazio")
          .max(256, "Código cadastral muito grande"),
      )
      .min(1, "Informe ao menos um código cadastral")
      .max(1000, "Informe no máximo 1000 códigos cadastrais"),
  ]),
});

export const buscarProprietariosSchema = z.object({
  previaId: z.string().uuid("Prévia inválida"),
  forceRefresh: z.boolean().optional().default(false),
});

export type PreverBuscaInput = z.infer<typeof preverBuscaSchema>;

export type PreverBuscaCodigosInput = z.infer<typeof preverBuscaCodigosSchema>;

export type BuscarProprietariosInput = z.infer<
  typeof buscarProprietariosSchema
>;
