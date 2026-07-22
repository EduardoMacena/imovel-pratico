import { z } from "zod";

export const workerBuscarContatoPorCpfSchema = z.object({
	cpf: z.string().min(11).max(18),
});