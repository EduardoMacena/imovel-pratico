import os from "node:os";

export type AtivarInstalacaoParams = {
  entrada: string;
  apiUrlFallback: string;
};

export type AtivarInstalacaoResponse = {
  apiUrl: string;
  cliente: {
    id: string;
    nome: string;
    slug: string;
  };
  agents: {
    registro?: {
      identificador: string;
      token: string;
    };
    cnd?: {
      identificador: string;
      token: string;
    };
  };
};

function extrairCodigoEApiUrl(entrada: string, apiUrlFallback: string) {
  const value = entrada.trim();

  if (!value) {
    throw new Error("Informe o link mágico ou código de instalação.");
  }

  try {
    const url = new URL(value);
    const code = url.searchParams.get("code");

    if (!code) {
      throw new Error("Link de instalação sem parâmetro code.");
    }

    return {
      code,
      apiUrl: url.origin,
    };
  } catch {
    return {
      code: value,
      apiUrl: apiUrlFallback.replace(/\/$/, ""),
    };
  }
}

export async function ativarInstalacaoAgent(
  params: AtivarInstalacaoParams
): Promise<AtivarInstalacaoResponse> {
  const { code, apiUrl } = extrairCodigoEApiUrl(
    params.entrada,
    params.apiUrlFallback
  );

  const response = await fetch(`${apiUrl}/api/agents/install/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      code,
      machineId: os.hostname(),
      hostname: os.hostname(),
      platform: process.platform,
      version: "0.1.0",
    }),
  });

  const text = await response.text();
  const data = text.trim() ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : `Erro HTTP ${response.status}`;

    throw new Error(message);
  }

  return data as AtivarInstalacaoResponse;
}
