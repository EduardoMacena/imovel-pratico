import { prisma } from "@imovel-pratico/database";
import { adicionarBuscaProprietariosNaFila } from "@imovel-pratico/queue";
import type { BuscarProprietariosInput } from "./imovel.schemas.js";
import { buildCsv } from "../../utils/csv.js";
import { buildExcelBuffer } from "../../utils/excel.js";
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

export async function criarTarefaBuscaProprietarios(
  clienteId: string,
  data: BuscarProprietariosInput
) {
  const { cliente, plano, uso } = await validarClientePodeCriarBusca(clienteId);

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  const excedente = calcularResumoExcedenteBusca({
    consultasEstimadas: data.consultasEstimadas,
    consultasRestantes: uso.consultasRestantes,
    valorConsultaAdicionalCentavos: plano.valorConsultaAdicionalCentavos,
  });

  if (
    excedente.consultasExcedentesEstimadas > 0 &&
    !data.confirmarExcedente
  ) {
    return {
      precisaConfirmarExcedente: true,
      message:
        "Esta busca pode ultrapassar o limite de consultas inclusas do seu plano.",
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
      excedente,
    };
  }

  const tarefa = await prisma.tarefa.create({
    data: {
      clienteId: cliente.id,
      status: "PENDING",
      logradouro: data.logradouro,
      numero: data.numero,
      mesAnoInicio: getMesAnoInicioAtual(),
      mesAnoFinal: getMesAnoFinalAtual(),
      intervaloSegundos: plano.intervaloSegundos,
      forceRefresh: data.forceRefresh,
      excedenteAutorizado: excedente.consultasExcedentesEstimadas > 0,
      excedenteAutorizadoEm:
        excedente.consultasExcedentesEstimadas > 0 ? new Date() : null,
      consultasEstimadas: excedente.consultasEstimadas,
      consultasDisponiveisNoMomento:
        excedente.consultasDisponiveisNoMomento,
      consultasExcedentesEstimadas:
        excedente.consultasExcedentesEstimadas,
      valorConsultaAdicionalCentavos:
        excedente.valorConsultaAdicionalCentavos,
      valorExcedenteEstimadoCentavos:
        excedente.valorExcedenteEstimadoCentavos,
    },
  });

  const job = await adicionarBuscaProprietariosNaFila({
    tarefaId: tarefa.id,
    clienteId: cliente.id,
    logradouro: tarefa.logradouro,
    numero: tarefa.numero,
    mesAnoInicio: tarefa.mesAnoInicio,
    mesAnoFinal: tarefa.mesAnoFinal,
    intervaloSegundos: tarefa.intervaloSegundos,
    forceRefresh: tarefa.forceRefresh,
  });

  return {
    precisaConfirmarExcedente: false,
    jobId: job.id,
    status: tarefa.status,
    message: "Tarefa criada e adicionada na fila com sucesso",
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
    excedente,
    tarefa: {
      id: tarefa.id,
      status: tarefa.status,
      logradouro: tarefa.logradouro,
      numero: tarefa.numero,
      mesAnoInicio: tarefa.mesAnoInicio,
      mesAnoFinal: tarefa.mesAnoFinal,
      intervaloSegundos: tarefa.intervaloSegundos,
      forceRefresh: tarefa.forceRefresh,
      excedenteAutorizado: tarefa.excedenteAutorizado,
      excedenteAutorizadoEm: tarefa.excedenteAutorizadoEm,
      consultasEstimadas: tarefa.consultasEstimadas,
      consultasDisponiveisNoMomento:
        tarefa.consultasDisponiveisNoMomento,
      consultasExcedentesEstimadas:
        tarefa.consultasExcedentesEstimadas,
      valorConsultaAdicionalCentavos:
        tarefa.valorConsultaAdicionalCentavos,
      valorExcedenteEstimadoCentavos:
        tarefa.valorExcedenteEstimadoCentavos,
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
	id: string
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
					slug: true
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
		excedente: {
			autorizado: tarefa.excedenteAutorizado,
			autorizadoEm: tarefa.excedenteAutorizadoEm,
			consultasEstimadas: tarefa.consultasEstimadas,
			consultasDisponiveisNoMomento:
				tarefa.consultasDisponiveisNoMomento,
			consultasExcedentesEstimadas:
				tarefa.consultasExcedentesEstimadas,
			valorConsultaAdicionalCentavos:
				tarefa.valorConsultaAdicionalCentavos,
			valorExcedenteEstimadoCentavos:
				tarefa.valorExcedenteEstimadoCentavos,
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
	id: string
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

	const rows = tarefa.resultados.map((resultado) => ({
		cliente: tarefa.cliente.nome,
		tarefaId: tarefa.id,
		statusTarefa: tarefa.status,
		logradouroBusca: tarefa.logradouro,
		numeroBusca: tarefa.numero,
		mesAnoInicio: tarefa.mesAnoInicio,
		mesAnoFinal: tarefa.mesAnoFinal,
		statusResultado: resultado.status,
		indiceCadastral: resultado.indiceCadastral,
		logradouro: resultado.logradouro,
		numero: resultado.numero,
		complemento: resultado.complemento,
		nome: resultado.nome,
		cpf: resultado.cpf,
		endereco: resultado.endereco,
		telefone: resultado.telefone,
		email: resultado.email,
		fonteContato: resultado.fonteContato,
		sexo: (resultado.dadosContato as any)?.sexo,
		idade: (resultado.dadosContato as any)?.idade,
		signo: (resultado.dadosContato as any)?.signo,
		nomeMae: (resultado.dadosContato as any)?.nomeMae,
		dataNascimento: (resultado.dadosContato as any)?.dataNascimento,
		rendaEstimada: (resultado.dadosContato as any)?.rendaEstimada,
		rendaFaixaSalarial: (resultado.dadosContato as any)?.rendaFaixaSalarial,
		telefones: JSON.stringify((resultado.dadosContato as any)?.telefones ?? []),
		emails: JSON.stringify((resultado.dadosContato as any)?.emails ?? []),
		enderecos: JSON.stringify((resultado.dadosContato as any)?.enderecos ?? []),
		erro: resultado.erro,
		consultadoEm: resultado.createdAt.toISOString(),
	}));

	const csv = buildCsv(
		rows.length > 0
			? rows
			: [
					{
						cliente: tarefa.cliente.nome,
						tarefaId: tarefa.id,
						statusTarefa: tarefa.status,
						mensagem: "Nenhum resultado encontrado para esta tarefa",
					},
				]
	);

	return {
		filename: `resultados-${tarefa.cliente.slug}-${tarefa.id}.csv`,
		csv,
	};
}

export async function exportarResultadosTarefaExcel(
	clienteId: string,
	id: string
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
			? tarefa.resultados.map((resultado) => ({
					cliente: tarefa.cliente.nome,
					tarefaId: tarefa.id,
					statusTarefa: tarefa.status,
					logradouroBusca: tarefa.logradouro,
					numeroBusca: tarefa.numero,
					mesAnoInicio: tarefa.mesAnoInicio,
					mesAnoFinal: tarefa.mesAnoFinal,
					statusResultado: resultado.status,
					indiceCadastral: resultado.indiceCadastral,
					logradouro: resultado.logradouro,
					numero: resultado.numero,
					complemento: resultado.complemento,
					nome: resultado.nome,
					cpf: resultado.cpf,
					endereco: resultado.endereco,
					telefone: resultado.telefone,
					email: resultado.email,
					fonteContato: resultado.fonteContato,
					sexo: (resultado.dadosContato as any)?.sexo,
					idade: (resultado.dadosContato as any)?.idade,
					signo: (resultado.dadosContato as any)?.signo,
					nomeMae: (resultado.dadosContato as any)?.nomeMae,
					dataNascimento: (resultado.dadosContato as any)?.dataNascimento,
					rendaEstimada: (resultado.dadosContato as any)?.rendaEstimada,
					rendaFaixaSalarial: (resultado.dadosContato as any)
						?.rendaFaixaSalarial,
					telefones: JSON.stringify(
						(resultado.dadosContato as any)?.telefones ?? []
					),
					emails: JSON.stringify((resultado.dadosContato as any)?.emails ?? []),
					enderecos: JSON.stringify(
						(resultado.dadosContato as any)?.enderecos ?? []
					),
					erro: resultado.erro,
					consultadoEm: resultado.createdAt.toISOString(),
				}))
			: [
					{
						cliente: tarefa.cliente.nome,
						tarefaId: tarefa.id,
						statusTarefa: tarefa.status,
						mensagem: "Nenhum resultado encontrado para esta tarefa",
					},
				];

	const buffer = await buildExcelBuffer(rows, "Resultados");

	return {
		filename: `resultados-${tarefa.cliente.slug}-${tarefa.id}.xlsx`,
		buffer,
	};
}
