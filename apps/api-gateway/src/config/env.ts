import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    PORT: z.coerce.number().default(3333),

    DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
    REDIS_URL: z.string().min(1, "REDIS_URL é obrigatória"),

    JWT_SECRET: z
      .string()
      .min(16, "JWT_SECRET precisa ter pelo menos 16 caracteres"),

    WEB_CLIENT_URL: z.string().url().default("http://localhost:3001"),

    SMTP_HOST: z.string().default("smtp.hostinger.com"),
    SMTP_PORT: z.coerce.number().default(465),
    SMTP_SECURE: z.coerce.boolean().default(true),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),

    EMAIL_FROM: z.string().optional(),
    EMAIL_REPLY_TO: z.string().email().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && !env.SMTP_USER) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["SMTP_USER"],
        message: "SMTP_USER é obrigatório em produção",
      });
    }

    if (env.NODE_ENV === "production" && !env.SMTP_PASS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["SMTP_PASS"],
        message: "SMTP_PASS é obrigatório em produção",
      });
    }
  });

export const env = envSchema.parse(process.env);