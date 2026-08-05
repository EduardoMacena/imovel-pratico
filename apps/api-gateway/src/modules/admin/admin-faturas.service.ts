import { prisma } from "@imovel-pratico/database";
import {
  formatDateOnlyFromDate,
  parseDateOnlyToUtcNoon,
} from "../../utils/date-only.js";
import type {
  GerarFaturaInput,
  ListarFaturasQuery,
} from "./admin-faturas.schemas.js";
import {
  calcularValoresFaturaPlanoFixo,
  normalizarItemFaturaHistorica,
} from "./admin-planos-fixos.js";

function getPeriodoReferencia(referenciaMes: number, referenciaAno: number) {
  const inicio = new Date(
    Date.UTC(referenciaAno, referenciaMes - 1, 1, 0, 0, 0, 0)
  );

  const fim = new Date(
    Date.UTC(referenciaAno, referenciaMes, 1, 0, 0, 0, 0)
  );

  return {
    inicio,
    fim,
  };
}

function getVencimentoPadrao(referenciaMes: number, referenciaAno: number) {
  return new Date(Date.UTC(referenciaAno, referenciaMes, 10, 12, 0, 0, 0));
}

type ItemFaturaCalculado = {
  tipo: "MENSALIDADE";
  descricao: string;
  quantidade: number;
  valorUnitarioCentavos: number;
  valorTotalCentavos: number;
};

function formatReferencia(mes: number, ano: number) {
  return `${String(mes).padStart(2, "0")}/${ano}`;
}

function serializarFatura(fatura: any) {
  return {
    id: fatura.id,
    clienteId: fatura.clienteId,
    cliente: fatura.cliente,
    status: fatura.status,

    referenciaMes: fatura.referenciaMes,
    referenciaAno: fatura.referenciaAno,
    referenciaLabel: formatReferencia(
      fatura.referenciaMes,
      fatura.referenciaAno,
    ),

    planoId: fatura.planoId,
    planoNome: fatura.planoNome,

    consultasInclusas: fatura.consultasInclusas,
    consultasUsadas: fatura.consultasUsadas,

    valorMensalidadeCentavos: fatura.valorMensalidadeCentavos,
    valorTotalCentavos: fatura.valorTotalCentavos,

    vencimentoEm: formatDateOnlyFromDate(fatura.vencimentoEm),
    pagaEm: fatura.pagaEm,
    observacao: fatura.observacao,

    itens:
      fatura.itens?.map((item: any) =>
        normalizarItemFaturaHistorica({
          id: item.id,
          tipo: item.tipo,
          descricao: item.descricao,
          quantidade: item.quantidade,
          valorUnitarioCentavos: item.valorUnitarioCentavos,
          valorTotalCentavos: item.valorTotalCentavos,
          createdAt: item.createdAt,
        }),
      ) ?? [],

    createdAt: fatura.createdAt,
    updatedAt: fatura.updatedAt,
  };
}

async function calcularDadosFatura({
  clienteId,
  referenciaMes,
  referenciaAno,
}: {
  clienteId: string;
  referenciaMes: number;
  referenciaAno: number;
}) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
    include: {
      plano: true,
    },
  });

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  if (!cliente.plano) {
    throw new Error("Cliente sem plano contratado");
  }

  const { inicio, fim } = getPeriodoReferencia(
    referenciaMes,
    referenciaAno,
  );

  const consultasUsadas = await prisma.tarefaResultado.count({
    where: {
      status: "SUCCESS",
      tarefa: {
        clienteId,
      },
      createdAt: {
        gte: inicio,
        lt: fim,
      },
    },
  });

  const valores = calcularValoresFaturaPlanoFixo({
    consultasInclusas: cliente.plano.limiteMensalConsultas,
    consultasUsadas,
    valorMensalidadeCentavos: cliente.plano.precoCentavos,
  });

  const itens: ItemFaturaCalculado[] = [
    {
      tipo: "MENSALIDADE",
      descricao: `Mensalidade ${cliente.plano.nome} - ${formatReferencia(
        referenciaMes,
        referenciaAno,
      )}`,
      quantidade: 1,
      valorUnitarioCentavos: valores.valorMensalidadeCentavos,
      valorTotalCentavos: valores.valorMensalidadeCentavos,
    },
  ];

  return {
    cliente,
    plano: cliente.plano,
    ...valores,
    itens,
  };
}

export async function listarFaturasAdmin(query: ListarFaturasQuery) {
  const faturas = await prisma.fatura.findMany({
    where: {
      clienteId: query.clienteId,
      status: query.status,
      referenciaMes: query.referenciaMes,
      referenciaAno: query.referenciaAno,
    },
    orderBy: [
      {
        referenciaAno: "desc",
      },
      {
        referenciaMes: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 100,
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          slug: true,
          status: true,
        },
      },
      itens: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return faturas.map(serializarFatura);
}

export async function buscarFaturaAdmin(id: string) {
  const fatura = await prisma.fatura.findUnique({
    where: {
      id,
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
      itens: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!fatura) {
    return null;
  }

  return serializarFatura(fatura);
}

export async function gerarFaturaAdmin(data: GerarFaturaInput) {
  const dados = await calcularDadosFatura({
    clienteId: data.clienteId,
    referenciaMes: data.referenciaMes,
    referenciaAno: data.referenciaAno,
  });

  const vencimentoEm =
    parseDateOnlyToUtcNoon(data.vencimentoEm) ??
    getVencimentoPadrao(data.referenciaMes, data.referenciaAno);

  const existente = await prisma.fatura.findUnique({
    where: {
      clienteId_referenciaMes_referenciaAno: {
        clienteId: data.clienteId,
        referenciaMes: data.referenciaMes,
        referenciaAno: data.referenciaAno,
      },
    },
  });

  if (existente?.status === "PAGA") {
    throw new Error("Esta fatura já está paga e não pode ser recalculada");
  }

  const fatura = await prisma.$transaction(async tx => {
    const faturaSalva = existente
      ? await tx.fatura.update({
          where: {
            id: existente.id,
          },
          data: {
            status: "ABERTA",
            planoId: dados.plano.id,
            planoNome: dados.plano.nome,
            consultasInclusas: dados.consultasInclusas,
            consultasUsadas: dados.consultasUsadas,
            consultasExcedentes: dados.consultasExcedentes,
            valorMensalidadeCentavos: dados.valorMensalidadeCentavos,
            valorConsultaAdicionalCentavos:
              dados.valorConsultaAdicionalCentavos,
            valorExcedenteCentavos: dados.valorExcedenteCentavos,
            valorTotalCentavos: dados.valorTotalCentavos,
            vencimentoEm,
            pagaEm: null,
            observacao: data.observacao ?? null,
          },
        })
      : await tx.fatura.create({
          data: {
            clienteId: data.clienteId,
            status: "ABERTA",
            referenciaMes: data.referenciaMes,
            referenciaAno: data.referenciaAno,
            planoId: dados.plano.id,
            planoNome: dados.plano.nome,
            consultasInclusas: dados.consultasInclusas,
            consultasUsadas: dados.consultasUsadas,
            consultasExcedentes: dados.consultasExcedentes,
            valorMensalidadeCentavos: dados.valorMensalidadeCentavos,
            valorConsultaAdicionalCentavos:
              dados.valorConsultaAdicionalCentavos,
            valorExcedenteCentavos: dados.valorExcedenteCentavos,
            valorTotalCentavos: dados.valorTotalCentavos,
            vencimentoEm,
            observacao: data.observacao ?? null,
          },
        });

    await tx.faturaItem.deleteMany({
      where: {
        faturaId: faturaSalva.id,
      },
    });

    await tx.faturaItem.createMany({
      data: dados.itens.map(item => ({
        faturaId: faturaSalva.id,
        tipo: item.tipo,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valorUnitarioCentavos: item.valorUnitarioCentavos,
        valorTotalCentavos: item.valorTotalCentavos,
      })),
    });

    return faturaSalva;
  });

  return buscarFaturaAdmin(fatura.id);
}

export async function marcarFaturaComoPagaAdmin(id: string) {
  const fatura = await prisma.fatura.findUnique({
    where: {
      id,
    },
  });

  if (!fatura) {
    throw new Error("Fatura não encontrada");
  }

  if (fatura.status === "CANCELADA") {
    throw new Error("Fatura cancelada não pode ser marcada como paga");
  }

  const atualizada = await prisma.$transaction(async tx => {
    const faturaAtualizada = await tx.fatura.update({
      where: {
        id,
      },
      data: {
        status: "PAGA",
        pagaEm: new Date(),
      },
    });

    await tx.cliente.update({
      where: {
        id: fatura.clienteId,
      },
      data: {
        pagamentoStatus: "PAGO",
        pagamentoVenceEm: fatura.vencimentoEm,
      },
    });

    return faturaAtualizada;
  });

  return buscarFaturaAdmin(atualizada.id);
}

export async function cancelarFaturaAdmin(id: string) {
  const fatura = await prisma.fatura.findUnique({
    where: {
      id,
    },
  });

  if (!fatura) {
    throw new Error("Fatura não encontrada");
  }

  if (fatura.status === "PAGA") {
    throw new Error("Fatura paga não pode ser cancelada");
  }

  const atualizada = await prisma.fatura.update({
    where: {
      id,
    },
    data: {
      status: "CANCELADA",
    },
  });

  return buscarFaturaAdmin(atualizada.id);
}
