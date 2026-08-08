import { z } from "zod";

const dataAuditoriaSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve usar YYYY-MM-DD");

export const auditoriaClienteParamsSchema = z.object({
  id: z.string().uuid("Cliente inválido"),
});

export const listarAuditoriaAdministrativaQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(25),
    acao: z.string().trim().min(1).max(100).optional(),
    executor: z.string().trim().min(1).max(254).optional(),
    dataInicio: dataAuditoriaSchema.optional(),
    dataFim: dataAuditoriaSchema.optional(),
  })
  .refine(
    (query) =>
      !query.dataInicio ||
      !query.dataFim ||
      query.dataInicio <= query.dataFim,
    {
      message: "Data inicial não pode ser posterior à data final",
      path: ["dataFim"],
    },
  );

export type ListarAuditoriaAdministrativaQuery = z.infer<
  typeof listarAuditoriaAdministrativaQuerySchema
>;
