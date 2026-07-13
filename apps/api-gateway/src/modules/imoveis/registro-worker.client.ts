export type RegistroWorkerRegistro = {
  indiceCadastral: string;
  complemento: string | null;
};

type PreverBuscaWorkerResponse = {
  previa?: {
    logradouro?: string;
    numero?: string;
    quantidadeRegistros?: number;
    registros?: RegistroWorkerRegistro[];
  };
};

export async function preverBuscaNoWorkerRegistro(params: {
  workerUrl: string;
  logradouro: string;
  numero: string;
}) {
  const baseUrl = params.workerUrl.replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/registro/prever-busca`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      logradouro: params.logradouro,
      numero: params.numero,
    }),
    signal: AbortSignal.timeout(90000),
  });

  const data = (await response.json().catch(() => ({}))) as
    PreverBuscaWorkerResponse & {
      message?: string;
    };

  if (!response.ok) {
    throw new Error(
      data.message ?? `Erro ao consultar worker-registro: ${response.status}`
    );
  }

  const previa = data.previa;

  if (!previa || !Array.isArray(previa.registros)) {
    throw new Error("Resposta inválida do worker-registro");
  }

  const registros = previa.registros
    .map(registro => ({
      indiceCadastral: String(registro.indiceCadastral ?? "").trim(),
      complemento: registro.complemento
        ? String(registro.complemento).trim()
        : null,
    }))
    .filter(registro => registro.indiceCadastral.length > 0);

  return {
    logradouro: previa.logradouro ?? params.logradouro,
    numero: previa.numero ?? params.numero,
    quantidadeRegistros: registros.length,
    registros,
  };
}
