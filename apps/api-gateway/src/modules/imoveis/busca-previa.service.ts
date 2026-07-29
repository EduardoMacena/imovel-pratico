import {
	Prisma,
	prisma,
	type BuscaPreviaStatus,
} from "@imovel-pratico/database";
import {
	adicionarBuscaProprietariosNaFila,
	adicionarBuscaRegistrosNaFila,
} from "@imovel-pratico/queue";
import { validarClientePodeCriarBusca } from "../assinatura/assinatura.service.js";
import { buscarMunicipioPrincipalAtivoDoCliente } from "../municipios/cliente-municipio.service.js";
import type {
	BuscarProprietariosInput,
	PreverBuscaCodigosInput,
	PreverBuscaInput,
} from "./imovel.schemas.js";
import { analisarCodigosCadastrais } from "./codigos-cadastrais.js";

const STATUS_PREVIAS_REAPROVEITAVEIS: BuscaPreviaStatus[] = [
	"PROCESSANDO",
	"AGUARDANDO_INTERVALO",
	"CONSULTANDO_REGISTRO",
	"PRONTA",
	"AGUARDANDO_AUTORIZACAO_EXCEDENTE",
];

const STATUS_PREVIAS_PENDENTES: BuscaPreviaStatus[] = [
	"PROCESSANDO",
	"AGUARDANDO_INTERVALO",
	"CONSULTANDO_REGISTRO",
	"PRONTA",
	"AGUARDANDO_AUTORIZACAO_EXCEDENTE",
];

const ROTULO_CODIGOS_LOGRADOURO = "CÓDIGOS CADASTRAIS";
const ROTULO_CODIGOS_NUMERO = "ENTRADA DIRETA";

function adicionarMinutos(date: Date, minutos: number) {
	const nextDate = new Date(date);

	nextDate.setMinutes(nextDate.getMinutes() + minutos);

	return nextDate;
}

function getMesAnoInicioAtual() {
	const now = new Date();

	return `01/${now.getFullYear()}`;
}

function getMesAnoFinalAtual() {
	const now = new Date();
	const mes = String(now.getMonth() + 1).padStart(2, "0");

	return `${mes}/${now.getFullYear()}`;
}

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
	return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function normalizarEndereco(value: string) {
	return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function normalizarRegistrosPrevia(value: unknown) {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((item) => {
			const registro = item as {
				indiceCadastral?: unknown;
				complemento?: unknown;
			};

			return {
				indiceCadastral:
					typeof registro.indiceCadastral === "string"
						? registro.indiceCadastral.trim()
						: "",
				complemento:
					typeof registro.complemento === "string"
						? registro.complemento.trim() || null
						: null,
			};
		})
		.filter((registro) => registro.indiceCadastral.length > 0);
}

function calcularResumoExcedente(params: {
	consultasEstimadas: number;
	consultasRestantes: number;
	valorConsultaAdicionalCentavos: number;
}) {
	const consultasDisponiveisNoMomento = Math.max(params.consultasRestantes, 0);

	const consultasExcedentesEstimadas = Math.max(
		params.consultasEstimadas - consultasDisponiveisNoMomento,
		0
	);

	const valorExcedenteEstimadoCentavos =
		consultasExcedentesEstimadas * params.valorConsultaAdicionalCentavos;

	return {
		consultasEstimadas: params.consultasEstimadas,
		consultasDisponiveisNoMomento,
		consultasExcedentesEstimadas,
		valorConsultaAdicionalCentavos: params.valorConsultaAdicionalCentavos,
		valorExcedenteEstimadoCentavos,
	};
}

function montarPreviaResponse(
	previa: {
		id: string;
		status: string;
		municipioId: string;
		tipoBusca: "ENDERECO" | "CODIGOS_CADASTRAIS";
		logradouro: string;
		numero: string;
		quantidadeRegistros: number;
		registros: unknown;
		consultasDisponiveisNoMomento: number;
		consultasExcedentesEstimadas: number;
		valorConsultaAdicionalCentavos: number;
		valorExcedenteEstimadoCentavos: number;
		erro: string | null;
		expiraEm: Date;
		confirmadaEm: Date | null;
		createdAt: Date;
		updatedAt: Date;
	},
	extras?: {
		uso?: unknown;
		excedente?: ReturnType<typeof calcularResumoExcedente>;
	}
) {
	const registros = normalizarRegistrosPrevia(previa.registros);

	const excedente = extras?.excedente ?? {
		consultasEstimadas: previa.quantidadeRegistros,
		consultasDisponiveisNoMomento: previa.consultasDisponiveisNoMomento,
		consultasExcedentesEstimadas: previa.consultasExcedentesEstimadas,
		valorConsultaAdicionalCentavos: previa.valorConsultaAdicionalCentavos,
		valorExcedenteEstimadoCentavos: previa.valorExcedenteEstimadoCentavos,
	};

	return {
		previa: {
			id: previa.id,
			status: previa.status,
			municipioId: previa.municipioId,
			tipoBusca: previa.tipoBusca,
			logradouro: previa.logradouro,
			numero: previa.numero,
			quantidadeRegistros: previa.quantidadeRegistros,
			registros,
			erro: previa.erro,
			expiraEm: previa.expiraEm,
			confirmadaEm: previa.confirmadaEm,
			createdAt: previa.createdAt,
			updatedAt: previa.updatedAt,
		},
		precisaConfirmarExcedente: excedente.consultasExcedentesEstimadas > 0,
		excedente,
		uso: extras?.uso,
	};
}

async function recalcularPrevia(clienteId: string, previaId: string) {
	const previa = await prisma.buscaPrevia.findFirst({
		where: {
			id: previaId,
			clienteId,
		},
	});

	if (!previa) {
		return null;
	}

	if (
		previa.expiraEm < new Date() &&
		!["CONFIRMADA", "CANCELADA", "EXPIRADA", "ERRO"].includes(previa.status)
	) {
		const expirada = await prisma.buscaPrevia.update({
			where: {
				id: previa.id,
			},
			data: {
				status: "EXPIRADA",
			},
		});

		return montarPreviaResponse(expirada);
	}

	if (!["PRONTA", "AGUARDANDO_AUTORIZACAO_EXCEDENTE"].includes(previa.status)) {
		return montarPreviaResponse(previa);
	}

	const { plano, uso } = await validarClientePodeCriarBusca(clienteId);

	const planoComercial = plano as typeof plano & {
		valorConsultaAdicionalCentavos?: number;
	};

	const excedente = calcularResumoExcedente({
		consultasEstimadas: previa.quantidadeRegistros,
		consultasRestantes: uso.consultasRestantes,
		valorConsultaAdicionalCentavos:
			planoComercial.valorConsultaAdicionalCentavos ?? 0,
	});

	const statusCalculado =
		excedente.consultasExcedentesEstimadas > 0
			? "AGUARDANDO_AUTORIZACAO_EXCEDENTE"
			: "PRONTA";

	const atualizada = await prisma.buscaPrevia.update({
		where: {
			id: previa.id,
		},
		data: {
			status: statusCalculado,
			consultasDisponiveisNoMomento: excedente.consultasDisponiveisNoMomento,
			consultasExcedentesEstimadas: excedente.consultasExcedentesEstimadas,
			valorConsultaAdicionalCentavos: excedente.valorConsultaAdicionalCentavos,
			valorExcedenteEstimadoCentavos: excedente.valorExcedenteEstimadoCentavos,
		},
	});

	return montarPreviaResponse(atualizada, {
		uso,
		excedente,
	});
}

export async function criarPreviaBusca(
	clienteId: string,
	data: PreverBuscaInput
) {
	const { cliente } = await validarClientePodeCriarBusca(clienteId);
	const municipio = await buscarMunicipioPrincipalAtivoDoCliente(clienteId);

	const logradouro = normalizarEndereco(data.logradouro);
	const numero = data.numero.trim();

	const existente = await prisma.buscaPrevia.findFirst({
		where: {
			clienteId,
			municipioId: municipio.id,
			tipoBusca: "ENDERECO",
			logradouro,
			numero,
			status: {
				in: STATUS_PREVIAS_REAPROVEITAVEIS,
			},
			expiraEm: {
				gt: new Date(),
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (existente) {
		return recalcularPrevia(clienteId, existente.id);
	}

	const previa = await prisma.buscaPrevia.create({
		data: {
			clienteId,
			municipioId: municipio.id,
			tipoBusca: "ENDERECO",
			status: "PROCESSANDO",
			logradouro,
			numero,
			quantidadeRegistros: 0,
			registros: toPrismaJson([]),
			consultasDisponiveisNoMomento: 0,
			consultasExcedentesEstimadas: 0,
			valorConsultaAdicionalCentavos: 0,
			valorExcedenteEstimadoCentavos: 0,
			expiraEm: adicionarMinutos(new Date(), 60),
		},
	});

	if (cliente.modoProcessamento === "QUEUE") {
		await adicionarBuscaRegistrosNaFila({
			buscaPreviaId: previa.id,
			clienteId,
			municipioId: previa.municipioId,
			logradouro,
			numero,
		});
	}

	return montarPreviaResponse(previa);
}

export async function criarPreviaBuscaPorCodigos(
	clienteId: string,
	data: PreverBuscaCodigosInput
) {
	const { plano, uso } = await validarClientePodeCriarBusca(clienteId);
	const municipio = await buscarMunicipioPrincipalAtivoDoCliente(clienteId);
	const validacaoCodigos = analisarCodigosCadastrais(data.codigos);

	if (validacaoCodigos.totalValidos <= 0) {
		throw new Error("Nenhum código cadastral válido foi informado");
	}

	const excedente = calcularResumoExcedente({
		consultasEstimadas: validacaoCodigos.totalValidos,
		consultasRestantes: uso.consultasRestantes,
		valorConsultaAdicionalCentavos:
			plano.valorConsultaAdicionalCentavos ?? 0,
	});

	const status =
		excedente.consultasExcedentesEstimadas > 0
			? "AGUARDANDO_AUTORIZACAO_EXCEDENTE"
			: "PRONTA";

	const registros = validacaoCodigos.codigosValidos.map(
		(indiceCadastral) => ({
			indiceCadastral,
			complemento: null,
		})
	);

	const previa = await prisma.buscaPrevia.create({
		data: {
			clienteId,
			municipioId: municipio.id,
			tipoBusca: "CODIGOS_CADASTRAIS",
			status,
			logradouro: ROTULO_CODIGOS_LOGRADOURO,
			numero: ROTULO_CODIGOS_NUMERO,
			quantidadeRegistros: registros.length,
			registros: toPrismaJson(registros),
			consultasDisponiveisNoMomento:
				excedente.consultasDisponiveisNoMomento,
			consultasExcedentesEstimadas:
				excedente.consultasExcedentesEstimadas,
			valorConsultaAdicionalCentavos:
				excedente.valorConsultaAdicionalCentavos,
			valorExcedenteEstimadoCentavos:
				excedente.valorExcedenteEstimadoCentavos,
			expiraEm: adicionarMinutos(new Date(), 60),
		},
	});

	await prisma.operacaoEvento.create({
		data: {
			clienteId,
			buscaPreviaId: previa.id,
			servico: "API_GATEWAY",
			tipo: "BUSCA_PREVIA_CODIGOS_CRIADA",
			mensagem: "Prévia criada diretamente por códigos cadastrais",
			metadata: toPrismaJson({
				municipioId: municipio.id,
				totalRecebidos: validacaoCodigos.totalRecebidos,
				totalValidos: validacaoCodigos.totalValidos,
				totalDuplicados: validacaoCodigos.totalDuplicados,
				totalInvalidos: validacaoCodigos.totalInvalidos,
			}),
		},
	});

	return {
		...montarPreviaResponse(previa, {
			uso,
			excedente,
		}),
		validacaoCodigos,
	};
}

export async function buscarPreviaBusca(clienteId: string, previaId: string) {
	return recalcularPrevia(clienteId, previaId);
}

export async function listarPreviasPendentes(clienteId: string) {
	const previas = await prisma.buscaPrevia.findMany({
		where: {
			clienteId,
			status: {
				in: STATUS_PREVIAS_PENDENTES,
			},
			expiraEm: {
				gt: new Date(),
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 20,
	});

	const recalculadas = await Promise.all(
		previas.map((previa) => recalcularPrevia(clienteId, previa.id))
	);

	return recalculadas.filter(Boolean);
}

export async function cancelarPreviaBusca(clienteId: string, previaId: string) {
	const previa = await prisma.buscaPrevia.findFirst({
		where: {
			id: previaId,
			clienteId,
		},
	});

	if (!previa) {
		return null;
	}

	if (["CONFIRMADA", "CANCELADA", "EXPIRADA"].includes(previa.status)) {
		return montarPreviaResponse(previa);
	}

	const cancelada = await prisma.buscaPrevia.update({
		where: {
			id: previa.id,
		},
		data: {
			status: "CANCELADA",
		},
	});

	return montarPreviaResponse(cancelada);
}

export async function confirmarPreviaECriarTarefa(
	clienteId: string,
	data: BuscarProprietariosInput
) {
	const claim = await prisma.buscaPrevia.updateMany({
		where: {
			id: data.previaId,
			clienteId,
			status: {
				in: ["PRONTA", "AGUARDANDO_AUTORIZACAO_EXCEDENTE"],
			},
			expiraEm: {
				gt: new Date(),
			},
		},
		data: {
			status: "AUTORIZANDO",
		},
	});

	if (claim.count === 0) {
		const atual = await recalcularPrevia(clienteId, data.previaId);

		if (atual) {
			return {
				...atual,
				precisaConfirmarExcedente: false,
				message:
					"Esta prévia ainda não está pronta, já foi processada ou está em autorização.",
			};
		}

		throw new Error("Prévia não encontrada");
	}

	try {
		const previa = await prisma.buscaPrevia.findFirst({
			where: {
				id: data.previaId,
				clienteId,
			},
		});

		if (!previa) {
			throw new Error("Prévia não encontrada");
		}

		const registros = normalizarRegistrosPrevia(previa.registros);

		if (registros.length <= 0) {
			await prisma.buscaPrevia.update({
				where: {
					id: previa.id,
				},
				data: {
					status: "PRONTA",
				},
			});

			throw new Error("Prévia sem registros para processar");
		}

		const { cliente, plano, uso } =
			await validarClientePodeCriarBusca(clienteId);

		const planoComercial = plano as typeof plano & {
			valorConsultaAdicionalCentavos?: number;
			limiteCorretores?: number | null;
		};

		const excedente = calcularResumoExcedente({
			consultasEstimadas: previa.quantidadeRegistros,
			consultasRestantes: uso.consultasRestantes,
			valorConsultaAdicionalCentavos:
				planoComercial.valorConsultaAdicionalCentavos ?? 0,
		});

		if (
			excedente.consultasExcedentesEstimadas > 0 &&
			!data.confirmarExcedente
		) {
			const aguardando = await prisma.buscaPrevia.update({
				where: {
					id: previa.id,
				},
				data: {
					status: "AGUARDANDO_AUTORIZACAO_EXCEDENTE",
					consultasDisponiveisNoMomento:
						excedente.consultasDisponiveisNoMomento,
					consultasExcedentesEstimadas: excedente.consultasExcedentesEstimadas,
					valorConsultaAdicionalCentavos:
						excedente.valorConsultaAdicionalCentavos,
					valorExcedenteEstimadoCentavos:
						excedente.valorExcedenteEstimadoCentavos,
				},
			});

			return {
				...montarPreviaResponse(aguardando, {
					uso,
					excedente,
				}),
				precisaConfirmarExcedente: true,
				message:
					"Esta busca possui consultas excedentes. Confirme individualmente para criar a tarefa.",
			};
		}

		const excedenteAutorizado = excedente.consultasExcedentesEstimadas > 0;

		const tarefa = await prisma.tarefa.create({
			data: {
				clienteId: cliente.id,
				municipioId: previa.municipioId,
				tipoBusca: previa.tipoBusca,
				buscaPreviaId: previa.id,
				status: "PENDING",
				logradouro: previa.logradouro,
				numero: previa.numero,
				mesAnoInicio: getMesAnoInicioAtual(),
				mesAnoFinal: getMesAnoFinalAtual(),
				intervaloSegundos: plano.intervaloSegundos,
				forceRefresh: data.forceRefresh,
				excedenteAutorizado,
				excedenteAutorizadoEm: excedenteAutorizado ? new Date() : null,
				consultasEstimadas: previa.quantidadeRegistros,
				consultasDisponiveisNoMomento: excedente.consultasDisponiveisNoMomento,
				consultasExcedentesEstimadas: excedente.consultasExcedentesEstimadas,
				valorConsultaAdicionalCentavos:
					excedente.valorConsultaAdicionalCentavos,
				valorExcedenteEstimadoCentavos:
					excedente.valorExcedenteEstimadoCentavos,
			} as any,
		});

		const confirmada = await prisma.buscaPrevia.update({
			where: {
				id: previa.id,
			},
			data: {
				status: "CONFIRMADA",
				confirmadaEm: new Date(),
				consultasDisponiveisNoMomento: excedente.consultasDisponiveisNoMomento,
				consultasExcedentesEstimadas: excedente.consultasExcedentesEstimadas,
				valorConsultaAdicionalCentavos:
					excedente.valorConsultaAdicionalCentavos,
				valorExcedenteEstimadoCentavos:
					excedente.valorExcedenteEstimadoCentavos,
			},
		});

		const job =
			cliente.modoProcessamento === "QUEUE"
				? await adicionarBuscaProprietariosNaFila({
						tarefaId: tarefa.id,
						clienteId: cliente.id,
						municipioId: tarefa.municipioId,
						tipoBusca: tarefa.tipoBusca,
						buscaPreviaId: previa.id,
						logradouro: tarefa.logradouro,
						numero: tarefa.numero,
						mesAnoInicio: tarefa.mesAnoInicio,
						mesAnoFinal: tarefa.mesAnoFinal,
						intervaloSegundos: tarefa.intervaloSegundos,
						forceRefresh: tarefa.forceRefresh,
					})
				: null;

		return {
			...montarPreviaResponse(confirmada, {
				uso,
				excedente,
			}),
			precisaConfirmarExcedente: false,
			jobId: job?.id ?? null,
			status: tarefa.status,
			message:
				cliente.modoProcessamento === "AGENT"
					? "Tarefa criada para processamento pelo Agent"
					: "Tarefa criada e adicionada na fila com sucesso",
			tarefa: {
				id: tarefa.id,
				status: tarefa.status,
				municipioId: tarefa.municipioId,
				tipoBusca: tarefa.tipoBusca,
				buscaPreviaId: previa.id,
			},
		};
	} catch (error) {
		await prisma.buscaPrevia.updateMany({
			where: {
				id: data.previaId,
				clienteId,
				status: "AUTORIZANDO",
			},
			data: {
				status: "AGUARDANDO_AUTORIZACAO_EXCEDENTE",
				erro:
					error instanceof Error ? error.message : "Erro ao autorizar prévia",
			},
		});

		throw error;
	}
}
