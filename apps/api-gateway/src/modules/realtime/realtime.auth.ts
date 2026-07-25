import { jwtVerify } from "jose";
import { prisma } from "@imovel-pratico/database";

type RealtimeAuthPayload = {
  clienteId: string;
  usuarioId: string | null;
};

function getJwtSecret() {
  const secret =
    process.env.JWT_SECRET ??
    process.env.ACCESS_TOKEN_SECRET ??
    process.env.JWT_ACCESS_SECRET ??
    process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado para WebSocket");
  }

  return new TextEncoder().encode(secret);
}

function getStringPayloadValue(payload: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = payload[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

export async function autenticarRealtimeToken(
  token: string | undefined
): Promise<RealtimeAuthPayload> {
  if (!token) {
    throw new Error("Token não informado");
  }

  const { payload } = await jwtVerify(token, getJwtSecret());

  const payloadRecord = payload as Record<string, unknown>;

  const clienteIdDireto = getStringPayloadValue(payloadRecord, [
    "clienteId",
    "clientId",
    "tenantId",
  ]);

  const usuarioId =
    getStringPayloadValue(payloadRecord, [
      "usuarioId",
      "userId",
      "id",
      "sub",
    ]) ?? null;

  if (clienteIdDireto) {
    return {
      clienteId: clienteIdDireto,
      usuarioId,
    };
  }

  if (usuarioId) {
    const prismaAny = prisma as unknown as {
      usuario?: {
        findUnique: (args: unknown) => Promise<{
          id: string;
          clienteId?: string | null;
        } | null>;
      };
      user?: {
        findUnique: (args: unknown) => Promise<{
          id: string;
          clienteId?: string | null;
        } | null>;
      };
    };

    const usuarioModel = prismaAny.usuario ?? prismaAny.user;

    if (usuarioModel) {
      const usuario = await usuarioModel.findUnique({
        where: {
          id: usuarioId,
        },
        select: {
          id: true,
          clienteId: true,
        },
      });

      if (usuario?.clienteId) {
        return {
          clienteId: usuario.clienteId,
          usuarioId,
        };
      }
    }
  }

  throw new Error("Token sem clienteId para WebSocket");
}
