export type ClienteStatus = "ATIVO" | "INATIVO" | "SUSPENSO";

export type UsuarioRole = "SUPER_ADMIN" | "ADMIN" | "GERENTE" | "OPERADOR";

export type PagamentoStatus = "PAGO" | "PENDENTE" | "VENCIDO" | "CANCELADO";

export type ClienteResumo = {
	id: string;
	nome: string;
	slug: string;
	status: ClienteStatus;
	workerUrl: string | null;
	intervaloSegundos: number;
	limiteDiario: number;
	totalUsuarios: number;
	totalTarefas: number;
	planoId: string | null;
	plano: PlanoResumo | null;
	pagamentoStatus: PagamentoStatus;
	pagamentoVenceEm: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ListarClientesResponse = {
	clientes: ClienteResumo[];
};

export type CriarClienteRequest = {
	nome: string;
	slug?: string;
	workerUrl?: string | null;
	intervaloSegundos: number;
	limiteDiario: number;
	planoId: string;
};

export type CriarClienteResponse = {
	cliente: ClienteResumo;
};

export type UsuarioResumo = {
	id: string;
	clienteId: string;
	nome: string;
	email: string;
	role: UsuarioRole;
	ativo: boolean;
	precisaTrocarSenha: boolean;
	senhaAlteradaEm: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ListarUsuariosResponse = {
	usuarios: UsuarioResumo[];
};

export type CriarUsuarioRequest = {
	nome: string;
	email: string;
	senha: string;
	role: Exclude<UsuarioRole, "SUPER_ADMIN">;
	ativo: boolean;
	precisaTrocarSenha?: boolean;
};

export type CriarUsuarioResponse = {
	usuario: UsuarioResumo;
};

export type TarefaClienteResumo = {
	id: string;
	status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR" | "CANCELED";
	endereco: {
		logradouro: string;
		numero: string;
	};
	periodo: {
		mesAnoInicio: string;
		mesAnoFinal: string;
	};
	progress: {
		total: number;
		current: number;
		percentage: number;
	};
	totalResultados: number;
	erro: string | null;
	createdAt: string;
	startedAt: string | null;
	completedAt: string | null;
};

export type ListarTarefasDoClienteResponse = {
	cliente: {
		id: string;
		nome: string;
		slug: string;
		status: ClienteStatus;
	};
	tarefas: TarefaClienteResumo[];
};

export type BuscarClienteResponse = {
	cliente: ClienteResumo;
};

export type AtualizarClienteRequest = {
	nome?: string;
	slug?: string;
	status?: ClienteStatus;
	workerUrl?: string | null;
	intervaloSegundos?: number;
	limiteDiario?: number;
	planoId?: string;
};

export type AtualizarClienteResponse = {
	cliente: ClienteResumo;
};

export type BuscarUsuarioResponse = {
	usuario: UsuarioResumo & {
		cliente?: {
			id: string;
			nome: string;
			slug: string;
		};
	};
};

export type AtualizarUsuarioRequest = {
	nome?: string;
	email?: string;
	senha?: string;
	role?: UsuarioRole;
	ativo?: boolean;
	precisaTrocarSenha?: boolean;
};

export type AtualizarUsuarioResponse = {
	usuario: UsuarioResumo;
};

export type DashboardAdminResponse = {
	indicadores: {
		totalClientes: number;
		clientesAtivos: number;
		clientesInativos: number;
		tarefasTotal: number;
		tarefasUltimos30Dias: number;
		tarefasPendentes: number;
		tarefasProcessando: number;
		tarefasConcluidas: number;
		tarefasComErro: number;
		resultadosTotal: number;
	};
	clientesPorUso: {
		id: string;
		nome: string;
		slug: string;
		status: ClienteStatus;
		totalUsuarios: number;
		totalTarefas: number;
	}[];
	ultimasTarefas: {
		id: string;
		status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR" | "CANCELED";
		cliente: {
			id: string;
			nome: string;
			slug: string;
		};
		endereco: {
			logradouro: string;
			numero: string;
		};
		periodo: {
			mesAnoInicio: string;
			mesAnoFinal: string;
		};
		progress: {
			total: number;
			current: number;
			percentage: number;
		};
		totalResultados: number;
		erro: string | null;
		createdAt: string;
		startedAt: string | null;
		completedAt: string | null;
	}[];
};

export type ResultadoTarefaAdmin = {
	id: string;
	status: "SUCCESS" | "ERROR";
	logradouro: string;
	numero: string;
	complemento: string | null;
	indiceCadastral: string;
	proprietario: {
		nome: string | null;
		cpf: string | null;
		endereco: string | null;
		telefone: string | null;
		email: string | null;
	};
	fonteContato: string | null;
	dadosContato: DadosContato | null;
	erro: string | null;
	createdAt: string;
};

export type BuscarTarefaAdminResponse = {
	tarefa: {
		id: string;
		status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR" | "CANCELED";
		cliente: {
			id: string;
			nome: string;
			slug: string;
			status: ClienteStatus;
		};
		endereco: {
			logradouro: string;
			numero: string;
		};
		periodo: {
			mesAnoInicio: string;
			mesAnoFinal: string;
		};
		configuracao: {
			intervaloSegundos: number;
			forceRefresh: boolean;
		};
		progress: {
			total: number;
			current: number;
			percentage: number;
		};
		erro: string | null;
		resultados: ResultadoTarefaAdmin[];
		createdAt: string;
		startedAt: string | null;
		completedAt: string | null;
	};
};

export type AcaoTarefaAdminResponse = {
	tarefa: {
		id: string;
		status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR" | "CANCELED";
	};
	message?: string;
	queue?: {
		removed: boolean;
		reason: string;
	};
};

export type EmailContato = {
	enderecoEmail?: string | null;
};

export type TelefoneContato = {
	whatsApp?: boolean | null;
	operadora?: string | null;
	tipoTelefone?: string | null;
	telefoneComDDD?: string | null;
	telemarketingBloqueado?: boolean | null;
};

export type EnderecoContato = {
	uf?: string | null;
	cep?: string | null;
	bairro?: string | null;
	cidade?: string | null;
	numero?: string | null;
	logradouro?: string | null;
	complemento?: string | null;
};

export type DadosContato = {
	cpf?: string | null;
	nome?: string | null;
	sexo?: string | null;
	idade?: number | null;
	signo?: string | null;
	emails?: EmailContato[];
	nomeMae?: string | null;
	enderecos?: EnderecoContato[];
	telefones?: TelefoneContato[];
	rendaEstimada?: string | null;
	dataNascimento?: string | null;
	rendaFaixaSalarial?: string | null;
};

export type PlanoStatus = "ATIVO" | "INATIVO";

export type PlanoResumo = {
	id: string;
	nome: string;
	slug: string;
	descricao: string | null;
	limiteMensalConsultas: number;
	intervaloSegundos: number;
	precoCentavos: number;
	valorConsultaAdicionalCentavos: number;
	limiteCorretores: number | null;
	status: PlanoStatus;
	createdAt: string;
	updatedAt: string;
};

export type ListarPlanosResponse = {
	planos: PlanoResumo[];
};

export type BuscarPlanoResponse = {
	plano: PlanoResumo;
};

export type CriarPlanoRequest = {
	nome: string;
	slug?: string;
	descricao?: string | null;
	limiteMensalConsultas: number;
	intervaloSegundos: number;
	precoCentavos: number;
	valorConsultaAdicionalCentavos: number;
	limiteCorretores: number | null;
	status: PlanoStatus;
};

export type CriarPlanoResponse = {
	plano: PlanoResumo;
};

export type AtualizarPlanoRequest = Partial<CriarPlanoRequest>;

export type AtualizarPlanoResponse = {
	plano: PlanoResumo;
};

export type ConsumoClienteResumo = {
	cliente: {
		id: string;
		nome: string;
		slug: string;
		status: ClienteStatus;
		pagamentoStatus: PagamentoStatus;
		pagamentoVenceEm: string | null;
		pagamentoVencido: boolean;
	};
	plano: PlanoResumo | null;
	uso: {
		consultasUsadas: number;
		limiteMensal: number;
		consultasRestantes: number;
		consultasExcedentes: number;
		valorConsultaAdicionalCentavos: number;
		valorExcedenteCentavos: number;
		totalEstimadoCentavos: number;
		percentualUsado: number;
		inicioMes: string;
		fimMes: string;
	};
	tarefas: {
		pending: number;
		processing: number;
		completed: number;
		error: number;
		canceled: number;
	};
};

export type ListarConsumoClientesResponse = {
	consumos: ConsumoClienteResumo[];
};

export type BuscarConsumoClienteResponse = {
	consumo: ConsumoClienteResumo;
};

export type FaturaStatus =
  | "ABERTA"
  | "FECHADA"
  | "PAGA"
  | "VENCIDA"
  | "CANCELADA";

export type FaturaItemTipo =
  | "MENSALIDADE"
  | "CONSULTA_EXCEDENTE"
  | "AJUSTE"
  | "DESCONTO";

export type FaturaItemResumo = {
  id: string;
  tipo: FaturaItemTipo;
  descricao: string;
  quantidade: number;
  valorUnitarioCentavos: number;
  valorTotalCentavos: number;
  createdAt: string;
};

export type FaturaResumo = {
  id: string;
  clienteId: string;
  cliente: {
    id: string;
    nome: string;
    slug: string;
    status: ClienteStatus;
  };
  status: FaturaStatus;
  referenciaMes: number;
  referenciaAno: number;
  referenciaLabel: string;
  planoId: string | null;
  planoNome: string | null;
  consultasInclusas: number;
  consultasUsadas: number;
  consultasExcedentes: number;
  valorMensalidadeCentavos: number;
  valorConsultaAdicionalCentavos: number;
  valorExcedenteCentavos: number;
  valorTotalCentavos: number;
  vencimentoEm: string | null;
  pagaEm: string | null;
  observacao: string | null;
  itens: FaturaItemResumo[];
  createdAt: string;
  updatedAt: string;
};

export type ListarFaturasResponse = {
  faturas: FaturaResumo[];
};

export type GerarFaturaRequest = {
  clienteId: string;
  referenciaMes: number;
  referenciaAno: number;
  vencimentoEm?: string | null;
  observacao?: string | null;
};

export type FaturaResponse = {
  fatura: FaturaResumo;
};
