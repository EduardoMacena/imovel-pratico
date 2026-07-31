import { Prisma, prisma } from "@imovel-pratico/database";
import { adicionarBuscaProprietariosNaFila } from "@imovel-pratico/queue";
import { buscarMunicipioPrincipalAtivoDoCliente } from "../municipios/cliente-municipio.service.js";
import type {
	BuscarProprietariosInput,
	PreverBuscaInput,
} from "./imovel.schemas.js";
import { buildCsv } from "../../utils/csv.js";
import { buildExcelBuffer } from "../../utils/excel.js";
import { preverBuscaNoWorkerRegistro } from "./registro-worker.client.js";
import {
	buildPdfResultadosProprietarios,
	montarLinhasResultadoExportacao,
} from "../../utils/exportacao-resultados.js";
import {
	calcularResumoExcedenteBusca,
	validarClientePodeCriarBusca,
} from "../assinatura/assinatura.service.js";

function getMesAnoInicioAtual() {
	const now = new Date();

	return `01/${now.getFullYear()}`;
}

function getMesAnoFinalAtual() {
	const now = new Date();
	const mes = String(now.getMonth() + 1).padStart(2, "0");

	return `${mes}/${now.getFullYear()}`;
}

function adicionarMinutos(date: Date, minutos: number) {
	const nextDate = new Date(date);

	nextDate.setMinutes(nextDate.getMinutes() + minutos);

	return nextDate;
}

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
	return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
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

function montarPreviaResponse(previa: {
	id: string;
	municipioId: string;
	tipoBusca: "ENDERECO" | "CODIGOS_CADASTRAIS";
	logradouro: string;
	numero: string;
	quantidadeRegistros: number;
	registros: unknown;
	expiraEm: Date;
}) {
	return {
		id: previa.id,
		municipioId: previa.municipioId,
		tipoBusca: previa.tipoBusca,
		logradouro: previa.logradouro,
		numero: previa.numero,
		quantidadeRegistros: previa.quantidadeRegistros,
		registros: normalizarRegistrosPrevia(previa.registros),
		expiraEm: previa.expiraEm,
	};
}

export async function preverBuscaProprietarios(
	clienteId: string,
  data: PreverBuscaInput,
) {
	const { cliente, plano, uso } = await validarClientePodeCriarBusca(clienteId);
	const municipio = await buscarMunicipioPrincipalAtivoDoCliente(clienteId);

	const workerUrl = cliente.workerUrl?.trim();

	if (!workerUrl) {
		throw new Error("Worker URL não configurada para este cliente");
	}

	const resultadoWorker = await preverBuscaNoWorkerRegistro({
		workerUrl,
		logradouro: data.logradouro,
		numero: data.numero,
	});

	const registros = resultadoWorker.registros;
	const quantidadeRegistros = registros.length;

	const excedente = calcularResumoExcedenteBusca({
		consultasEstimadas: quantidadeRegistros,
		consultasRestantes: uso.consultasRestantes,
		valorConsultaAdicionalCentavos: plano.valorConsultaAdicionalCentavos,
	});

	const previa = await prisma.buscaPrevia.create({
		data: {
			clienteId: cliente.id,
			municipioId: municipio.id,
			tipoBusca: "ENDERECO",
			status: "PENDENTE",
			logradouro: resultadoWorker.logradouro,
			numero: resultadoWorker.numero,
			quantidadeRegistros,
			registros: toPrismaJson(registros),
			consultasDisponiveisNoMomento: excedente.consultasDisponiveisNoMomento,
			consultasExcedentesEstimadas: excedente.consultasExcedentesEstimadas,
			valorConsultaAdicionalCentavos: excedente.valorConsultaAdicionalCentavos,
			valorExcedenteEstimadoCentavos: excedente.valorExcedenteEstimadoCentavos,
			workerUrl,
			expiraEm: adicionarMinutos(new Date(), 30),
		},
	});

	return {
		previa: montarPreviaResponse(previa),
		precisaConfirmarExcedente: excedente.consultasExcedentesEstimadas > 0,
		excedente,
		uso,
		plano: {
			id: plano.id,
			nome: plano.nome,
			limiteMensalConsultas: plano.limiteMensalConsultas,
			intervaloSegundos: plano.intervaloSegundos,
			precoCentavos: plano.precoCentavos,
			valorConsultaAdicionalCentavos: plano.valorConsultaAdicionalCentavos,
			limiteCorretores: plano.limiteCorretores,
		},
	};
}

export async function criarTarefaBuscaProprietarios(
	clienteId: string,
  data: BuscarProprietariosInput,
) {
	const { cliente, plano, uso } = await validarClientePodeCriarBusca(clienteId);

	const previa = await prisma.buscaPrevia.findFirst({
		where: {
			id: data.previaId,
			clienteId,
		},
	});

	if (!previa) {
		throw new Error("Prévia da busca não encontrada");
	}

	if (previa.status !== "PENDENTE") {
		throw new Error("Esta prévia não está mais disponível para confirmação");
	}

	if (previa.expiraEm < new Date()) {
		await prisma.buscaPrevia.update({
			where: {
				id: previa.id,
			},
			data: {
				status: "EXPIRADA",
			},
		});

		throw new Error("Esta prévia expirou. Faça uma nova busca.");
	}

  if (previa.quantidadeRegistros > uso.consultasRestantes) {
    throw new Error("Limite mensal de consultas do plano insuficiente");
	}

  const excedenteAutorizado = false;

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
      excedenteAutorizadoEm: null,
			consultasEstimadas: previa.quantidadeRegistros,
			consultasDisponiveisNoMomento: previa.consultasDisponiveisNoMomento,
			consultasExcedentesEstimadas: previa.consultasExcedentesEstimadas,
			valorConsultaAdicionalCentavos: previa.valorConsultaAdicionalCentavos,
			valorExcedenteEstimadoCentavos: previa.valorExcedenteEstimadoCentavos,
		},
	});

	await prisma.buscaPrevia.update({
		where: {
			id: previa.id,
		},
		data: {
			status: "CONFIRMADA",
			confirmadaEm: new Date(),
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
		jobId: job?.id ?? null,
		status: tarefa.status,
		message:
			cliente.modoProcessamento === "AGENT"
				? "Tarefa criada para processamento pelo Agent"
				: "Tarefa criada e adicionada na fila com sucesso",
		cliente: {
			id: cliente.id,
			nome: cliente.nome,
			slug: cliente.slug,
		},
		plano: {
			id: plano.id,
			nome: plano.nome,
			limiteMensalConsultas: plano.limiteMensalConsultas,
			intervaloSegundos: plano.intervaloSegundos,
			precoCentavos: plano.precoCentavos,
			valorConsultaAdicionalCentavos: plano.valorConsultaAdicionalCentavos,
			limiteCorretores: plano.limiteCorretores,
		},
		uso,
		previa: montarPreviaResponse(previa),
		tarefa: {
			id: tarefa.id,
			status: tarefa.status,
			municipioId: tarefa.municipioId,
			tipoBusca: tarefa.tipoBusca,
			logradouro: tarefa.logradouro,
			numero: tarefa.numero,
			mesAnoInicio: tarefa.mesAnoInicio,
			mesAnoFinal: tarefa.mesAnoFinal,
			intervaloSegundos: tarefa.intervaloSegundos,
			forceRefresh: tarefa.forceRefresh,
			buscaPreviaId: tarefa.buscaPreviaId,
			excedenteAutorizado: tarefa.excedenteAutorizado,
			excedenteAutorizadoEm: tarefa.excedenteAutorizadoEm,
			consultasEstimadas: tarefa.consultasEstimadas,
			consultasDisponiveisNoMomento: tarefa.consultasDisponiveisNoMomento,
			consultasExcedentesEstimadas: tarefa.consultasExcedentesEstimadas,
			valorConsultaAdicionalCentavos: tarefa.valorConsultaAdicionalCentavos,
			valorExcedenteEstimadoCentavos: tarefa.valorExcedenteEstimadoCentavos,
			createdAt: tarefa.createdAt,
		},
	};
}

export async function buscarTarefaPorId(clienteId: string, id: string) {
	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id,
			clienteId,
		},
		include: {
			cliente: {
				select: {
					id: true,
					nome: true,
					slug: true,
				},
			},
			resultados: true,
		},
	});

	return tarefa;
}

export async function buscarProgressoTarefaPorId(
	clienteId: string,
  id: string,
) {
	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id,
			clienteId,
		},
		include: {
			cliente: {
				select: {
					id: true,
					nome: true,
					slug: true,
				},
			},
			resultados: {
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	if (!tarefa) {
		return null;
	}

	const percentage =
		tarefa.total > 0 ? Math.round((tarefa.current / tarefa.total) * 100) : 0;

	return {
		id: tarefa.id,
		status: tarefa.status,
		tipoBusca: tarefa.tipoBusca,
		cliente: tarefa.cliente,
		endereco: {
			logradouro: tarefa.logradouro,
			numero: tarefa.numero,
		},
		periodo: {
			mesAnoInicio: tarefa.mesAnoInicio,
			mesAnoFinal: tarefa.mesAnoFinal,
		},
		progress: {
			total: tarefa.total,
			current: tarefa.current,
			percentage,
		},
		erro: tarefa.erro,
		resultados: tarefa.resultados.map((resultado) => ({
			id: resultado.id,
			status: resultado.status,
			logradouro: resultado.logradouro,
			numero: resultado.numero,
			complemento: resultado.complemento,
			indiceCadastral: resultado.indiceCadastral,
			proprietario: {
				nome: resultado.nome,
				cpf: resultado.cpf,
				endereco: resultado.endereco,
				telefone: resultado.telefone,
				email: resultado.email,
			},
			fonteContato: resultado.fonteContato,
			dadosContato: resultado.dadosContato,
			erro: resultado.erro,
			createdAt: resultado.createdAt,
		})),
		createdAt: tarefa.createdAt,
		startedAt: tarefa.startedAt,
		completedAt: tarefa.completedAt,
	};
}

export async function listarTarefasRecentes(clienteId: string) {
	const tarefas = await prisma.tarefa.findMany({
		where: {
			clienteId,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 50,
		include: {
			cliente: {
				select: {
					id: true,
					nome: true,
					slug: true,
				},
			},
			_count: {
				select: {
					resultados: true,
				},
			},
		},
	});

	return tarefas.map((tarefa) => {
		const percentage =
			tarefa.total > 0 ? Math.round((tarefa.current / tarefa.total) * 100) : 0;

		return {
			id: tarefa.id,
			status: tarefa.status,
			tipoBusca: tarefa.tipoBusca,
			cliente: tarefa.cliente,
			endereco: {
				logradouro: tarefa.logradouro,
				numero: tarefa.numero,
			},
			periodo: {
				mesAnoInicio: tarefa.mesAnoInicio,
				mesAnoFinal: tarefa.mesAnoFinal,
			},
			progress: {
				total: tarefa.total,
				current: tarefa.current,
				percentage,
			},
			totalResultados: tarefa._count.resultados,
			erro: tarefa.erro,
			createdAt: tarefa.createdAt,
			startedAt: tarefa.startedAt,
			completedAt: tarefa.completedAt,
		};
	});
}

export async function exportarResultadosTarefaCsv(
	clienteId: string,
  id: string,
) {
	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id,
			clienteId,
		},
		include: {
			cliente: {
				select: {
					nome: true,
					slug: true,
				},
			},
			resultados: {
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	if (!tarefa) {
		return null;
	}

	const rows = montarLinhasResultadoExportacao(tarefa);

	const csv = buildCsv(
		rows.length > 0
			? rows
			: [
					{
						mensagem: "Nenhum resultado encontrado para esta tarefa",
					},
        ],
	);

	return {
		filename: `proprietarios-${tarefa.cliente.slug}-${tarefa.id}.csv`,
		csv,
	};
}

export async function exportarResultadosTarefaExcel(
	clienteId: string,
  id: string,
) {
	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id,
			clienteId,
		},
		include: {
			cliente: {
				select: {
					nome: true,
					slug: true,
				},
			},
			resultados: {
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	if (!tarefa) {
		return null;
	}

	const rows =
		tarefa.resultados.length > 0
			? montarLinhasResultadoExportacao(tarefa)
			: [
					{
						mensagem: "Nenhum resultado encontrado para esta tarefa",
					},
				];

	const buffer = await buildExcelBuffer(rows, "Proprietarios");

	return {
		filename: `proprietarios-${tarefa.cliente.slug}-${tarefa.id}.xlsx`,
		buffer,
	};
}

export async function exportarResultadosTarefaPdf(
	clienteId: string,
  id: string,
) {
	const tarefa = await prisma.tarefa.findFirst({
		where: {
			id,
			clienteId,
		},
		include: {
			cliente: {
				select: {
					nome: true,
					slug: true,
				},
			},
			resultados: {
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	if (!tarefa) {
		return null;
	}

	const rows = montarLinhasResultadoExportacao(tarefa);
	const buffer = await buildPdfResultadosProprietarios({
		tarefa,
		rows,
	});

	return {
		filename: `proprietarios-${tarefa.cliente.slug}-${tarefa.id}.pdf`,
		buffer,
	};
}
