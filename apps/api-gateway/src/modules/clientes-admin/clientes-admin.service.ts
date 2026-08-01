import bcrypt from "bcryptjs";
import { prisma } from "@imovel-pratico/database";
import { env } from "../../config/env.js";
import { enviarEmailBoasVindasUsuario } from "../../services/email.service.js";
import {
  formatDateOnlyFromDate,
  parseDateOnlyToUtcNoon,
} from "../../utils/date-only.js";
import { ClienteAdminError } from "./clientes-admin.errors.js";
import type {
  AtualizarClienteOnboardingInput,
  CriarClienteOnboardingInput,
} from "./clientes-admin.schemas.js";

function gerarSlugBase(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validarSlugNormalizado(value: string) {
  const slug = gerarSlugBase(value);

  if (!slug) {
    throw new ClienteAdminError(
      "O slug deve conter letras ou números",
      "SLUG_CLIENTE_INVALIDO",
      422,
      { slugInformado: value },
    );
  }

  return slug;
}

function normalizarEmail(value: string) {
  return value.trim().toLowerCase();
}

function parsePagamentoVenceEm(value: string | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const parsed = parseDateOnlyToUtcNoon(value);

  if (formatDateOnlyFromDate(parsed) !== value) {
    throw new ClienteAdminError(
      "A data de vencimento informada não existe",
      "PAGAMENTO_VENCIMENTO_INVALIDO",
      422,
      { pagamentoVenceEm: value },
    );
  }

  return parsed;
}

function extrairCamposRestricaoUnica(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== "P2002"
  ) {
    return null;
  }

  const fields = new Set<string>();

  if (
    "meta" in error &&
    typeof error.meta === "object" &&
    error.meta !== null
  ) {
    const meta = error.meta as Record<string, unknown>;

    for (const key of ["target", "constraint"]) {
      const value = meta[key];

      if (Array.isArray(value)) {
        for (const item of value) {
          fields.add(String(item).toLowerCase());
        }
      } else if (typeof value === "string") {
        fields.add(value.toLowerCase());
      }
    }
  }

  const message =
    error instanceof Error ? error.message : JSON.stringify(error);

  for (const match of message.matchAll(/\b(email|slug)\b/gi)) {
    fields.add(match[1].toLowerCase());
  }

  return [...fields];
}

function mapearErroRestricaoUnica(error: unknown) {
  const fields = extrairCamposRestricaoUnica(error);

  if (!fields) return null;

  if (fields.some((field) => field.includes("email"))) {
    return new ClienteAdminError(
      "Já existe um usuário com esse e-mail",
      "EMAIL_USUARIO_DUPLICADO",
      409,
    );
  }

  return new ClienteAdminError(
    "Já existe um cliente com esse slug",
    "SLUG_CLIENTE_DUPLICADO",
    409,
  );
}

const clienteOnboardingInclude = {
  plano: true,
  municipios: {
    where: { ativo: true, principal: true },
    take: 1,
    include: {
      municipio: {
        select: {
          id: true,
          codigoIbge: true,
          nome: true,
          uf: true,
          status: true,
        },
      },
    },
  },
  _count: { select: { usuarios: true, tarefas: true } },
} as const;

function mapearCliente<
  T extends {
    id: string;
    nome: string;
    slug: string;
    status: string;
    modoProcessamento: string;
    workerUrl: string | null;
    intervaloSegundos: number;
    limiteDiario: number;
    limiteMensalConsultas: number;
    pagamentoStatus: string;
    pagamentoVenceEm: Date | null;
    createdAt: Date;
    updatedAt: Date;
    plano: unknown;
    municipios: Array<{
      municipio: {
        id: string;
        codigoIbge: string;
        nome: string;
        uf: string;
        status: string;
      };
    }>;
    _count: { usuarios: number; tarefas: number };
  },
>(cliente: T) {
  return {
    id: cliente.id,
    nome: cliente.nome,
    slug: cliente.slug,
    status: cliente.status,
    modoProcessamento: cliente.modoProcessamento,
    workerUrl: cliente.workerUrl,
    intervaloSegundos: cliente.intervaloSegundos,
    limiteDiario: cliente.limiteDiario,
    limiteMensalConsultas: cliente.limiteMensalConsultas,
    pagamentoStatus: cliente.pagamentoStatus,
    pagamentoVenceEm: formatDateOnlyFromDate(cliente.pagamentoVenceEm),
    plano: cliente.plano,
    municipioPrincipal: cliente.municipios[0]?.municipio ?? null,
    totalUsuarios: cliente._count.usuarios,
    totalTarefas: cliente._count.tarefas,
    createdAt: cliente.createdAt,
    updatedAt: cliente.updatedAt,
  };
}

export async function listarMunicipiosElegiveisParaCliente() {
  return prisma.municipio.findMany({
    where: { status: "ATIVO" },
    orderBy: [{ uf: "asc" }, { nome: "asc" }],
    select: {
      id: true,
      codigoIbge: true,
      nome: true,
      uf: true,
      status: true,
    },
  });
}

export async function criarClienteOnboarding(
  data: CriarClienteOnboardingInput,
) {
  const emailAdministrador = normalizarEmail(data.administradorInicial.email);
  const senhaHash = await bcrypt.hash(data.administradorInicial.senha, 10);
  const pagamentoVenceEm = parsePagamentoVenceEm(data.pagamentoVenceEm);

  let resultado;

  try {
    resultado = await prisma.$transaction(async (tx) => {
      const [plano, municipio, emailExistente] = await Promise.all([
        tx.plano.findUnique({
          where: { id: data.planoId },
          select: {
            id: true,
            status: true,
            limiteMensalConsultas: true,
            intervaloSegundos: true,
          },
        }),
        tx.municipio.findUnique({
          where: { id: data.municipioId },
          select: { id: true, status: true },
        }),
        tx.usuario.findUnique({
          where: { email: emailAdministrador },
          select: { id: true },
        }),
      ]);

      if (!plano) {
        throw new ClienteAdminError(
          "Plano não encontrado",
          "PLANO_NAO_ENCONTRADO",
          404,
        );
      }

      if (plano.status !== "ATIVO") {
        throw new ClienteAdminError(
          "O plano selecionado não está ativo",
          "PLANO_INATIVO",
          409,
          { planoId: plano.id },
        );
      }

      if (!municipio) {
        throw new ClienteAdminError(
          "Município não encontrado",
          "MUNICIPIO_NAO_ENCONTRADO",
          404,
        );
      }

      if (municipio.status !== "ATIVO") {
        throw new ClienteAdminError(
          "O município selecionado ainda não está disponível",
          "MUNICIPIO_INDISPONIVEL",
          409,
          { municipioId: municipio.id },
        );
      }

      if (emailExistente) {
        throw new ClienteAdminError(
          "Já existe um usuário com esse e-mail",
          "EMAIL_USUARIO_DUPLICADO",
          409,
          { email: emailAdministrador },
        );
      }

      const slugBase = validarSlugNormalizado(data.slug || data.nome);
      let slug = slugBase;

      if (data.slug) {
        const slugExistente = await tx.cliente.findUnique({
          where: { slug },
          select: { id: true },
        });

        if (slugExistente) {
          throw new ClienteAdminError(
            "Já existe um cliente com esse slug",
            "SLUG_CLIENTE_DUPLICADO",
            409,
            { slug },
          );
        }
      } else {
        let contador = 1;
        while (
          await tx.cliente.findUnique({
            where: { slug },
            select: { id: true },
          })
        ) {
          contador += 1;
          slug = `${slugBase}-${contador}`;
        }
      }

      return tx.cliente.create({
        data: {
          nome: data.nome,
          slug,
          status: data.status,
          modoProcessamento: data.modoProcessamento,
          workerUrl: data.workerUrl ?? null,
          intervaloSegundos: plano.intervaloSegundos,
          limiteDiario: data.limiteDiario,
          limiteMensalConsultas: plano.limiteMensalConsultas,
          pagamentoStatus: data.pagamentoStatus,
          pagamentoVenceEm,
          planoId: plano.id,
          municipios: {
            create: {
              municipioId: municipio.id,
              ativo: true,
              principal: true,
            },
          },
          usuarios: {
            create: {
              nome: data.administradorInicial.nome,
              email: emailAdministrador,
              senha: senhaHash,
              role: "ADMIN",
              ativo: true,
              precisaTrocarSenha: true,
            },
          },
        },
        include: {
          ...clienteOnboardingInclude,
          usuarios: {
            where: { email: emailAdministrador },
            take: 1,
            select: {
              id: true,
              clienteId: true,
              nome: true,
              email: true,
              role: true,
              ativo: true,
              precisaTrocarSenha: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof ClienteAdminError) throw error;
    const uniqueError = mapearErroRestricaoUnica(error);

    if (uniqueError) throw uniqueError;
    throw error;
  }

  const administradorInicial = resultado.usuarios[0];
  if (!administradorInicial) {
    throw new Error("Administrador inicial não foi retornado após a criação");
  }

  let avisoEmail: {
    code: "EMAIL_BOAS_VINDAS_NAO_ENVIADO";
    message: string;
  } | null = null;

  try {
    await enviarEmailBoasVindasUsuario({
      to: administradorInicial.email,
      nome: administradorInicial.nome,
      clienteNome: resultado.nome,
      senhaTemporaria: data.administradorInicial.senha,
      loginUrl: `${env.WEB_CLIENT_URL}/login`,
    });
  } catch (error) {
    console.error(
      "Falha ao enviar o e-mail de boas-vindas do onboarding:",
      error instanceof Error ? error.message : "erro desconhecido",
    );

    avisoEmail = {
      code: "EMAIL_BOAS_VINDAS_NAO_ENVIADO",
      message:
        "Cliente e administrador foram criados, mas o e-mail de boas-vindas não foi enviado.",
    };
  }

  return {
    cliente: mapearCliente(resultado),
    administradorInicial,
    avisoEmail,
  };
}

export async function atualizarClienteOnboarding(
  id: string,
  data: AtualizarClienteOnboardingInput,
) {
  const pagamentoVenceEm = parsePagamentoVenceEm(data.pagamentoVenceEm);

  try {
    const cliente = await prisma.$transaction(async (tx) => {
      const atual = await tx.cliente.findUnique({
        where: { id },
        include: {
          plano: {
            select: {
              id: true,
              status: true,
              limiteMensalConsultas: true,
              intervaloSegundos: true,
            },
          },
          municipios: {
            where: { ativo: true, principal: true },
            take: 1,
            include: {
              municipio: { select: { id: true, status: true } },
            },
          },
        },
      });

      if (!atual) {
        throw new ClienteAdminError(
          "Cliente não encontrado",
          "CLIENTE_NAO_ENCONTRADO",
          404,
        );
      }

      const plano = data.planoId
        ? await tx.plano.findUnique({
            where: { id: data.planoId },
            select: {
              id: true,
              status: true,
              limiteMensalConsultas: true,
              intervaloSegundos: true,
            },
          })
        : atual.plano;

      if (data.planoId && !plano) {
        throw new ClienteAdminError(
          "Plano não encontrado",
          "PLANO_NAO_ENCONTRADO",
          404,
        );
      }

      const statusFinal = data.status ?? atual.status;

      if (
        plano &&
        plano.status !== "ATIVO" &&
        (data.planoId !== undefined || statusFinal === "ATIVO")
      ) {
        throw new ClienteAdminError(
          "O plano selecionado não está ativo",
          "PLANO_INATIVO",
          409,
          { planoId: plano.id },
        );
      }

      const municipio = data.municipioId
        ? await tx.municipio.findUnique({
            where: { id: data.municipioId },
            select: { id: true, status: true },
          })
        : atual.municipios[0]?.municipio;

      if (data.municipioId && !municipio) {
        throw new ClienteAdminError(
          "Município não encontrado",
          "MUNICIPIO_NAO_ENCONTRADO",
          404,
        );
      }

      if (
        municipio &&
        municipio.status !== "ATIVO" &&
        (data.municipioId !== undefined || statusFinal === "ATIVO")
      ) {
        throw new ClienteAdminError(
          "O município selecionado ainda não está disponível",
          "MUNICIPIO_INDISPONIVEL",
          409,
          { municipioId: municipio.id },
        );
      }

      if (statusFinal === "ATIVO" && !plano) {
        throw new ClienteAdminError(
          "Um cliente ativo precisa de plano",
          "CLIENTE_ATIVO_SEM_PLANO",
          409,
        );
      }

      if (statusFinal === "ATIVO" && !municipio) {
        throw new ClienteAdminError(
          "Um cliente ativo precisa de município principal",
          "CLIENTE_ATIVO_SEM_MUNICIPIO",
          409,
        );
      }

      let slug: string | undefined;

      if (data.slug) {
        slug = validarSlugNormalizado(data.slug);
        const slugExistente = await tx.cliente.findFirst({
          where: { slug, NOT: { id } },
          select: { id: true },
        });

        if (slugExistente) {
          throw new ClienteAdminError(
            "Já existe um cliente com esse slug",
            "SLUG_CLIENTE_DUPLICADO",
            409,
            { slug },
          );
        }
      }

      if (data.municipioId) {
        await tx.clienteMunicipio.updateMany({
          where: { clienteId: id, principal: true },
          data: { principal: false },
        });

        await tx.clienteMunicipio.upsert({
          where: {
            clienteId_municipioId: {
              clienteId: id,
              municipioId: data.municipioId,
            },
          },
          create: {
            clienteId: id,
            municipioId: data.municipioId,
            ativo: true,
            principal: true,
          },
          update: { ativo: true, principal: true },
        });
      }

      return tx.cliente.update({
        where: { id },
        data: {
          nome: data.nome,
          slug,
          status: data.status,
          modoProcessamento: data.modoProcessamento,
          workerUrl: data.workerUrl,
          limiteDiario: data.limiteDiario,
          pagamentoStatus: data.pagamentoStatus,
          pagamentoVenceEm,
          planoId: data.planoId,
          intervaloSegundos: data.planoId
            ? plano?.intervaloSegundos
            : undefined,
          limiteMensalConsultas: data.planoId
            ? plano?.limiteMensalConsultas
            : undefined,
        },
        include: clienteOnboardingInclude,
      });
    });

    return { cliente: mapearCliente(cliente) };
  } catch (error) {
    if (error instanceof ClienteAdminError) throw error;
    const uniqueError = mapearErroRestricaoUnica(error);

    if (uniqueError) throw uniqueError;
    throw error;
  }
}
