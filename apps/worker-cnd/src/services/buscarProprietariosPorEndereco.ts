import {
	buscarIndiceCadastral,
	type ImovelEncontrado,
} from "./buscarIndiceCadastral.js";
import { buscarCpf, type ProprietarioEncontrado } from "./buscarCpf.js";
import {
	buscarImovelCacheValido,
	salvarImovelCache,
} from "./cache/imovel-cache.service.js";
import { buscarContatoPorCpf } from "./contatos/buscarContatoPorCpf.js";
import { prisma } from "@imovel-pratico/database";

type StatusResultado = "success" | "error";

export type ResultadoBuscaProprietario = {
	logradouro: string;
	numero: string;
	imovel: string;
	indiceCadastral: string;
	proprietario: ProprietarioEncontrado | null;
	telefone?: string | null;
	email?: string | null;
	fonteContato?: "FONTEDATA" | "INFOQUALY" | "NONE";
	dadosContato?: Record<string, unknown> | null;
	status: StatusResultado;
	fromCache?: boolean;
	error?: string;
};

type BuscarProprietariosParams = {
	logradouro: string;
	numero: string;
	mesAnoInicio: string;
	mesAnoFinal: string;
	intervaloSegundos: number;
	forceRefresh?: boolean;
	clienteId: string;
	onProgress?: (data: {
		total: number;
		current: number;
		item?: ResultadoBuscaProprietario;
		resultados: ResultadoBuscaProprietario[];
	}) => void | Promise<void>;
};

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function validarLimiteMensalAntesDeSalvarResultado(clienteId: string) {
	const inicioMes = new Date();
	inicioMes.setDate(1);
	inicioMes.setHours(0, 0, 0, 0);

	const fimMes = new Date(inicioMes);
	fimMes.setMonth(fimMes.getMonth() + 1);

	const cliente = await prisma.cliente.findUnique({
		where: {
			id: clienteId,
		},
		include: {
			plano: true,
		},
	});

	if (!cliente) {
		throw new Error("CLIENTE_NAO_ENCONTRADO");
	}

	if (!cliente.plano) {
		throw new Error("CLIENTE_SEM_PLANO");
	}

	const consultasUsadas = await prisma.tarefaResultado.count({
		where: {
			tarefa: {
				clienteId,
			},
			createdAt: {
				gte: inicioMes,
				lt: fimMes,
			},
		},
	});

	if (consultasUsadas >= cliente.plano.limiteMensalConsultas) {
		throw new Error("LIMITE_MENSAL_ATINGIDO");
	}
}

async function buscarProprietarioDoImovel(params: {
	imovel: ImovelEncontrado;
	logradouro: string;
	numero: string;
	mesAnoInicio: string;
	mesAnoFinal: string;
	forceRefresh?: boolean;
	clienteId: string;
}): Promise<ResultadoBuscaProprietario> {
	const {
		imovel,
		logradouro,
		numero,
		mesAnoInicio,
		mesAnoFinal,
		forceRefresh,
		clienteId,
	} = params;

	try {
		await validarLimiteMensalAntesDeSalvarResultado(clienteId);

		const cache = await buscarImovelCacheValido({
			indiceCadastral: imovel.indiceCadastral,
			forceRefresh,
		});

		if (cache) {
			const cacheValido = cache;

			let telefone = cache.telefone;
			let email = cache.email;
			let fonteContato: "FONTEDATA" | "INFOQUALY" | "NONE" = "NONE";

			let dadosContato = cacheValido.dadosContato as Record<
				string,
				unknown
			> | null;

			/**
			 * Se já temos CPF no cache, mas ainda não temos telefone/e-mail,
			 * tenta enriquecer pela FonteData.
			 */
			if (cacheValido.cpf && (!telefone || !email || !dadosContato)) {
				const contato = await buscarContatoPorCpf({
					cpf: cacheValido.cpf,
				});

				telefone = contato.telefone ?? telefone;
				email = contato.email ?? email;
				fonteContato = contato.fonte;
				dadosContato = contato.dadosContato ?? dadosContato;

				if (telefone || email) {
					await salvarImovelCache({
						logradouro: cacheValido.logradouro,
						numero: cacheValido.numero,
						complemento: cacheValido.complemento,
						indiceCadastral: cacheValido.indiceCadastral,
						nome: cacheValido.nome ?? contato.nome ?? null,
						cpf: cacheValido.cpf ?? contato.cpf ?? null,
						endereco: cacheValido.endereco ?? contato.endereco ?? null,
						telefone,
						email,
						fonteContato,
						dadosContato,
					});
				}
			}

			const proprietario = {
				nome: cacheValido.nome,
				cpf: cacheValido.cpf,
				endereco: cacheValido.endereco,
				indiceCadastral: cacheValido.indiceCadastral,
			} as ProprietarioEncontrado;

			return {
				logradouro,
				numero,
				imovel: imovel.imovel,
				indiceCadastral: imovel.indiceCadastral,
				proprietario,
				telefone,
				email,
				fonteContato,
				dadosContato,
				status: "success",
				fromCache: true,
			};
		}

		const proprietario = await buscarCpf({
			indiceCadastral: imovel.indiceCadastral,
			mesAnoInicio,
			mesAnoFinal,
		});

		const contato = await buscarContatoPorCpf({
			cpf: proprietario.cpf,
		});

		await salvarImovelCache({
			logradouro,
			numero,
			complemento: null,
			indiceCadastral: imovel.indiceCadastral,
			nome: proprietario.nome ?? null,
			cpf: proprietario.cpf ?? null,
			endereco: proprietario.endereco ?? null,
			telefone: contato.telefone,
			email: contato.email,
			fonteContato: contato.fonte,
			dadosContato: contato.dadosContato,
		});

		return {
			logradouro,
			numero,
			imovel: imovel.imovel,
			indiceCadastral: imovel.indiceCadastral,
			proprietario: {
				...proprietario,
				nome: proprietario.nome ?? contato.nome,
				cpf: proprietario.cpf ?? contato.cpf,
				endereco: proprietario.endereco ?? contato.endereco,
			},
			telefone: contato.telefone,
			email: contato.email,
			fonteContato: contato.fonte,
			dadosContato: contato.dadosContato,
			status: "success",
			fromCache: false,
		};
	} catch (error) {
		if (error instanceof Error && error.message === "LIMITE_MENSAL_ATINGIDO") {
			return {
				logradouro,
				numero,
				imovel: imovel.imovel,
				indiceCadastral: imovel.indiceCadastral,
				proprietario: null,
				status: "error",
				fromCache: false,
				error: "Limite mensal de consultas atingido durante o processamento",
			};
		}

		return {
			logradouro,
			numero,
			imovel: imovel.imovel,
			indiceCadastral: imovel.indiceCadastral,
			proprietario: null,
			status: "error",
			fromCache: false,
			error:
				error instanceof Error ? error.message : "Erro ao buscar proprietário",
		};
	}
}

export async function buscarProprietariosPorEndereco({
	logradouro,
	numero,
	mesAnoInicio,
	mesAnoFinal,
	intervaloSegundos,
	forceRefresh = false,
	clienteId,
	onProgress,
}: BuscarProprietariosParams) {
	const imoveis = await buscarIndiceCadastral(logradouro, numero);

	const resultados: ResultadoBuscaProprietario[] = [];
	const intervaloMs = intervaloSegundos * 1000;

	await onProgress?.({
		total: imoveis.length,
		current: 0,
		resultados,
	});

	for (let index = 0; index < imoveis.length; index++) {
		const imovel = imoveis[index];

		const item = await buscarProprietarioDoImovel({
			imovel,
			logradouro,
			numero,
			mesAnoInicio,
			mesAnoFinal,
			forceRefresh,
			clienteId,
		});

		resultados.push(item);

		await onProgress?.({
			total: imoveis.length,
			current: index + 1,
			item,
			resultados,
		});

		/**
		 * Se veio do cache, não precisa esperar intervalo da CND.
		 * O intervalo só é necessário quando houve consulta real na CND.
		 */
		const deveAguardarIntervalo = index < imoveis.length - 1 && !item.fromCache;

		if (deveAguardarIntervalo) {
			await sleep(intervaloMs);
		}
	}

	return {
		logradouro,
		numero,
		totalImoveis: imoveis.length,
		resultados,
	};
}
