export const MAX_CODIGOS_POR_PREVIA = 1000;

const MAX_TAMANHO_CODIGO = 64;
const PADRAO_CODIGO = /^[0-9A-Z._/-]+$/;

export type CodigoCadastralInvalido = {
  valorOriginal: string;
  valorNormalizado: string;
  motivo: "TAMANHO_INVALIDO" | "CARACTERES_INVALIDOS";
};

export type ResumoCodigosCadastrais = {
  totalRecebidos: number;
  totalValidos: number;
  totalDuplicados: number;
  totalInvalidos: number;
  codigosValidos: string[];
  codigosDuplicados: string[];
  codigosInvalidos: CodigoCadastralInvalido[];
};

function tokenizarEntrada(input: string | string[]) {
  const valores = Array.isArray(input) ? input : [input];

  return valores
    .flatMap((valor) => String(valor).split(/[\n,;]+/))
    .map((valor) => valor.trim())
    .filter(Boolean);
}

export function normalizarCodigoCadastral(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

export function analisarCodigosCadastrais(
  input: string | string[]
): ResumoCodigosCadastrais {
  const recebidos = tokenizarEntrada(input);

  if (recebidos.length > MAX_CODIGOS_POR_PREVIA) {
    throw new Error(
      `Informe no máximo ${MAX_CODIGOS_POR_PREVIA} códigos cadastrais por prévia`
    );
  }

  const codigosValidos: string[] = [];
  const codigosDuplicados: string[] = [];
  const codigosInvalidos: CodigoCadastralInvalido[] = [];
  const vistos = new Set<string>();

  for (const valorOriginal of recebidos) {
    const valorNormalizado = normalizarCodigoCadastral(valorOriginal);

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
