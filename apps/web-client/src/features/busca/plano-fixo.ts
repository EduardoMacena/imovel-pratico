import type { LimitePreviaResumo } from "./types";

export const CODIGO_LIMITE_PLANO_INSUFICIENTE =
  "LIMITE_PLANO_INSUFICIENTE" as const;

export function podeConfirmarPrevia(limite: LimitePreviaResumo) {
  return (
    limite.podeConfirmar &&
    limite.consultasSolicitadas > 0 &&
    limite.consultasSolicitadas <= limite.consultasRestantes
  );
}

export function formatarMensagemLimitePlano(
  limite: Pick<
    LimitePreviaResumo,
    "consultasRestantes" | "consultasSolicitadas" | "renovacaoEm"
  >,
) {
  if (limite.consultasRestantes <= 0) {
    return limite.renovacaoEm
      ? `O limite do plano foi atingido. Novas buscas serão liberadas na renovação de ${new Intl.DateTimeFormat(
          "pt-BR",
          {
            dateStyle: "short",
            timeZone: "UTC",
          },
        ).format(new Date(limite.renovacaoEm))} ou após uma mudança de plano.`
      : "O limite do plano foi atingido. Aguarde a renovação do período ou altere o plano.";
  }

  return `Esta busca solicita ${limite.consultasSolicitadas} consulta(s), mas o plano possui ${limite.consultasRestantes} disponível(is). Reduza a busca ou altere o plano.`;
}
