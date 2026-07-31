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
import { validarSaldoPlanoFixo } from "../assinatura/plano-fixo.js";
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

function montarLimitePrevia(
  previa: {
    status: string;
    quantidadeRegistros: number;
    consultasDisponiveisNoMomento: number;
  },
  uso?: {
    consultasUsadas: number;
    limiteMensal: number;
	consultasRestantes: number;
    fimMes?: Date | string;
  },
) {
  const consultasSolicitadas = Math.max(previa.quantidadeRegistros, 0);
  const consultasRestantes = Math.max(
    uso?.consultasRestantes ?? previa.consultasDisponiveisNoMomento,
    0,
  );
  const consultasUsadas = Math.max(
    uso?.consultasUsadas ??
      Math.max(
        (uso?.limiteMensal ?? consultasRestantes) - consultasRestantes,
        0,
      ),
    0,
  );
  const limiteMensalConsultas = Math.max(
    uso?.limiteMensal ?? consultasUsadas + consultasRestantes,
    0,
	);
  const podeConfirmar =
    previa.status === "PRONTA" &&
    consultasSolicitadas > 0 &&
    consultasSolicitadas <= consultasRestantes;

	return {
    limiteMensalConsultas,
    consultasUsadas,
    consultasRestantes,
    consultasSolicitadas,
    consultasRestantesAposReserva: Math.max(
      consultasRestantes - consultasSolicitadas,
      0,
    ),
    podeConfirmar,
    renovacaoEm: uso?.fimMes ?? null,
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
		erro: string | null;
		expiraEm: Date;
		confirmadaEm: Date | null;
		createdAt: Date;
		updatedAt: Date;
	},
	extras?: {
    uso?: {
      consultasUsadas: number;
      limiteMensal: number;
      consultasRestantes: number;
      totalEstimadoCentavos: number;
      percentualUsado: number;
      fimMes?: Date | string;
    };
  },
) {
	const registros = normalizarRegistrosPrevia(previa.registros);

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
    limite: montarLimitePrevia(previa, extras?.uso),
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

	const autorizacaoAntiga =
    previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE";

	const autorizacaoTravada =
		previa.status === "AUTORIZANDO" &&
    previa.updatedAt.getTime() < Date.now() - 5 * 60 * 1000;

	if (autorizacaoAntiga || autorizacaoTravada) {
		const pronta = await prisma.buscaPrevia.update({
			where: {
				id: previa.id,
			},
			data: {
				status: "PRONTA",
				consultasExcedentesEstimadas: 0,
				valorConsultaAdicionalCentavos: 0,
				valorExcedenteEstimadoCentavos: 0,
			},
		});

    return recalcularPrevia(clienteId, pronta.id);
	}

	if (previa.status !== "PRONTA") {
		return montarPreviaResponse(previa);
	}

  const { uso } = await validarClientePodeCriarBusca(clienteId);

  const limite = montarLimitePrevia(previa, uso);

	const atualizada = await prisma.buscaPrevia.update({
		where: {
			id: previa.id,
		},
		data: {
			status: "PRONTA",
      consultasDisponiveisNoMomento: limite.consultasRestantes,
			consultasExcedentesEstimadas: 0,
			valorConsultaAdicionalCentavos: 0,
			valorExcedenteEstimadoCentavos: 0,
		},
	});

	return montarPreviaResponse(atualizada, {
		uso,
	});
}

export async function criarPreviaBusca(
	clienteId: string,
  data: PreverBuscaInput,
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
  data: PreverBuscaCodigosInput,
) {
  const { uso } = await validarClientePodeCriarBusca(clienteId);
	const municipio = await buscarMunicipioPrincipalAtivoDoCliente(clienteId);
	const validacaoCodigos = analisarCodigosCadastrais(data.codigos);

	if (validacaoCodigos.totalValidos <= 0) {
		throw new Error("Nenhum código cadastral válido foi informado");
	}

  const status = "PRONTA";

  const registros = validacaoCodigos.codigosValidos.map((indiceCadastral) => ({
			indiceCadastral,
			complemento: null,
  }));

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
      consultasDisponiveisNoMomento: uso.consultasRestantes,
      consultasExcedentesEstimadas: 0,
      valorConsultaAdicionalCentavos: 0,
      valorExcedenteEstimadoCentavos: 0,
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
    previas.map((previa) => recalcularPrevia(clienteId, previa.id)),
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
  data: BuscarProprietariosInput,
) {
	let tarefaCriadaId: string | null = null;

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
        message: "Esta prévia ainda não está pronta ou já foi processada.",
			};
		}

		throw new Error("Prévia não encontrada");
	}

	try {
    const resultado = await prisma.$transaction(async (tx) => {
      const clienteBloqueado = await tx.$queryRaw<Array<{ id: string }>>`
						SELECT "id"
						FROM "clientes"
						WHERE "id" = ${clienteId}
						FOR UPDATE
					`;

				if (clienteBloqueado.length !== 1) {
        throw new Error("Cliente não encontrado");
				}

				const previa = await tx.buscaPrevia.findFirst({
					where: {
						id: data.previaId,
						clienteId,
						status: "AUTORIZANDO",
					},
				});

				if (!previa) {
        throw new Error("Prévia não encontrada");
				}

      const registros = normalizarRegistrosPrevia(previa.registros);

				if (registros.length <= 0) {
        throw new Error("Prévia sem registros para processar");
				}

      const { cliente, plano, uso } = await validarClientePodeCriarBusca(
						clienteId,
        tx,
					);

      const consultasSolicitadas = registros.length;

      const limite = validarSaldoPlanoFixo({
        limiteMensalConsultas: plano.limiteMensalConsultas,
        consultasUsadas: uso.consultasUsadas,
						consultasSolicitadas,
						renovacaoEm: uso.fimMes,
					});

				const tarefa = await tx.tarefa.create({
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
						excedenteAutorizado: false,
						excedenteAutorizadoEm: null,
          consultasEstimadas: consultasSolicitadas,
          consultasDisponiveisNoMomento: limite.consultasRestantes,
						consultasExcedentesEstimadas: 0,
						valorConsultaAdicionalCentavos: 0,
						valorExcedenteEstimadoCentavos: 0,
					},
				});

      const confirmada = await tx.buscaPrevia.update({
						where: {
							id: previa.id,
						},
						data: {
							status: "CONFIRMADA",
							confirmadaEm: new Date(),
          quantidadeRegistros: consultasSolicitadas,
          consultasDisponiveisNoMomento: limite.consultasRestantes,
							consultasExcedentesEstimadas: 0,
							valorConsultaAdicionalCentavos: 0,
							valorExcedenteEstimadoCentavos: 0,
						},
					});

				return {
					cliente,
					plano,
					uso,
					limite,
					tarefa,
					confirmada,
				};
    });

		tarefaCriadaId = resultado.tarefa.id;

		const job =
      resultado.cliente.modoProcessamento === "QUEUE"
				? await adicionarBuscaProprietariosNaFila({
            tarefaId: resultado.tarefa.id,
            clienteId: resultado.cliente.id,
            municipioId: resultado.tarefa.municipioId,
            tipoBusca: resultado.tarefa.tipoBusca,
            buscaPreviaId: resultado.confirmada.id,
            logradouro: resultado.tarefa.logradouro,
            numero: resultado.tarefa.numero,
            mesAnoInicio: resultado.tarefa.mesAnoInicio,
            mesAnoFinal: resultado.tarefa.mesAnoFinal,
            intervaloSegundos: resultado.tarefa.intervaloSegundos,
            forceRefresh: resultado.tarefa.forceRefresh,
					})
				: null;

		return {
      ...montarPreviaResponse(resultado.confirmada, {
					uso: resultado.uso,
      }),
			jobId: job?.id ?? null,
			status: resultado.tarefa.status,
			limite: resultado.limite,
			tarefa: {
				id: resultado.tarefa.id,
				status: resultado.tarefa.status,
				municipioId: resultado.tarefa.municipioId,
				tipoBusca: resultado.tarefa.tipoBusca,
				buscaPreviaId: resultado.confirmada.id,
			},
			message:
        resultado.cliente.modoProcessamento === "AGENT"
					? "Tarefa criada para processamento pelo Agent"
					: "Tarefa criada e adicionada na fila com sucesso",
		};
	} catch (error) {
		const mensagemErro =
      error instanceof Error ? error.message : "Erro ao confirmar a busca";

		if (tarefaCriadaId) {
			await prisma.tarefa.updateMany({
				where: {
					id: tarefaCriadaId,
					clienteId,
					status: "PENDING",
				},
				data: {
					status: "ERROR",
					erro: mensagemErro,
				},
			});
		} else {
			await prisma.buscaPrevia.updateMany({
				where: {
					id: data.previaId,
					clienteId,
					status: "AUTORIZANDO",
				},
				data: {
					status: "PRONTA",
					consultasExcedentesEstimadas: 0,
					valorConsultaAdicionalCentavos: 0,
					valorExcedenteEstimadoCentavos: 0,
				},
			});
		}

		throw error;
	}
}
