import { prisma } from "@imovel-pratico/database";
import { formatDateOnlyFromDate } from "../../utils/date-only.js";
import { calcularDisponibilidadePlanoFixo } from "./plano-fixo.js";

type AssinaturaDatabase = Pick<
  typeof prisma,
  "cliente" | "tarefa" | "tarefaResultado"
>;

function getInicioMesAtual() {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
}

function getFimMesAtual() {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
}

function getHojeUtcNoon() {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0, 0));
}

function pagamentoEstaVencido(pagamentoVenceEm: Date | null) {
  if (!pagamentoVenceEm) {
    return false;
  }

  return pagamentoVenceEm < getHojeUtcNoon();
}

export async function buscarUsoMensalCliente(
  clienteId: string,
  db: AssinaturaDatabase = prisma
) {
  const inicioMes = getInicioMesAtual();
  const fimMes = getFimMesAtual();

  const [tarefasReservadas, resultadosLegadosOuCancelados] =
    await Promise.all([
      db.tarefa.aggregate({
        where: {
          clienteId,
          status: {
            not: "CANCELED",
          },
          consultasEstimadas: {
            not: null,
          },
          createdAt: {
            gte: inicioMes,
            lt: fimMes,
          },
        },
        _sum: {
          consultasEstimadas: true,
        },
      }),
      db.tarefaResultado.count({
        where: {
          status: "SUCCESS",
          tarefa: {
            clienteId,
            OR: [
              {
                consultasEstimadas: null,
              },
              {
                status: "CANCELED",
              },
            ],
          },
          createdAt: {
            gte: inicioMes,
            lt: fimMes,
          },
        },
      }),
    ]);

  const consultasReservadas =
    tarefasReservadas._sum.consultasEstimadas ?? 0;

  return {
    consultasUsadas:
      consultasReservadas + resultadosLegadosOuCancelados,
    consultasReservadas,
    consultasLegadasOuCanceladas:
      resultadosLegadosOuCancelados,
    inicioMes,
    fimMes,
  };
}

export function calcularResumoUso({
  consultasUsadas,
  limiteMensal,
  precoCentavos,
}: {
  consultasUsadas: number;
  limiteMensal: number;
  precoCentavos: number;
  valorConsultaAdicionalCentavos?: number;
}) {
  const disponibilidade = calcularDisponibilidadePlanoFixo({
    limiteMensalConsultas: limiteMensal,
    consultasUsadas,
    consultasSolicitadas: 0,
    renovacaoEm: getFimMesAtual(),
  });

  return {
    consultasUsadas,
    limiteMensal,
    consultasRestantes: disponibilidade.consultasRestantes,
    consultasExcedentes: 0,
    valorConsultaAdicionalCentavos: 0,
    valorExcedenteCentavos: 0,
    totalEstimadoCentavos: precoCentavos,
    percentualUsado:
      limiteMensal > 0
        ? Math.min(
            Math.round((consultasUsadas / limiteMensal) * 100),
            100
          )
        : 0,
  };
}

export function calcularResumoExcedenteBusca({
  consultasEstimadas,
  consultasRestantes,
  valorConsultaAdicionalCentavos,
}: {
  consultasEstimadas: number;
  consultasRestantes: number;
  valorConsultaAdicionalCentavos: number;
}) {
  const consultasExcedentesEstimadas = Math.max(
    consultasEstimadas - consultasRestantes,
    0
  );

  return {
    consultasEstimadas,
    consultasDisponiveisNoMomento: consultasRestantes,
    consultasExcedentesEstimadas,
    valorConsultaAdicionalCentavos,
    valorExcedenteEstimadoCentavos:
      consultasExcedentesEstimadas * valorConsultaAdicionalCentavos,
  };
}

export async function validarClientePodeCriarBusca(
  clienteId: string,
  db: AssinaturaDatabase = prisma
) {
  const cliente = await db.cliente.findUnique({
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

  if (cliente.status !== "ATIVO") {
    throw new Error("Cliente inativo ou suspenso");
  }

  if (!cliente.plano) {
    throw new Error("Cliente sem plano contratado");
  }

  if (cliente.plano.status !== "ATIVO") {
    throw new Error("Plano contratado está inativo");
  }

  if (cliente.pagamentoStatus !== "PAGO") {
    throw new Error("Pagamento do plano pendente ou vencido");
  }

  if (pagamentoEstaVencido(cliente.pagamentoVenceEm)) {
    throw new Error("Pagamento do plano está vencido");
  }

  const usoMensal = await buscarUsoMensalCliente(clienteId, db);

  const uso = calcularResumoUso({
    consultasUsadas: usoMensal.consultasUsadas,
    limiteMensal: cliente.plano.limiteMensalConsultas,
    precoCentavos: cliente.plano.precoCentavos,
  });

  return {
    cliente,
    plano: cliente.plano,
    uso: {
      ...uso,
      consultasReservadas: usoMensal.consultasReservadas,
      consultasLegadasOuCanceladas:
        usoMensal.consultasLegadasOuCanceladas,
      inicioMes: usoMensal.inicioMes,
      fimMes: usoMensal.fimMes,
    },
  };
}

export async function buscarMinhaAssinatura(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
    select: {
      id: true,
      nome: true,
      slug: true,
      status: true,
      intervaloSegundos: true,
      limiteMensalConsultas: true,
      pagamentoStatus: true,
      pagamentoVenceEm: true,
      plano: {
        select: {
          id: true,
          nome: true,
          slug: true,
          descricao: true,
          limiteMensalConsultas: true,
          intervaloSegundos: true,
          precoCentavos: true,
          valorConsultaAdicionalCentavos: true,
          limiteCorretores: true,
          status: true,
        },
      },
    },
  });

  if (!cliente?.plano) {
    return null;
  }

  const usoMensal = await buscarUsoMensalCliente(clienteId);

  const uso = calcularResumoUso({
    consultasUsadas: usoMensal.consultasUsadas,
    limiteMensal: cliente.plano.limiteMensalConsultas,
    precoCentavos: cliente.plano.precoCentavos,
    valorConsultaAdicionalCentavos:
      cliente.plano.valorConsultaAdicionalCentavos,
  });

  return {
    cliente: {
      ...cliente,
      pagamentoVenceEm: formatDateOnlyFromDate(cliente.pagamentoVenceEm),
    },
    plano: cliente.plano,
    uso: {
      ...uso,
      inicioMes: usoMensal.inicioMes,
      fimMes: usoMensal.fimMes,
    },
  };
}
