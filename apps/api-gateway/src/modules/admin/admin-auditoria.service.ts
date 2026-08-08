import { Prisma, prisma } from "@imovel-pratico/database";
import type { ListarAuditoriaAdministrativaQuery } from "./admin-auditoria.schemas.js";

const SENSITIVE_KEYS =
  /senha|password|hash|token|secret|workerurl|requestid|ipaddress|useragent/i;

const MASKED_ADDRESS_KEYS =
  /enderecologradouro|endereconumero|enderecocomplemento|enderecobairro/i;

function isMasked(value: string) {
  return value.includes("*");
}

function mascararCnpj(value: string) {
  if (isMasked(value)) {
    return value;
  }

  const clean = value.replace(/[^A-Za-z0-9]/g, "");

  if (clean.length < 4) {
    return "***";
  }

  return `${clean.slice(0, 2)}${"*".repeat(Math.max(clean.length - 4, 4))}${clean.slice(-2)}`;
}

function mascararEmail(value: string) {
  if (isMasked(value)) {
    return value;
  }

  const [local, domain] = value.split("@");

  if (!local || !domain) {
    return "***";
  }

  return `${local.slice(0, 1)}***@${domain}`;
}

function mascararTelefone(value: string) {
  if (isMasked(value)) {
    return value;
  }

  const clean = value.replace(/\D/g, "");

  if (clean.length <= 4) {
    return "***";
  }

  return `${"*".repeat(clean.length - 4)}${clean.slice(-4)}`;
}

function mascararCep(value: string) {
  if (isMasked(value)) {
    return value;
  }

  const clean = value.replace(/\D/g, "");

  if (clean.length <= 3) {
    return "***";
  }

  return `${"*".repeat(clean.length - 3)}${clean.slice(-3)}`;
}

function sanitizarCampoEscalar(key: string, value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedKey = key.toLowerCase();

  if (normalizedKey === "cnpj") {
    return mascararCnpj(value);
  }

  if (
    normalizedKey === "email" ||
    normalizedKey === "emailcomercial"
  ) {
    return mascararEmail(value);
  }

  if (
    normalizedKey === "telefone" ||
    normalizedKey === "telefonecomercial"
  ) {
    return mascararTelefone(value);
  }

  if (
    normalizedKey === "cep" ||
    normalizedKey === "enderecocep"
  ) {
    return mascararCep(value);
  }

  return value;
}

export function sanitizarSnapshotAuditoriaLeitura(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizarSnapshotAuditoriaLeitura);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, item] of Object.entries(
    value as Record<string, unknown>,
  )) {
    const normalizedKey = key.toLowerCase();

    if (SENSITIVE_KEYS.test(normalizedKey)) {
      continue;
    }

    if (MASKED_ADDRESS_KEYS.test(normalizedKey)) {
      result[key] = "[REDACTED]";
      continue;
    }

    if (item && typeof item === "object") {
      result[key] = sanitizarSnapshotAuditoriaLeitura(item);
      continue;
    }

    result[key] = sanitizarCampoEscalar(key, item);
  }

  return result;
}

function inicioDiaUtc(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function fimDiaUtc(value: string) {
  return new Date(`${value}T23:59:59.999Z`);
}

export async function listarAuditoriaAdministrativaCliente(
  clienteId: string,
  filtros: ListarAuditoriaAdministrativaQuery,
) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
    select: {
      id: true,
      nome: true,
      slug: true,
    },
  });

  if (!cliente) {
    return null;
  }

  const where: Prisma.AuditoriaAdministrativaWhereInput = {
    clienteId,
  };

  if (filtros.acao) {
    where.acao = filtros.acao;
  }

  if (filtros.executor) {
    where.executorEmail = {
      contains: filtros.executor,
      mode: "insensitive",
    };
  }

  if (filtros.dataInicio || filtros.dataFim) {
    where.createdAt = {
      ...(filtros.dataInicio
        ? { gte: inicioDiaUtc(filtros.dataInicio) }
        : {}),
      ...(filtros.dataFim
        ? { lte: fimDiaUtc(filtros.dataFim) }
        : {}),
    };
  }

  const page = filtros.page;
  const pageSize = filtros.pageSize;

  const [total, auditorias] = await prisma.$transaction([
    prisma.auditoriaAdministrativa.count({
      where,
    }),
    prisma.auditoriaAdministrativa.findMany({
      where,
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        clienteId: true,
        usuarioId: true,
        acao: true,
        entidade: true,
        entidadeId: true,
        mensagem: true,
        executorEmail: true,
        executorRole: true,
        dadosAntes: true,
        dadosDepois: true,
        camposAlterados: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    cliente,
    auditorias: auditorias.map((auditoria) => ({
      id: auditoria.id,
      clienteId: auditoria.clienteId,
      usuarioId: auditoria.usuarioId,
      acao: auditoria.acao,
      entidade: auditoria.entidade,
      entidadeId: auditoria.entidadeId,
      mensagem: auditoria.mensagem,
      executorEmail: auditoria.executorEmail,
      executorRole: auditoria.executorRole,
      dadosAntes: sanitizarSnapshotAuditoriaLeitura(
        auditoria.dadosAntes,
      ),
      dadosDepois: sanitizarSnapshotAuditoriaLeitura(
        auditoria.dadosDepois,
      ),
      camposAlterados: sanitizarSnapshotAuditoriaLeitura(
        auditoria.camposAlterados,
      ),
      createdAt: auditoria.createdAt.toISOString(),
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
