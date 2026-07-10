type FonteDataEmail = {
  enderecoEmail?: string | null;
};

type FonteDataTelefone = {
  whatsApp?: boolean | null;
  operadora?: string | null;
  tipoTelefone?: string | null;
  telefoneComDDD?: string | null;
  telemarketingBloqueado?: boolean | null;
};

type FonteDataEndereco = {
  uf?: string | null;
  cep?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  numero?: string | null;
  logradouro?: string | null;
  complemento?: string | null;
};

type FonteDataPessoaFisicaBasicaRaw = {
  cpf?: string | null;
  nome?: string | null;
  sexo?: string | null;
  idade?: number | null;
  signo?: string | null;
  emails?: FonteDataEmail[];
  nomeMae?: string | null;
  enderecos?: FonteDataEndereco[];
  telefones?: FonteDataTelefone[];
  rendaEstimada?: string | null;
  dataNascimento?: string | null;
  rendaFaixaSalarial?: string | null;
};

export type FonteDataPessoaFisicaBasica = {
  nome: string | null;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  raw: FonteDataPessoaFisicaBasicaRaw;
};

type BuscarPessoaFisicaBasicaParams = {
  cpf: string;
};

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function getFonteDataBaseUrl() {
  return process.env.FONTEDATA_BASE_URL ?? "https://app.fontedata.com/api/v1";
}

function getFonteDataApiKey() {
  return process.env.FONTEDATA_API_KEY;
}

function isFonteDataEnabled() {
  return process.env.FONTEDATA_ENABLED !== "false";
}

function normalizarTelefone(raw: FonteDataPessoaFisicaBasicaRaw) {
  const telefones = raw.telefones ?? [];

  const telefoneWhatsapp = telefones.find(
    telefone => telefone.whatsApp && telefone.telefoneComDDD
  );

  if (telefoneWhatsapp?.telefoneComDDD) {
    return onlyNumbers(telefoneWhatsapp.telefoneComDDD);
  }

  const telefoneMovel = telefones.find(
    telefone =>
      telefone.tipoTelefone?.toLowerCase().includes("móvel") &&
      telefone.telefoneComDDD
  );

  if (telefoneMovel?.telefoneComDDD) {
    return onlyNumbers(telefoneMovel.telefoneComDDD);
  }

  const primeiroTelefone = telefones.find(telefone => telefone.telefoneComDDD);

  return primeiroTelefone?.telefoneComDDD
    ? onlyNumbers(primeiroTelefone.telefoneComDDD)
    : null;
}

function normalizarEmail(raw: FonteDataPessoaFisicaBasicaRaw) {
  const emails = raw.emails ?? [];

  const primeiroEmail = emails.find(email => email.enderecoEmail);

  return primeiroEmail?.enderecoEmail?.trim() ?? null;
}

function normalizarEndereco(raw: FonteDataPessoaFisicaBasicaRaw) {
  const enderecos = raw.enderecos ?? [];

  const primeiroEndereco = enderecos[0];

  if (!primeiroEndereco) {
    return null;
  }

  const partes = [
    primeiroEndereco.logradouro,
    primeiroEndereco.numero,
    primeiroEndereco.complemento,
    primeiroEndereco.bairro,
    primeiroEndereco.cidade,
    primeiroEndereco.uf,
    primeiroEndereco.cep,
  ].filter(Boolean);

  return partes.join(", ");
}

function normalizarRespostaFonteData(
  cpf: string,
  raw: FonteDataPessoaFisicaBasicaRaw
): FonteDataPessoaFisicaBasica {
  return {
    nome: raw.nome?.trim() ?? null,
    cpf: raw.cpf ? onlyNumbers(raw.cpf) : cpf,
    telefone: normalizarTelefone(raw),
    email: normalizarEmail(raw),
    endereco: normalizarEndereco(raw),
    raw,
  };
}

export async function buscarPessoaFisicaBasicaFonteData({
  cpf,
}: BuscarPessoaFisicaBasicaParams): Promise<FonteDataPessoaFisicaBasica | null> {
  if (!isFonteDataEnabled()) {
    return null;
  }

  const apiKey = getFonteDataApiKey();

  if (!apiKey) {
    throw new Error("FONTEDATA_API_KEY não configurada");
  }

  const cpfLimpo = onlyNumbers(cpf);

  if (cpfLimpo.length !== 11) {
    throw new Error("CPF inválido para consulta FonteData");
  }

  const baseUrl = getFonteDataBaseUrl().replace(/\/$/, "");

  const url = new URL(`${baseUrl}/consulta/cadastro-pf-basica`);

  url.searchParams.set("cpf", cpfLimpo);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
  });

  const raw = (await response
    .json()
    .catch(() => ({}))) as FonteDataPessoaFisicaBasicaRaw;

  if (!response.ok) {
    throw new Error(`Erro FonteData: ${response.status}`);
  }

  return normalizarRespostaFonteData(cpfLimpo, raw);
}