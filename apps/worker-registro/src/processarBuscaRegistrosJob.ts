import type { Job } from "bullmq";
import { Prisma, prisma } from "@imovel-pratico/database";
import {
  publishRealtimeEvent,
  type BuscarRegistrosJobData,
} from "@imovel-pratico/queue";
import { buscarIndiceCadastral } from "./services/buscarIndiceCadastral.js";
import { executarComControleRegistro } from "./services/registro-rate-limiter.js";
import {
  registrarErroOperacao,
  registrarOperacaoEvento,
} from "./monitoramento/operacao-monitoramento.js";

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function publicarPreviaAtualizada(params: {
  clienteId: string;
  previaId: string;
}) {
  const previa = await prisma.buscaPrevia.findUnique({
    where: {
      id: params.previaId,
    },
  });

  if (!previa) {
    return;
  }

  await publishRealtimeEvent({
    type: "busca_previa.updated",
    clienteId: params.clienteId,
    previaId: previa.id,
    status: previa.status,
    quantidadeRegistros: previa.quantidadeRegistros,
    consultasExcedentesEstimadas: previa.consultasExcedentesEstimadas,
    valorExcedenteEstimadoCentavos: previa.valorExcedenteEstimadoCentavos,
    updatedAt: previa.updatedAt.toISOString(),
  });

  await publishRealtimeEvent({
    type: "pendencias.updated",
    clienteId: params.clienteId,
    updatedAt: new Date().toISOString(),
  });
}

async function atualizarStatusPrevia(params: {
  previaId: string;
  clienteId: string;
  status:
    | "PROCESSANDO"
    | "AGUARDANDO_INTERVALO"
    | "CONSULTANDO_REGISTRO"
    | "PRONTA"
    | "ERRO";
  data?: Record<string, unknown>;
}) {
  const atualizada = await prisma.buscaPrevia.update({
    where: {
      id: params.previaId,
    },
    data: {
      status: params.status,
      ...(params.data ?? {}),
    },
  });

  await publicarPreviaAtualizada({
    clienteId: params.clienteId,
    previaId: params.previaId,
  });

  return atualizada;
}

export async function processarBuscaRegistrosJob(
  job: Job<BuscarRegistrosJobData>
) {
  const previa = await prisma.buscaPrevia.findFirst({
    where: {
      id: job.data.buscaPreviaId,
      clienteId: job.data.clienteId,
    },
  });

  if (!previa) {
    const error = new Error("BuscaPrevia não encontrada");

    await registrarErroOperacao(
      {
        clienteId: job.data.clienteId,
        buscaPreviaId: job.data.buscaPreviaId,
        servico: "WORKER_REGISTRO",
        tipo: "BUSCA_PREVIA_NAO_ENCONTRADA",
        mensagem: "Busca prévia não encontrada para processamento",
        metadata: {
          jobId: job.id,
        },
      },
      error
    );

    throw error;
  }

  if (["CANCELADA", "CONFIRMADA", "EXPIRADA"].includes(previa.status)) {
    console.log(
      `[worker-registro] Prévia ${previa.id} ignorada por status ${previa.status}`
    );

    await registrarOperacaoEvento({
      clienteId: job.data.clienteId,
      buscaPreviaId: previa.id,
      servico: "WORKER_REGISTRO",
      nivel: "WARN",
      tipo: "BUSCA_PREVIA_IGNORADA",
      mensagem: `Prévia ignorada por status ${previa.status}`,
      metadata: {
        status: previa.status,
        jobId: job.id,
      },
    });

    return;
  }

  try {
    await registrarOperacaoEvento({
      clienteId: job.data.clienteId,
      buscaPreviaId: previa.id,
      servico: "WORKER_REGISTRO",
      tipo: "BUSCA_PREVIA_PROCESSAMENTO_INICIADO",
      mensagem: "Processamento da busca prévia iniciado",
      metadata: {
        logradouro: previa.logradouro,
        numero: previa.numero,
      },
    });

    await atualizarStatusPrevia({
      previaId: previa.id,
      clienteId: job.data.clienteId,
      status: "AGUARDANDO_INTERVALO",
      data: {
        erro: null,
      },
    });

    await registrarOperacaoEvento({
      clienteId: job.data.clienteId,
      buscaPreviaId: previa.id,
      servico: "WORKER_REGISTRO",
      tipo: "BUSCA_PREVIA_AGUARDANDO_INTERVALO",
      mensagem: "Busca prévia aguardando intervalo de segurança do Registro",
      metadata: {
        logradouro: previa.logradouro,
        numero: previa.numero,
      },
    });

    const registros = await executarComControleRegistro(async () => {
      await atualizarStatusPrevia({
        previaId: previa.id,
        clienteId: job.data.clienteId,
        status: "CONSULTANDO_REGISTRO",
        data: {
          erro: null,
        },
      });

      await registrarOperacaoEvento({
        clienteId: job.data.clienteId,
        buscaPreviaId: previa.id,
        servico: "WORKER_REGISTRO",
        tipo: "BUSCA_PREVIA_CONSULTANDO_REGISTRO",
        mensagem: "Consultando índices cadastrais no Registro",
        metadata: {
          logradouro: job.data.logradouro,
          numero: job.data.numero,
        },
      });

      return buscarIndiceCadastral(job.data.logradouro, job.data.numero);
    });

    await atualizarStatusPrevia({
      previaId: previa.id,
      clienteId: job.data.clienteId,
      status: "PRONTA",
      data: {
        quantidadeRegistros: registros.length,
        registros: toPrismaJson(registros),
        erro: null,
      },
    });

    await registrarOperacaoEvento({
      clienteId: job.data.clienteId,
      buscaPreviaId: previa.id,
      servico: "WORKER_REGISTRO",
      tipo: "BUSCA_PREVIA_CONCLUIDA",
      mensagem: `Busca prévia concluída com ${registros.length} registro(s)`,
      metadata: {
        quantidadeRegistros: registros.length,
      },
    });

    await job.updateProgress({
      status: "PRONTA",
      quantidadeRegistros: registros.length,
    });

    console.log(
      `[worker-registro] Prévia ${previa.id} concluída com ${registros.length} registro(s)`
    );
  } catch (error) {
    await atualizarStatusPrevia({
      previaId: previa.id,
      clienteId: job.data.clienteId,
      status: "ERRO",
      data: {
        erro:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao consultar 1RIBH",
      },
    });

    await registrarErroOperacao(
      {
        clienteId: job.data.clienteId,
        buscaPreviaId: previa.id,
        servico: "WORKER_REGISTRO",
        tipo: "BUSCA_PREVIA_ERRO",
        mensagem: "Erro ao processar busca prévia no Registro",
        metadata: {
          logradouro: previa.logradouro,
          numero: previa.numero,
          jobId: job.id,
        },
      },
      error
    );

    throw error;
  }
}
