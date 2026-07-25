import { Prisma, prisma } from "@imovel-pratico/database";

type BuscarCacheInput = {
	indiceCadastral: string;
	forceRefresh?: boolean;
};

type SalvarCacheInput = {
	logradouro: string;
	numero: string;
	complemento?: string | null;
	indiceCadastral: string;
	nome?: string | null;
	cpf?: string | null;
	endereco?: string | null;
	telefone?: string | null;
	email?: string | null;
	fonteContato?: string | null;
	dadosContato?: Record<string, unknown> | null;
};

function adicionarDias(date: Date, dias: number) {
	const nextDate = new Date(date);

	nextDate.setDate(nextDate.getDate() + dias);

	return nextDate;
}

function toPrismaJson(
  value: Record<string, unknown> | null | undefined
): Prisma.InputJsonValue | undefined {
  if (!value) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function buscarImovelCacheValido({
	indiceCadastral,
	forceRefresh,
}: BuscarCacheInput) {
	if (forceRefresh) {
		return null;
	}

	const cache = await prisma.imovelCache.findFirst({
		where: {
			indiceCadastral,
			status: "VALID",
			expiraEm: {
				gt: new Date(),
			},
		},
	});

	if (!cache) {
		return null;
	}

	return cache;
}

export async function salvarImovelCache({
	logradouro,
	numero,
	complemento,
	indiceCadastral,
	nome,
	cpf,
	endereco,
	telefone,
	email,
	fonteContato,
	dadosContato,
}: SalvarCacheInput) {
	const agora = new Date();

	return prisma.imovelCache.upsert({
		where: {
			indiceCadastral,
		},
		update: {
      logradouro,
      numero,
      complemento,
      nome,
      cpf,
      endereco,
      telefone,
      email,
      fonteContato,
      dadosContato: toPrismaJson(dadosContato),
      status: "VALID",
      ultimaConsultaEm: agora,
      expiraEm: adicionarDias(agora, 90),
    },
    create: {
      logradouro,
      numero,
      complemento,
      indiceCadastral,
      nome,
      cpf,
      endereco,
      telefone,
      email,
      fonteContato,
      dadosContato: toPrismaJson(dadosContato),
      status: "VALID",
      ultimaConsultaEm: agora,
      expiraEm: adicionarDias(agora, 90),
    },
	});
}
