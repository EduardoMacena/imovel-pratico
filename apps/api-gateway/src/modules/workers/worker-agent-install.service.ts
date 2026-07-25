import { randomBytes } from "node:crypto";
import { Prisma, prisma, type WorkerAgentTipo } from "@imovel-pratico/database";
import { hashWorkerToken } from "./worker-agent.auth.js";
import type {
  AtivarWorkerAgentInstallLinkInput,
  CriarWorkerAgentInstallLinkInput,
} from "./worker-agent-install.schemas.js";

function gerarCodigoInstalacao() {
  return `ipl_${randomBytes(32).toString("base64url")}`;
}

function gerarWorkerToken() {
  return `ipw_${randomBytes(32).toString("base64url")}`;
}

function normalizarIdentificador(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function montarIdentificador(base: string, tipo: WorkerAgentTipo) {
  const sufixo = tipo === "REGISTRO" ? "registro" : "cnd";

  return `${base}-${sufixo}`;
}

function serializarLink(link: {
  id: string;
  clienteId: string;
  status: string;
  identificadorBase: string;
  incluirRegistro: boolean;
  incluirCnd: boolean;
  usadoEm: Date | null;
  expiraEm: Date;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: link.id,
    clienteId: link.clienteId,
    status: link.status,
    identificadorBase: link.identificadorBase,
    incluirRegistro: link.incluirRegistro,
    incluirCnd: link.incluirCnd,
    usadoEm: link.usadoEm?.toISOString() ?? null,
    expiraEm: link.expiraEm.toISOString(),
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  };
}

export async function listarWorkerAgentInstallLinks(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
    select: {
      id: true,
      nome: true,
      slug: true,
      status: true,
      modoProcessamento: true,
    },
  });

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  const links = await prisma.workerAgentInstallLink.findMany({
    where: {
      clienteId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return {
    cliente,
    links: links.map(serializarLink),
  };
}

export async function criarWorkerAgentInstallLink(
  clienteId: string,
  data: CriarWorkerAgentInstallLinkInput
) {
  if (!data.incluirRegistro && !data.incluirCnd) {
    throw new Error("Selecione pelo menos REGISTRO ou CND para instalação");
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
    select: {
      id: true,
      nome: true,
      slug: true,
      status: true,
    },
  });

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  if (cliente.status !== "ATIVO") {
    throw new Error("Cliente precisa estar ativo para gerar link de instalação");
  }

  const identificadorBase = normalizarIdentificador(data.identificadorBase);

  if (!identificadorBase) {
    throw new Error("Identificador base inválido");
  }

  const code = gerarCodigoInstalacao();
  const codigoHash = hashWorkerToken(code);

  const expiraEm = new Date(Date.now() + data.expiraEmHoras * 60 * 60 * 1000);

  const link = await prisma.workerAgentInstallLink.create({
    data: {
      clienteId,
      codigoHash,
      identificadorBase,
      incluirRegistro: data.incluirRegistro,
      incluirCnd: data.incluirCnd,
      expiraEm,
    },
  });

  await prisma.operacaoEvento.create({
    data: {
      clienteId,
      nivel: "INFO",
      servico: "API_GATEWAY",
      tipo: "WORKER_AGENT_INSTALL_LINK_CRIADO",
      mensagem: `Link mágico de instalação criado para ${cliente.nome}`,
      metadata: {
        linkId: link.id,
        identificadorBase,
        incluirRegistro: data.incluirRegistro,
        incluirCnd: data.incluirCnd,
        expiraEm: expiraEm.toISOString(),
      },
    },
  });

  return {
    link: serializarLink(link),
    code,
    aviso:
      "Este código aparece apenas agora. Ele expira e só pode ser usado uma vez.",
  };
}

export async function cancelarWorkerAgentInstallLink(id: string) {
  const link = await prisma.workerAgentInstallLink.findUnique({
    where: {
      id,
    },
  });

  if (!link) {
    throw new Error("Link de instalação não encontrado");
  }

  if (link.status !== "PENDENTE") {
    throw new Error("Somente links pendentes podem ser cancelados");
  }

  const atualizado = await prisma.workerAgentInstallLink.update({
    where: {
      id,
    },
    data: {
      status: "CANCELADO",
    },
  });

  await prisma.operacaoEvento.create({
    data: {
      clienteId: atualizado.clienteId,
      nivel: "WARN",
      servico: "API_GATEWAY",
      tipo: "WORKER_AGENT_INSTALL_LINK_CANCELADO",
      mensagem: "Link mágico de instalação cancelado",
      metadata: {
        linkId: atualizado.id,
        identificadorBase: atualizado.identificadorBase,
      },
    },
  });

  return {
    link: serializarLink(atualizado),
  };
}

export async function ativarWorkerAgentInstallLink(
  data: AtivarWorkerAgentInstallLinkInput
) {
  const codigoHash = hashWorkerToken(data.code);
  const agora = new Date();

  const link = await prisma.workerAgentInstallLink.findUnique({
    where: {
      codigoHash,
    },
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          slug: true,
          status: true,
        },
      },
    },
  });

  if (!link) {
    throw new Error("Código de instalação inválido");
  }

  if (link.status !== "PENDENTE") {
    throw new Error("Código de instalação não está mais disponível");
  }

  if (link.expiraEm <= agora) {
    await prisma.workerAgentInstallLink.update({
      where: {
        id: link.id,
      },
      data: {
        status: "EXPIRADO",
      },
    });

    throw new Error("Código de instalação expirado");
  }

  if (link.cliente.status !== "ATIVO") {
    throw new Error("Cliente não está ativo");
  }

  const metadata: Prisma.InputJsonObject = {
    machineId: data.machineId ?? "",
    hostname: data.hostname ?? "",
    platform: data.platform ?? "",
    version: data.version ?? "",
    instaladoEm: agora.toISOString(),
    installLinkId: link.id,
  };

  const tokens: {
    registro?: {
      identificador: string;
      token: string;
    };
    cnd?: {
      identificador: string;
      token: string;
    };
  } = {};

  await prisma.$transaction(async tx => {
    const linkAtualizado = await tx.workerAgentInstallLink.updateMany({
      where: {
        id: link.id,
        status: "PENDENTE",
        expiraEm: {
          gt: agora,
        },
      },
      data: {
        status: "USADO",
        usadoEm: agora,
        metadata,
      },
    });

    if (linkAtualizado.count !== 1) {
      throw new Error("Código de instalação já foi utilizado ou expirou");
    }

    if (link.incluirRegistro) {
      const token = gerarWorkerToken();
      const identificador = montarIdentificador(
        link.identificadorBase,
        "REGISTRO"
      );

      await tx.workerAgent.upsert({
        where: {
          worker_agent_cliente_tipo_identificador_unique: {
            clienteId: link.clienteId,
            tipo: "REGISTRO",
            identificador,
          },
        },
        create: {
          clienteId: link.clienteId,
          tipo: "REGISTRO",
          identificador,
          tokenHash: hashWorkerToken(token),
          status: "ATIVO",
          metadata,
        },
        update: {
          tokenHash: hashWorkerToken(token),
          status: "ATIVO",
          ultimoSinalEm: null,
          metadata,
        },
      });

      tokens.registro = {
        identificador,
        token,
      };
    }

    if (link.incluirCnd) {
      const token = gerarWorkerToken();
      const identificador = montarIdentificador(link.identificadorBase, "CND");

      await tx.workerAgent.upsert({
        where: {
          worker_agent_cliente_tipo_identificador_unique: {
            clienteId: link.clienteId,
            tipo: "CND",
            identificador,
          },
        },
        create: {
          clienteId: link.clienteId,
          tipo: "CND",
          identificador,
          tokenHash: hashWorkerToken(token),
          status: "ATIVO",
          metadata,
        },
        update: {
          tokenHash: hashWorkerToken(token),
          status: "ATIVO",
          ultimoSinalEm: null,
          metadata,
        },
      });

      tokens.cnd = {
        identificador,
        token,
      };
    }

    await tx.operacaoEvento.create({
      data: {
        clienteId: link.clienteId,
        nivel: "INFO",
        servico: "API_GATEWAY",
        tipo: "WORKER_AGENT_INSTALL_LINK_ATIVADO",
        mensagem: `Instalação do Agent ativada para ${link.cliente.nome}`,
        metadata: {
          installLinkId: link.id,
          identificadorBase: link.identificadorBase,
          machineId: data.machineId ?? null,
          hostname: data.hostname ?? null,
          platform: data.platform ?? null,
          version: data.version ?? null,
          registro: Boolean(tokens.registro),
          cnd: Boolean(tokens.cnd),
        },
      },
    });
  });

  return {
    apiUrl: null,
    cliente: {
      id: link.cliente.id,
      nome: link.cliente.nome,
      slug: link.cliente.slug,
    },
    agents: tokens,
  };
}