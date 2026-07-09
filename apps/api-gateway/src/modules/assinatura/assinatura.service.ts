import { prisma } from "@imovel-pratico/database";

function getInicioMesAtual() {
	const now = new Date();

	return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getFimMesAtual() {
	const now = new Date();

	return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

function pagamentoEstaVencido(pagamentoVenceEm: Date | null) {
	if (!pagamentoVenceEm) {
		return false;
	}

	const agora = new Date();

	return pagamentoVenceEm < agora;
}

export async function buscarUsoMensalCliente(clienteId: string) {
	const inicioMes = getInicioMesAtual();
	const fimMes = getFimMesAtual();

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

	return {
		consultasUsadas,
		inicioMes,
		fimMes,
	};
}

export async function validarClientePodeCriarBusca(clienteId: string) {
	const cliente = await prisma.cliente.findUnique({
		where: {
			id: clienteId,
		},
		include: {
			plano: true,
		},
	});

	if (!cliente) {
		throw new Error("Cliente não encontrado");
	}

	if (cliente.status !== "ATIVO") {
		throw new Error("Cliente inativo ou suspenso");
	}

	if (!cliente.plano) {
		throw new Error("Cliente sem plano contratado");
	}

	if (cliente.plano.status !== "ATIVO") {
		throw new Error("Plano contratado está inativo");
	}

	if (cliente.pagamentoStatus !== "PAGO") {
		throw new Error("Pagamento do plano pendente ou vencido");
	}

	if (pagamentoEstaVencido(cliente.pagamentoVenceEm)) {
		throw new Error("Pagamento do plano está vencido");
	}

	const uso = await buscarUsoMensalCliente(clienteId);

	const limiteMensal = cliente.plano.limiteMensalConsultas;

	if (uso.consultasUsadas >= limiteMensal) {
		throw new Error("Limite mensal de consultas atingido");
	}

	return {
		cliente,
		plano: cliente.plano,
		uso: {
			consultasUsadas: uso.consultasUsadas,
			limiteMensal,
			consultasRestantes: Math.max(limiteMensal - uso.consultasUsadas, 0),
		},
	};
}

export async function buscarMinhaAssinatura(clienteId: string) {
	const cliente = await prisma.cliente.findUnique({
		where: {
			id: clienteId,
		},
		select: {
			id: true,
			nome: true,
			slug: true,
			status: true,
			intervaloSegundos: true,
			limiteMensalConsultas: true,
			pagamentoStatus: true,
			pagamentoVenceEm: true,
			plano: {
				select: {
					id: true,
					nome: true,
					slug: true,
					limiteMensalConsultas: true,
					intervaloSegundos: true,
					precoCentavos: true,
					status: true,
				},
			},
		},
	});

	if (!cliente?.plano) {
		return null;
	}

	const uso = await buscarUsoMensalCliente(clienteId);

	const limiteMensal = cliente.plano.limiteMensalConsultas;

	const consultasRestantes = Math.max(limiteMensal - uso.consultasUsadas, 0);

	return {
		cliente,
		plano: cliente.plano,
		uso: {
			consultasUsadas: uso.consultasUsadas,
			limiteMensal,
			consultasRestantes,
			inicioMes: uso.inicioMes,
			fimMes: uso.fimMes,
		},
	};
}
