import bcrypt from "bcryptjs";
import { prisma } from "@imovel-pratico/database";
import type {
  AtualizarClienteInput,
  AtualizarUsuarioInput,
  CriarClienteInput,
  CriarUsuarioInput,
} from "./admin.schemas.js";

function gerarSlugBase(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function gerarSlugUnico(nome: string, slugInformado?: string) {
  const base = gerarSlugBase(slugInformado || nome);

  let slug = base;
  let contador = 1;

  while (true) {
    const existente = await prisma.cliente.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!existente) {
      return slug;
    }

    contador += 1;
    slug = `${base}-${contador}`;
  }
}

function removerSenhaUsuario<T extends { senha?: string }>(usuario: T) {
  const { senha, ...usuarioSemSenha } = usuario;

  return usuarioSemSenha;
}

export async function listarClientes() {
  const clientes = await prisma.cliente.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          usuarios: true,
          tarefas: true,
        },
      },
    },
  });

  return clientes.map(cliente => ({
    id: cliente.id,
    nome: cliente.nome,
    slug: cliente.slug,
    status: cliente.status,
    workerUrl: cliente.workerUrl,
    intervaloSegundos: cliente.intervaloSegundos,
    limiteDiario: cliente.limiteDiario,
    totalUsuarios: cliente._count.usuarios,
    totalTarefas: cliente._count.tarefas,
    createdAt: cliente.createdAt,
    updatedAt: cliente.updatedAt,
  }));
}

export async function criarCliente(data: CriarClienteInput) {
  const slug = await gerarSlugUnico(data.nome, data.slug);

  const cliente = await prisma.cliente.create({
    data: {
      nome: data.nome,
      slug,
      workerUrl: data.workerUrl ?? null,
      intervaloSegundos: data.intervaloSegundos,
      limiteDiario: data.limiteDiario,
    },
  });

  return cliente;
}

export async function atualizarCliente(id: string, data: AtualizarClienteInput) {
  let slug = data.slug;

  if (slug) {
    const slugNormalizado = gerarSlugBase(slug);

    const existente = await prisma.cliente.findFirst({
      where: {
        slug: slugNormalizado,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existente) {
      throw new Error("Já existe um cliente com esse slug");
    }

    slug = slugNormalizado;
  }

  const cliente = await prisma.cliente.update({
    where: {
      id,
    },
    data: {
      nome: data.nome,
      slug,
      status: data.status,
      workerUrl: data.workerUrl,
      intervaloSegundos: data.intervaloSegundos,
      limiteDiario: data.limiteDiario,
    },
  });

  return cliente;
}

export async function listarUsuariosDoCliente(clienteId: string) {
  const usuarios = await prisma.usuario.findMany({
    where: {
      clienteId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return usuarios.map(removerSenhaUsuario);
}

export async function criarUsuario(clienteId: string, data: CriarUsuarioInput) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
  });

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  const emailExistente = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },
  });

  if (emailExistente) {
    throw new Error("Já existe um usuário com esse e-mail");
  }

  const senhaHash = await bcrypt.hash(data.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      clienteId,
      nome: data.nome,
      email: data.email,
      senha: senhaHash,
      role: data.role,
      ativo: data.ativo,
    },
  });

  return removerSenhaUsuario(usuario);
}

export async function atualizarUsuario(id: string, data: AtualizarUsuarioInput) {
  if (data.email) {
    const emailExistente = await prisma.usuario.findFirst({
      where: {
        email: data.email,
        NOT: {
          id,
        },
      },
    });

    if (emailExistente) {
      throw new Error("Já existe um usuário com esse e-mail");
    }
  }

  const senhaHash = data.senha ? await bcrypt.hash(data.senha, 10) : undefined;

  const usuario = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      nome: data.nome,
      email: data.email,
      senha: senhaHash,
      role: data.role,
      ativo: data.ativo,
    },
  });

  return removerSenhaUsuario(usuario);
}

export async function listarTarefasDoCliente(clienteId: string) {
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

  const tarefas = await prisma.tarefa.findMany({
    where: {
      clienteId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    include: {
      _count: {
        select: {
          resultados: true,
        },
      },
    },
  });

  return {
    cliente,
    tarefas: tarefas.map(tarefa => {
      const percentage =
        tarefa.total > 0
          ? Math.round((tarefa.current / tarefa.total) * 100)
          : 0;

      return {
        id: tarefa.id,
        status: tarefa.status,
        endereco: {
          logradouro: tarefa.logradouro,
          numero: tarefa.numero,
        },
        periodo: {
          mesAnoInicio: tarefa.mesAnoInicio,
          mesAnoFinal: tarefa.mesAnoFinal,
        },
        progress: {
          total: tarefa.total,
          current: tarefa.current,
          percentage,
        },
        totalResultados: tarefa._count.resultados,
        erro: tarefa.erro,
        createdAt: tarefa.createdAt,
        startedAt: tarefa.startedAt,
        completedAt: tarefa.completedAt,
      };
    }),
  };
}

export async function buscarClientePorId(id: string) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          usuarios: true,
          tarefas: true,
        },
      },
    },
  });

  if (!cliente) {
    return null;
  }

  return {
    id: cliente.id,
    nome: cliente.nome,
    slug: cliente.slug,
    status: cliente.status,
    workerUrl: cliente.workerUrl,
    intervaloSegundos: cliente.intervaloSegundos,
    limiteDiario: cliente.limiteDiario,
    totalUsuarios: cliente._count.usuarios,
    totalTarefas: cliente._count.tarefas,
    createdAt: cliente.createdAt,
    updatedAt: cliente.updatedAt,
  };
}

export async function buscarUsuarioPorId(id: string) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id,
    },
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          slug: true,
        },
      },
    },
  });

  if (!usuario) {
    return null;
  }

  return removerSenhaUsuario(usuario);
}

export async function buscarDashboardAdmin() {
  const inicioUltimos30Dias = new Date();

  inicioUltimos30Dias.setDate(inicioUltimos30Dias.getDate() - 30);

  const [
    clientes,
    totalClientes,
    clientesAtivos,
    tarefasTotal,
    tarefasUltimos30Dias,
    tarefasPendentes,
    tarefasProcessando,
    tarefasConcluidas,
    tarefasComErro,
    resultadosTotal,
    ultimasTarefas,
  ] = await prisma.$transaction([
    prisma.cliente.findMany({
      include: {
        _count: {
          select: {
            usuarios: true,
            tarefas: true,
          },
        },
      },
    }),

    prisma.cliente.count(),

    prisma.cliente.count({
      where: {
        status: "ATIVO",
      },
    }),

    prisma.tarefa.count(),

    prisma.tarefa.count({
      where: {
        createdAt: {
          gte: inicioUltimos30Dias,
        },
      },
    }),

    prisma.tarefa.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.tarefa.count({
      where: {
        status: "PROCESSING",
      },
    }),

    prisma.tarefa.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.tarefa.count({
      where: {
        status: "ERROR",
      },
    }),

    prisma.tarefaResultado.count(),

    prisma.tarefa.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            slug: true,
          },
        },
        _count: {
          select: {
            resultados: true,
          },
        },
      },
    }),
  ]);

  const clientesPorUso = clientes
    .map(cliente => ({
      id: cliente.id,
      nome: cliente.nome,
      slug: cliente.slug,
      status: cliente.status,
      totalUsuarios: cliente._count.usuarios,
      totalTarefas: cliente._count.tarefas,
    }))
    .sort((a, b) => b.totalTarefas - a.totalTarefas)
    .slice(0, 10);

  return {
    indicadores: {
      totalClientes,
      clientesAtivos,
      clientesInativos: totalClientes - clientesAtivos,
      tarefasTotal,
      tarefasUltimos30Dias,
      tarefasPendentes,
      tarefasProcessando,
      tarefasConcluidas,
      tarefasComErro,
      resultadosTotal,
    },
    clientesPorUso,
    ultimasTarefas: ultimasTarefas.map(tarefa => {
      const percentage =
        tarefa.total > 0
          ? Math.round((tarefa.current / tarefa.total) * 100)
          : 0;

      return {
        id: tarefa.id,
        status: tarefa.status,
        cliente: tarefa.cliente,
        endereco: {
          logradouro: tarefa.logradouro,
          numero: tarefa.numero,
        },
        periodo: {
          mesAnoInicio: tarefa.mesAnoInicio,
          mesAnoFinal: tarefa.mesAnoFinal,
        },
        progress: {
          total: tarefa.total,
          current: tarefa.current,
          percentage,
        },
        totalResultados: tarefa._count.resultados,
        erro: tarefa.erro,
        createdAt: tarefa.createdAt,
        startedAt: tarefa.startedAt,
        completedAt: tarefa.completedAt,
      };
    }),
  };
}