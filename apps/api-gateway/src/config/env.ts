import "dotenv/config";
import { z } from "zod";

const envBoolean = z.preprocess(value => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y", "sim"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "n", "nao", "não"].includes(normalized)) {
      return false;
    }
  }

  return value;
}, z.boolean());

const optionalEmail = z.preprocess(value => {
  if (value === "") {
    return undefined;
  }

  return value;
}, z.string().email().optional());

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

    CORS_ORIGINS: z
      .string()
      .default(
        "http://localhost:3000,http://localhost:3001,http://localhost:3002"
      ),

    TRUST_PROXY: envBoolean.default(false),

    SMTP_HOST: z.string().default("smtp.hostinger.com"),
    SMTP_PORT: z.coerce.number().default(465),
    SMTP_SECURE: envBoolean.default(true),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),

    EMAIL_FROM: z.string().optional(),
    EMAIL_REPLY_TO: optionalEmail,

    RATE_LIMIT_ENABLED: envBoolean.default(true),

    RATE_LIMIT_LOGIN_MAX: z.coerce.number().int().positive().default(5),
    RATE_LIMIT_LOGIN_TIME_WINDOW: z.string().min(1).default("1 minute"),

    RATE_LIMIT_ESQUECI_SENHA_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(3),
    RATE_LIMIT_ESQUECI_SENHA_TIME_WINDOW: z
      .string()
      .min(1)
      .default("15 minutes"),

    RATE_LIMIT_REDEFINIR_SENHA_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(5),
    RATE_LIMIT_REDEFINIR_SENHA_TIME_WINDOW: z
      .string()
      .min(1)
      .default("10 minutes"),

    RATE_LIMIT_TROCAR_SENHA_MAX: z.coerce
      .number()
      .int()
      .positive()
      .default(5),
    RATE_LIMIT_TROCAR_SENHA_TIME_WINDOW: z
      .string()
      .min(1)
      .default("10 minutes"),
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