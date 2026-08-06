export type PlanoFixoAdminSerializavel = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  limiteMensalConsultas: number;
  intervaloSegundos: number;
  precoCentavos: number;
  limiteCorretores: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializarPlanoFixoAdmin(plano: PlanoFixoAdminSerializavel) {
  return {
    id: plano.id,
    nome: plano.nome,
    slug: plano.slug,
    descricao: plano.descricao,
    limiteMensalConsultas: plano.limiteMensalConsultas,
    intervaloSegundos: plano.intervaloSegundos,
    precoCentavos: plano.precoCentavos,
    limiteCorretores: plano.limiteCorretores,
    status: plano.status,
    createdAt: plano.createdAt,
    updatedAt: plano.updatedAt,
  };
}

export function calcularResumoUsoAdminPlanoFixo({
  consultasUsadas,
  limiteMensal,
}: {
  consultasUsadas: number;
  limiteMensal: number;
}) {
  return {
    consultasUsadas,
    limiteMensal,
    consultasRestantes: Math.max(limiteMensal - consultasUsadas, 0),
    percentualUsado:
      limiteMensal > 0
        ? Math.min(Math.round((consultasUsadas / limiteMensal) * 100), 100)
        : 0,
  };
}

export function calcularValoresFaturaPlanoFixo({
  consultasInclusas,
  consultasUsadas,
  valorMensalidadeCentavos,
}: {
  consultasInclusas: number;
  consultasUsadas: number;
  valorMensalidadeCentavos: number;
}) {
  return {
    consultasInclusas,
    consultasUsadas,
    consultasExcedentes: 0,
    valorMensalidadeCentavos,
    valorConsultaAdicionalCentavos: 0,
    valorExcedenteCentavos: 0,
    valorTotalCentavos: valorMensalidadeCentavos,
  };
}

export function normalizarItemFaturaHistorica<
  T extends {
    tipo: string;
    descricao: string;
  },
>(item: T) {
  if (item.tipo !== "CONSULTA_EXCEDENTE") {
    return item;
  }

  return {
    ...item,
    tipo: "AJUSTE",
    descricao: "Ajuste histórico de faturamento",
  };
}
