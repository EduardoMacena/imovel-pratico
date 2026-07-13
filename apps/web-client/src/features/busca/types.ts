export type ExcedenteResumo = {
  consultasEstimadas: number;
  consultasDisponiveisNoMomento: number;
  consultasExcedentesEstimadas: number;
  valorConsultaAdicionalCentavos: number;
  valorExcedenteEstimadoCentavos: number;
};

export type CriarTarefaRequest = {
  logradouro: string;
  numero: string;
  forceRefresh?: boolean;
  confirmarExcedente?: boolean;
  consultasEstimadas?: number;
};

export type CriarTarefaResponse = {
  precisaConfirmarExcedente?: boolean;
  jobId?: string;
  status?: string;
  message: string;
  uso?: {
    consultasUsadas: number;
    limiteMensal: number;
    consultasRestantes: number;
    consultasExcedentes: number;
    valorConsultaAdicionalCentavos: number;
    valorExcedenteCentavos: number;
    totalEstimadoCentavos: number;
    percentualUsado: number;
  };
  excedente?: ExcedenteResumo;
  tarefa?: {
    id: string;
    status: string;
  };
};

export type ResultadoBusca = {
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

export type ProgressoTarefaResponse = {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR" | "CANCELED";
  cliente?: {
    id: string;
    nome: string;
    slug: string;
  };
  endereco?: {
    logradouro: string;
    numero: string;
  };
  periodo?: {
    mesAnoInicio: string;
    mesAnoFinal: string;
  };
  progress: {
    total: number;
    current: number;
    percentage: number;
  };
  excedente?: {
    autorizado: boolean;
    autorizadoEm: string | null;
    consultasEstimadas: number | null;
    consultasDisponiveisNoMomento: number | null;
    consultasExcedentesEstimadas: number | null;
    valorConsultaAdicionalCentavos: number | null;
    valorExcedenteEstimadoCentavos: number | null;
  };
  erro: string | null;
  resultados: ResultadoBusca[];
  createdAt?: string;
  startedAt?: string | null;
  completedAt?: string | null;
};

export type TarefaResumo = {
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
};

export type ListarTarefasResponse = {
  tarefas: TarefaResumo[];
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

export type MinhaAssinaturaResponse = {
  cliente: {
    id: string;
    nome: string;
    slug: string;
    status: "ATIVO" | "INATIVO" | "SUSPENSO";
    pagamentoStatus: "PAGO" | "PENDENTE" | "VENCIDO" | "CANCELADO";
    pagamentoVenceEm: string | null;
  };
  plano: {
    id: string;
    nome: string;
    slug: string;
    descricao: string | null;
    limiteMensalConsultas: number;
    intervaloSegundos: number;
    precoCentavos: number;
    valorConsultaAdicionalCentavos: number;
    limiteCorretores: number | null;
    status: "ATIVO" | "INATIVO";
  };
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
};
