export const LIMITE_PLANO_INSUFICIENTE = "LIMITE_PLANO_INSUFICIENTE" as const;

export type ResumoLimitePlanoFixo = {
  limiteMensalConsultas: number;
  consultasUsadas: number;
  consultasRestantes: number;
  consultasSolicitadas: number;
  consultasRestantesAposReserva: number;
  renovacaoEm: Date;
};

export class LimitePlanoInsuficienteError extends Error {
  readonly code = LIMITE_PLANO_INSUFICIENTE;
  readonly detalhes: ResumoLimitePlanoFixo;

  constructor(detalhes: ResumoLimitePlanoFixo) {
    super(
      `Seu plano possui ${detalhes.consultasRestantes} consulta(s) disponível(is), ` +
        `mas esta busca solicita ${detalhes.consultasSolicitadas}.`,
    );

    this.name = "LimitePlanoInsuficienteError";
    this.detalhes = detalhes;
  }
}

export function calcularDisponibilidadePlanoFixo({
  limiteMensalConsultas,
  consultasUsadas,
  consultasSolicitadas,
  renovacaoEm,
}: {
  limiteMensalConsultas: number;
  consultasUsadas: number;
  consultasSolicitadas: number;
  renovacaoEm: Date;
}): ResumoLimitePlanoFixo {
  const consultasRestantes = Math.max(
    limiteMensalConsultas - consultasUsadas,
    0,
  );

  return {
    limiteMensalConsultas,
    consultasUsadas,
    consultasRestantes,
    consultasSolicitadas,
    consultasRestantesAposReserva: Math.max(
      consultasRestantes - consultasSolicitadas,
      0,
    ),
    renovacaoEm,
  };
}

export function validarSaldoPlanoFixo(
  params: Parameters<typeof calcularDisponibilidadePlanoFixo>[0],
) {
  const resumo = calcularDisponibilidadePlanoFixo(params);

  if (resumo.consultasSolicitadas > resumo.consultasRestantes) {
    throw new LimitePlanoInsuficienteError(resumo);
  }

  return resumo;
}
