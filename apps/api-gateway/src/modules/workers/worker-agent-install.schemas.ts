import { z } from "zod";

export const criarWorkerAgentInstallLinkSchema = z.object({
	identificadorBase: z
		.string()
		.min(2, "Identificador base é obrigatório")
		.max(80, "Identificador base muito longo"),

	incluirRegistro: z.boolean().default(true),
	incluirCnd: z.boolean().default(true),

	expiraEmHoras: z.coerce.number().int().min(1).max(168).default(24),
});

export const ativarWorkerAgentInstallLinkSchema = z.object({
	code: z.string().min(10, "Código de instalação inválido"),

	machineId: z.string().optional(),
	hostname: z.string().optional(),
	platform: z.string().optional(),
	version: z.string().optional(),
});

export type CriarWorkerAgentInstallLinkInput = z.infer<
	typeof criarWorkerAgentInstallLinkSchema
>;

export type AtivarWorkerAgentInstallLinkInput = z.infer<
	typeof ativarWorkerAgentInstallLinkSchema
>;
