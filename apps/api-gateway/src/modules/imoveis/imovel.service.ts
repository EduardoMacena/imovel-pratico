import { prisma } from "@imovel-pratico/database";
import { adicionarBuscaProprietariosNaFila } from "@imovel-pratico/queue";
import type { BuscarProprietariosInput } from "./imovel.schemas.js";

export async function criarTarefaBuscaProprietarios(
  data: BuscarProprietariosInput
) {
  const cliente = await prisma.cliente.upsert({
    where: {
      slug: "twa-investimentos",
    },
    update: {
      intervaloSegundos: data.intervaloSegundos,
    },
    create: {
      nome: "TWA Investimentos",
      slug: "twa-investimentos",
      intervaloSegundos: data.intervaloSegundos,
      limiteDiario: 300,
    },
  });

  const tarefa = await prisma.tarefa.create({
    data: {
      clienteId: cliente.id,
      status: "PENDING",
      logradouro: data.logradouro,
      numero: data.numero,
      mesAnoInicio: data.mesAnoInicio,
      mesAnoFinal: data.mesAnoFinal,
      intervaloSegundos: data.intervaloSegundos,
      forceRefresh: data.forceRefresh,
    },
  });

  await adicionarBuscaProprietariosNaFila({
    tarefaId: tarefa.id,
    clienteId: cliente.id,
    logradouro: tarefa.logradouro,
    numero: tarefa.numero,
    mesAnoInicio: tarefa.mesAnoInicio,
    mesAnoFinal: tarefa.mesAnoFinal,
    intervaloSegundos: tarefa.intervaloSegundos,
    forceRefresh: tarefa.forceRefresh,
  });

  return {
    jobId: tarefa.id,
    status: tarefa.status,
    message: "Tarefa criada e adicionada na fila com sucesso",
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      slug: cliente.slug,
    },
    tarefa: {
      id: tarefa.id,
      status: tarefa.status,
      logradouro: tarefa.logradouro,
      numero: tarefa.numero,
      mesAnoInicio: tarefa.mesAnoInicio,
      mesAnoFinal: tarefa.mesAnoFinal,
      intervaloSegundos: tarefa.intervaloSegundos,
      forceRefresh: tarefa.forceRefresh,
      createdAt: tarefa.createdAt,
    },
  };
}

export async function buscarTarefaPorId(id: string) {
  const tarefa = await prisma.tarefa.findUnique({
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
      resultados: true,
    },
  });

  return tarefa;
}

export async function buscarProgressoTarefaPorId(id: string) {
  const tarefa = await prisma.tarefa.findUnique({
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
      resultados: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!tarefa) {
    return null;
  }

  const percentage =
    tarefa.total > 0 ? Math.round((tarefa.current / tarefa.total) * 100) : 0;

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
    erro: tarefa.erro,
    resultados: tarefa.resultados.map(resultado => ({
      id: resultado.id,
      status: resultado.status,
      logradouro: resultado.logradouro,
      numero: resultado.numero,
      complemento: resultado.complemento,
      indiceCadastral: resultado.indiceCadastral,
      proprietario: {
        nome: resultado.nome,
        cpf: resultado.cpf,
        endereco: resultado.endereco,
        telefone: resultado.telefone,
        email: resultado.email,
      },
      erro: resultado.erro,
      createdAt: resultado.createdAt,
    })),
    createdAt: tarefa.createdAt,
    startedAt: tarefa.startedAt,
    completedAt: tarefa.completedAt,
  };
}