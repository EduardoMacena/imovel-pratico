import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

export const trocarMinhaSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
    novaSenha: z
      .string()
      .min(6, "Nova senha precisa ter pelo menos 6 caracteres"),
    confirmarNovaSenha: z
      .string()
      .min(6, "Confirmação de senha precisa ter pelo menos 6 caracteres"),
  })
  .refine(data => data.novaSenha === data.confirmarNovaSenha, {
    message: "As senhas não conferem",
    path: ["confirmarNovaSenha"],
  })
  .refine(data => data.senhaAtual !== data.novaSenha, {
    message: "A nova senha precisa ser diferente da senha atual",
    path: ["novaSenha"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type TrocarMinhaSenhaInput = z.infer<typeof trocarMinhaSenhaSchema>;