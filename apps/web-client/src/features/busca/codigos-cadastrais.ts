import type { ResumoCodigosCadastrais } from "./types";

export const MAX_CODIGOS_POR_PREVIA = 1000;

const MAX_TAMANHO_CODIGO = 64;
const PADRAO_CODIGO = /^[0-9A-Z._/-]+$/;

/**
 * Produz feedback imediato para a interface.
 * A API continua sendo a autoridade e revalida toda a entrada no envio.
 */
export function analisarCodigosParaInterface(
  input: string
): ResumoCodigosCadastrais {
  const recebidos = input
    .split(/[\n,;]+/)
    .map((valor) => valor.trim())
    .filter(Boolean);

  const codigosValidos: string[] = [];
  const codigosDuplicados: string[] = [];
  const codigosInvalidos: ResumoCodigosCadastrais["codigosInvalidos"] = [];
  const vistos = new Set<string>();

  for (const valorOriginal of recebidos) {
    const valorNormalizado = valorOriginal
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase();

    if (
      valorNormalizado.length < 1 ||
      valorNormalizado.length > MAX_TAMANHO_CODIGO
    ) {
      codigosInvalidos.push({
        valorOriginal: valorOriginal.slice(0, 128),
        valorNormalizado: valorNormalizado.slice(0, 128),
        motivo: "TAMANHO_INVALIDO",
      });
      continue;
    }

    if (!PADRAO_CODIGO.test(valorNormalizado)) {
      codigosInvalidos.push({
        valorOriginal: valorOriginal.slice(0, 128),
        valorNormalizado: valorNormalizado.slice(0, 128),
        motivo: "CARACTERES_INVALIDOS",
      });
      continue;
    }

    if (vistos.has(valorNormalizado)) {
      codigosDuplicados.push(valorNormalizado);
      continue;
    }

    vistos.add(valorNormalizado);
    codigosValidos.push(valorNormalizado);
  }

  return {
    totalRecebidos: recebidos.length,
    totalValidos: codigosValidos.length,
    totalDuplicados: codigosDuplicados.length,
    totalInvalidos: codigosInvalidos.length,
    codigosValidos,
    codigosDuplicados,
    codigosInvalidos,
  };
}
