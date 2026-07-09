import bcrypt from "bcryptjs";
import { prisma } from "@imovel-pratico/database";
import {
	adicionarBuscaProprietariosNaFila,
	removerBuscaProprietariosDaFila,
} from "@imovel-pratico/queue";
import type {
	AtualizarClienteInput,
	AtualizarPlanoInput,
	AtualizarUsuarioInput,
	CriarClienteInput,
	CriarPlanoInput,
	CriarUsuarioInput,
} from "./admin.schemas.js";
import { buildCsv } from "../../utils/csv.js";
import { buildExcelBuffer } from "../../utils/excel.js";

function gerarSlugBase(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function gerarSlugUnico(nome: string, slugInformado?: string) {
	const base = gerarSlugBase(slugInformado || nome);

	let slug = base;
	let contador = 1;

	while (true) {
		const existente = await prisma.cliente.findUnique({
			where: {
				slug,
			},
			select: {
				id: true,
			},
		});

		if (!existente) {
			return slug;
		}

		contador += 1;
		slug = `${base}-${contador}`;
	}
}

function removerSenhaUsuario<T extends { senha?: string }>(usuario: T) {
	const { senha, ...usuarioSemSenha } = usuario;

	return usuarioSemSenha;
}

export async function listarClientes() {
	const clientes = await prisma.cliente.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			plano: true,
			_count: {
				select: {
					usuarios: true,
					tarefas: true,
				},
			},
		},
	});

	return clientes.map((cliente) => ({
		id: cliente.id,
		nome: cliente.nome,
		slug: cliente.slug,
		status: cliente.status,
		workerUrl: cliente.workerUrl,
		intervaloSegundos: cliente.intervaloSegundos,
		limiteDiario: cliente.limiteDiario,
		totalUsuarios: cliente._count.usuarios,
		totalTarefas: cliente._count.tarefas,
		plano: cliente.plano
			? {
					id: cliente.plano.id,
					nome: cliente.plano.nome,
					slug: cliente.plano.slug,
					limiteMensalConsultas: cliente.plano.limiteMensalConsultas,
					intervaloSegundos: cliente.plano.intervaloSegundos,
					precoCentavos: cliente.plano.precoCentavos,
					status: cliente.plano.status,
				}
			: null,
		createdAt: cliente.createdAt,
		updatedAt: cliente.updatedAt,
	}));
}

export async function criarCliente(data: CriarClienteInput) {
	const slug = await gerarSlugUnico(data.nome, data.slug);

	const cliente = await prisma.cliente.create({
		data: {
			nome: data.nome,
			slug,
			workerUrl: data.workerUrl ?? null,
			planoId: data.planoId,
		},
	});

	return cliente;
}

export async function atualizarCliente(
	id: string,
	data: AtualizarClienteInput
) {
	let slug = data.slug;

	if (slug) {
		const slugNormalizado = gerarSlugBase(slug);

		const existente = await prisma.cliente.findFirst({
			where: {
				slug: slugNormalizado,
				NOT: {
					id,
				},
			},
			select: {
				id: true,
			},
		});

		if (existente) {
			throw new Error("Já existe um cliente com esse slug");
		}

		slug = slugNormalizado;
	}

	const cliente = await prisma.cliente.update({
		where: {
			id,
		},
		data: {
			nome: data.nome,
			slug,
			status: data.status,
			workerUrl: data.workerUrl,
			planoId: data.planoId,
      pagamentoStatus: data.pagamentoStatus,
      pagamentoVenceEm: data.pagamentoVenceEm ? new Date(data.pagamentoVenceEm) : null,
		},
	});

	return cliente;
}

export async function listarUsuariosDoCliente(clienteId: string) {
	const usuarios = await prisma.usuario.findMany({
		where: {
			clienteId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return usuarios.map(removerSenhaUsuario);
}

export async function criarUsuario(clienteId: string, data: CriarUsuarioInput) {
	const cliente = await prisma.cliente.findUnique({
		where: {
			id: clienteId,
		},
	});

	if (!cliente) {
		throw new Error("Cliente não encontrado");
	}

	const emailExistente = await prisma.usuario.findUnique({
		where: {
			email: data.email,
		},
	});

	if (emailExistente) {
		throw new Error("Já existe um usuário com esse e-mail");
	}

	const senhaHash = await bcrypt.hash(data.senha, 10);

	const usuario = await prisma.usuario.create({
		data: {
			clienteId,
			nome: data.nome,
			email: data.email,
			senha: senhaHash,
			role: data.role,
			ativo: data.ativo,
		},
	});

	return removerSenhaUsuario(usuario);
}

export async function atualizarUsuario(
	id: string,
	data: AtualizarUsuarioInput
) {
	if (data.email) {
		const emailExistente = await prisma.usuario.findFirst({
			where: {
				email: data.email,
				NOT: {
					id,
				},
			},
		});

		if (emailExistente) {
			throw new Error("Já existe um usuário com esse e-mail");
		}
	}

	const senhaHash = data.senha ? await bcrypt.hash(data.senha, 10) : undefined;

	const usuario = await prisma.usuario.update({
		where: {
			id,
		},
		data: {
			nome: data.nome,
			email: data.email,
			senha: senhaHash,
			role: data.role,
			ativo: data.ativo,
		},
	});

	return removerSenhaUsuario(usuario);
}

export async function listarTarefasDoCliente(clienteId: string) {
	const cliente = await prisma.cliente.findUnique({
		where: {
			id: clienteId,
		},
		select: {
			id: true,
			nome: true,
			slug: true,
			status: true,
		},
	});

	if (!cliente) {
		throw new Error("Cliente não encontrado");
	}

	const tarefas = await prisma.tarefa.findMany({
		where: {
			clienteId,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 100,
		include: {
			_count: {
				select: {
					resultados: true,
				},
			},
		},
	});

	return {
		cliente,
		tarefas: tarefas.map((tarefa) => {
			const percentage =
				tarefa.total > 0
					? Math.round((tarefa.current / tarefa.total) * 100)
					: 0;

			return {
				id: tarefa.id,
				status: tarefa.status,
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
		}),
	};
}

export async function buscarClientePorId(id: string) {
	const cliente = await prisma.cliente.findUnique({
		where: {
			id,
		},
		include: {
			plano: true,
			_count: {
				select: {
					usuarios: true,
					tarefas: true,
				},
			},
		},
	});

	if (!cliente) {
		return null;
	}

	return {
		id: cliente.id,
		nome: cliente.nome,
		slug: cliente.slug,
		status: cliente.status,
		workerUrl: cliente.workerUrl,
		intervaloSegundos: cliente.intervaloSegundos,
		limiteDiario: cliente.limiteDiario,
		totalUsuarios: cliente._count.usuarios,
		totalTarefas: cliente._count.tarefas,
		planoId: cliente.planoId,
		plano: cliente.plano,
		createdAt: cliente.createdAt,
		updatedAt: cliente.updatedAt,
	};
}

export async function buscarUsuarioPorId(id: string) {
	const usuario = await prisma.usuario.findUnique({
		where: {
			id,
		},
		include: {
			cliente: {
				select: {
					id: true,
					nome: true,
					slug: true,
				},
			},
		},
	});

	if (!usuario) {
		return null;
	}

	return removerSenhaUsuario(usuario);
}

export async function buscarDashboardAdmin() {
	const inicioUltimos30Dias = new Date();

	inicioUltimos30Dias.setDate(inicioUltimos30Dias.getDate() - 30);

	const [
		clientes,
		totalClientes,
		clientesAtivos,
		tarefasTotal,
		tarefasUltimos30Dias,
		tarefasPendentes,
		tarefasProcessando,
		tarefasConcluidas,
		tarefasComErro,
		resultadosTotal,
		ultimasTarefas,
	] = await prisma.$transaction([
		prisma.cliente.findMany({
			include: {
				_count: {
					select: {
						usuarios: true,
						tarefas: true,
					},
				},
			},
		}),

		prisma.cliente.count(),

		prisma.cliente.count({
			where: {
				status: "ATIVO",
			},
		}),

		prisma.tarefa.count(),

		prisma.tarefa.count({
			where: {
				createdAt: {
					gte: inicioUltimos30Dias,
				},
			},
		}),

		prisma.tarefa.count({
			where: {
				status: "PENDING",
			},
		}),

		prisma.tarefa.count({
			where: {
				status: "PROCESSING",
			},
		}),

		prisma.tarefa.count({
			where: {
				status: "COMPLETED",
			},
		}),

		prisma.tarefa.count({
			where: {
				status: "ERROR",
			},
		}),

		prisma.tarefaResultado.count(),

		prisma.tarefa.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
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
		}),
	]);

	const clientesPorUso = clientes
		.map((cliente) => ({
			id: cliente.id,
			nome: cliente.nome,
			slug: cliente.slug,
			status: cliente.status,
			totalUsuarios: cliente._count.usuarios,
			totalTarefas: cliente._count.tarefas,
		}))
		.sort((a, b) => b.totalTarefas - a.totalTarefas)
		.slice(0, 10);

	return {
		indicadores: {
			totalClientes,
			clientesAtivos,
			clientesInativos: totalClientes - clientesAtivos,
			tarefasTotal,
			tarefasUltimos30Dias,
			tarefasPendentes,
			tarefasProcessando,
			tarefasConcluidas,
			tarefasComErro,
			resultadosTotal,
		},
		clientesPorUso,
		ultimasTarefas: ultimasTarefas.map((tarefa) => {
			const percentage =
				tarefa.total > 0
					? Math.round((tarefa.current / tarefa.total) * 100)
					: 0;

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
		}),
	};
}

export async function buscarTarefaAdminPorId(id: string) {
	const tarefa = await prisma.tarefa.findUnique({
		where: {
			id,
		},
		include: {
			cliente: {
				select: {
					id: true,
					nome: true,
					slug: true,
					status: true,
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
		configuracao: {
			intervaloSegundos: tarefa.intervaloSegundos,
			forceRefresh: tarefa.forceRefresh,
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

export async function cancelarTarefaAdmin(id: string) {
	const tarefa = await prisma.tarefa.findUnique({
		where: {
			id,
		},
	});

	if (!tarefa) {
		throw new Error("Tarefa não encontrada");
	}

	if (["COMPLETED", "ERROR", "CANCELED"].includes(tarefa.status)) {
		throw new Error("Essa tarefa não pode mais ser cancelada");
	}

	let queueResult = {
		removed: false,
		reason: "Cancelamento registrado no banco. A fila não foi alterada.",
	};

	try {
		queueResult = await removerBuscaProprietariosDaFila({
      clienteId: tarefa.clienteId,
      tarefaId: id,
    });
	} catch (error) {
		console.error("Erro ao tentar remover job da fila:", error);

		queueResult = {
			removed: false,
			reason:
				"Não foi possível remover o job da fila, mas a tarefa foi marcada como cancelada.",
		};
	}

	const tarefaAtualizada = await prisma.tarefa.update({
		where: {
			id,
		},
		data: {
			status: "CANCELED",
			erro: "Tarefa cancelada pelo administrador",
			completedAt: new Date(),
		},
		select: {
			id: true,
			status: true,
		},
	});

	return {
		tarefa: tarefaAtualizada,
		queue: queueResult,
		message: "Tarefa cancelada com sucesso",
	};
}

export async function reprocessarTarefaAdmin(id: string) {
	const tarefa = await prisma.tarefa.findUnique({
		where: {
			id,
		},
		include: {
			cliente: true,
		},
	});

	if (!tarefa) {
		throw new Error("Tarefa não encontrada");
	}

	if (tarefa.status === "PROCESSING") {
		throw new Error("Não é possível reprocessar uma tarefa em processamento");
	}

	await removerBuscaProprietariosDaFila({
    clienteId: tarefa.clienteId,
    tarefaId: id,
  });

	await prisma.tarefaResultado.deleteMany({
		where: {
			tarefaId: id,
		},
	});

	const tarefaAtualizada = await prisma.tarefa.update({
		where: {
			id,
		},
		data: {
			status: "PENDING",
			total: 0,
			current: 0,
			erro: null,
			startedAt: null,
			completedAt: null,
		},
	});

	await adicionarBuscaProprietariosNaFila({
		tarefaId: tarefaAtualizada.id,
		clienteId: tarefaAtualizada.clienteId,
		logradouro: tarefaAtualizada.logradouro,
		numero: tarefaAtualizada.numero,
		mesAnoInicio: tarefaAtualizada.mesAnoInicio,
		mesAnoFinal: tarefaAtualizada.mesAnoFinal,
		intervaloSegundos: tarefaAtualizada.intervaloSegundos,
		forceRefresh: true,
	});

	return {
		tarefa: tarefaAtualizada,
		message: "Tarefa reenviada para processamento",
	};
}

export async function exportarResultadosTarefaAdminCsv(id: string) {
	const tarefa = await prisma.tarefa.findUnique({
		where: {
			id,
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
		filename: `resultados-admin-${tarefa.cliente.slug}-${tarefa.id}.csv`,
		csv,
	};
}

export async function exportarResultadosTarefaAdminExcel(id: string) {
	const tarefa = await prisma.tarefa.findUnique({
		where: {
			id,
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
		filename: `resultados-admin-${tarefa.cliente.slug}-${tarefa.id}.xlsx`,
		buffer,
	};
}

export async function listarPlanos() {
	return prisma.plano.findMany({
		orderBy: {
			limiteMensalConsultas: "asc",
		},
	});
}

export async function buscarPlanoPorId(id: string) {
	return prisma.plano.findUnique({
		where: {
			id,
		},
	});
}

export async function criarPlano(data: CriarPlanoInput) {
	const slug = await gerarSlugUnicoPlano(data.nome, data.slug);

	return prisma.plano.create({
		data: {
			nome: data.nome,
			slug,
			descricao: data.descricao ?? null,
			limiteMensalConsultas: data.limiteMensalConsultas,
			intervaloSegundos: data.intervaloSegundos,
			precoCentavos: data.precoCentavos,
			status: data.status,
		},
	});
}

export async function atualizarPlano(id: string, data: AtualizarPlanoInput) {
	let slug = data.slug;

	if (slug) {
		const slugNormalizado = gerarSlugBase(slug);

		const existente = await prisma.plano.findFirst({
			where: {
				slug: slugNormalizado,
				NOT: {
					id,
				},
			},
			select: {
				id: true,
			},
		});

		if (existente) {
			throw new Error("Já existe um plano com esse slug");
		}

		slug = slugNormalizado;
	}

	return prisma.plano.update({
		where: {
			id,
		},
		data: {
			nome: data.nome,
			slug,
			descricao: data.descricao,
			limiteMensalConsultas: data.limiteMensalConsultas,
			intervaloSegundos: data.intervaloSegundos,
			precoCentavos: data.precoCentavos,
			status: data.status,
		},
	});
}

async function gerarSlugUnicoPlano(nome: string, slugInformado?: string) {
	const base = gerarSlugBase(slugInformado || nome);

	let slug = base;
	let contador = 1;

	while (true) {
		const existente = await prisma.plano.findUnique({
			where: {
				slug,
			},
			select: {
				id: true,
			},
		});

		if (!existente) {
			return slug;
		}

		contador += 1;
		slug = `${base}-${contador}`;
	}
}

function getInicioMesAtual() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getFimMesAtual() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

function calcularPercentualUsado(usadas: number, limite: number) {
  if (limite <= 0) {
    return 0;
  }

  return Math.min(Math.round((usadas / limite) * 100), 100);
}

function pagamentoEstaVencido(pagamentoVenceEm: Date | null) {
  if (!pagamentoVenceEm) {
    return false;
  }

  const hoje = new Date();

  return pagamentoVenceEm < hoje;
}

async function contarConsultasUsadasNoMes(clienteId: string) {
  const inicioMes = getInicioMesAtual();
  const fimMes = getFimMesAtual();

  return prisma.tarefaResultado.count({
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
}

async function contarTarefasPorStatus(clienteId: string) {
  const grupos = await prisma.tarefa.groupBy({
    by: ["status"],
    where: {
      clienteId,
    },
    _count: {
      _all: true,
    },
  });

  const resumo = {
    pending: 0,
    processing: 0,
    completed: 0,
    error: 0,
    canceled: 0,
  };

  for (const grupo of grupos) {
    if (grupo.status === "PENDING") {
      resumo.pending = grupo._count._all;
    }

    if (grupo.status === "PROCESSING") {
      resumo.processing = grupo._count._all;
    }

    if (grupo.status === "COMPLETED") {
      resumo.completed = grupo._count._all;
    }

    if (grupo.status === "ERROR") {
      resumo.error = grupo._count._all;
    }

    if (grupo.status === "CANCELED") {
      resumo.canceled = grupo._count._all;
    }
  }

  return resumo;
}

export async function buscarConsumoClienteAdmin(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
    include: {
      plano: true,
    },
  });

  if (!cliente) {
    return null;
  }

  const consultasUsadas = await contarConsultasUsadasNoMes(cliente.id);
  const tarefas = await contarTarefasPorStatus(cliente.id);

  const limiteMensal = cliente.plano?.limiteMensalConsultas ?? 0;
  const consultasRestantes = Math.max(limiteMensal - consultasUsadas, 0);
  const percentualUsado = calcularPercentualUsado(
    consultasUsadas,
    limiteMensal
  );

  return {
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      slug: cliente.slug,
      status: cliente.status,
      pagamentoStatus: cliente.pagamentoStatus,
      pagamentoVenceEm: cliente.pagamentoVenceEm,
      pagamentoVencido: pagamentoEstaVencido(cliente.pagamentoVenceEm),
    },
    plano: cliente.plano
      ? {
          id: cliente.plano.id,
          nome: cliente.plano.nome,
          slug: cliente.plano.slug,
          limiteMensalConsultas: cliente.plano.limiteMensalConsultas,
          intervaloSegundos: cliente.plano.intervaloSegundos,
          precoCentavos: cliente.plano.precoCentavos,
          status: cliente.plano.status,
        }
      : null,
    uso: {
      consultasUsadas,
      limiteMensal,
      consultasRestantes,
      percentualUsado,
      inicioMes: getInicioMesAtual(),
      fimMes: getFimMesAtual(),
    },
    tarefas,
  };
}

export async function listarConsumoClientesAdmin() {
  const clientes = await prisma.cliente.findMany({
    include: {
      plano: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const consumos = await Promise.all(
    clientes.map(cliente => buscarConsumoClienteAdmin(cliente.id))
  );

  return consumos.filter(Boolean);
}
