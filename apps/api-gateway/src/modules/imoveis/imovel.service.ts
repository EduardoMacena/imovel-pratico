import { prisma } from "@imovel-pratico/database";
import type { BuscarProprietariosInput } from "./imovel.schemas.js";

export async function criarTarefaBuscaProprietarios(
  data: BuscarProprietariosInput
) {
  const cliente = await prisma.cliente.upsert({
    where: {
      slug: "twa-investimentos",
    },
    update: {},
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

  return {
    jobId: tarefa.id,
    status: tarefa.status,
    message: "Tarefa criada com sucesso",
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