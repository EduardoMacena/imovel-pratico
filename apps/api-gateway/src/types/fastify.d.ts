import type { AuthTokenPayload } from "../modules/auth/auth.service.js";

declare module "fastify" {
  interface FastifyRequest {
    auth: AuthTokenPayload;
  }
}
