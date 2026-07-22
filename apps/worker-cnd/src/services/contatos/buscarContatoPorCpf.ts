import { buscarPessoaFisicaBasicaFonteData } from "../fontedata/buscarPessoaFisicaBasica.js";

export type ContatoEncontrado = {
  fonte: "FONTEDATA" | "INFOQUALY" | "NONE";
  nome: string | null;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  dadosContato: Record<string, unknown> | null;
};

type BuscarContatoPorCpfParams = {
  cpf: string | null | undefined;
};

function isFonteDataConfiguradaLocalmente() {
	const enabled = process.env.FONTEDATA_ENABLED?.trim();

	if (enabled && enabled !== "true") {
		return false;
	}

	return Boolean(process.env.FONTEDATA_API_KEY?.trim());
}

export async function buscarContatoPorCpf({
  cpf,
}: BuscarContatoPorCpfParams): Promise<ContatoEncontrado> {
  if (!cpf) {
    return {
      fonte: "NONE",
      nome: null,
      cpf: null,
      telefone: null,
      email: null,
      endereco: null,
      dadosContato: null,
    };
  }

  if (!isFonteDataConfiguradaLocalmente()) {
    return {
      fonte: "NONE",
      nome: null,
      cpf,
      telefone: null,
      email: null,
      endereco: null,
      dadosContato: null,
    };
  }

  try {
    const fonteData = await buscarPessoaFisicaBasicaFonteData({
      cpf,
    });

    if (fonteData) {
      return {
        fonte: "FONTEDATA",
        nome: fonteData.nome,
        cpf: fonteData.cpf,
        telefone: fonteData.telefone,
        email: fonteData.email,
        endereco: fonteData.endereco,
        dadosContato: fonteData.raw as Record<string, unknown>,
      };
    }
  } catch (error) {
    console.error(
      "Erro ao consultar FonteData:",
      error instanceof Error ? error.message : error
    );
  }

  return {
    fonte: "NONE",
    nome: null,
    cpf,
    telefone: null,
    email: null,
    endereco: null,
    dadosContato: null,
  };
}