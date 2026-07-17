import { z } from "zod";

export const workerHeartbeatSchema = z.object({
  versao: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const workerJobParamsSchema = z.object({
  id: z.string().uuid(),
});

export const workerClaimSchema = z.object({
  capacidade: z.number().int().min(1).max(10).optional(),
});

export const workerRegistroSuccessSchema = z.object({
  registros: z.array(
    z.object({
      indiceCadastral: z.string().min(1),
      complemento: z.string().nullable().optional(),
    })
  ),
});

export const workerProgressSchema = z.object({
  status: z.string().optional(),
  total: z.number().int().min(0).optional(),
  current: z.number().int().min(0).optional(),
  item: z
    .object({
      status: z.enum(["success", "error"]),
      logradouro: z.string(),
      numero: z.string(),
      imovel: z.string().nullable().optional(),
      indiceCadastral: z.string(),
      proprietario: z
        .object({
          nome: z.string().nullable().optional(),
          cpf: z.string().nullable().optional(),
          endereco: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      telefone: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      fonteContato: z.string().nullable().optional(),
      dadosContato: z.record(z.string(), z.unknown()).nullable().optional(),
      error: z.string().nullable().optional(),
      fromCache: z.boolean().optional(),
    })
    .optional(),
});

export const workerErrorSchema = z.object({
  message: z.string().min(1),
  stack: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
