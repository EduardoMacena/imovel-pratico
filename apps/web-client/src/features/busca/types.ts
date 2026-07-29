export type TipoBusca = "ENDERECO" | "CODIGOS_CADASTRAIS";

export type CodigoCadastralInvalido = {
  valorOriginal: string;
  valorNormalizado: string;
  motivo: "TAMANHO_INVALIDO" | "CARACTERES_INVALIDOS";
};

export type ResumoCodigosCadastrais = {
  totalRecebidos: number;
  totalValidos: number;
  totalDuplicados: number;
  totalInvalidos: number;
  codigosValidos: string[];
  codigosDuplicados: string[];
  codigosInvalidos: CodigoCadastralInvalido[];
};

export type BuscaPreviaStatus =
  | "PENDENTE"
  | "PROCESSANDO"
  | "AGUARDANDO_INTERVALO"
  | "CONSULTANDO_REGISTRO"
  | "PRONTA"
  | "AGUARDANDO_AUTORIZACAO_EXCEDENTE"
  | "AUTORIZANDO"
  | "CONFIRMADA"
  | "CANCELADA"
  | "EXPIRADA"
  | "ERRO";

export type BuscaPreviaRegistro = {
  indiceCadastral: string;
  complemento: string | null;
};

export type BuscaPreviaResumo = {
  id: string;
  status: BuscaPreviaStatus;
  municipioId: string;
  tipoBusca: TipoBusca;
  logradouro: string;
  numero: string;
  quantidadeRegistros: number;
  registros: BuscaPreviaRegistro[];
  erro: string | null;
  expiraEm: string;
  confirmadaEm: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExcedenteResumo = {
  consultasEstimadas: number;
  consultasDisponiveisNoMomento: number;
  consultasExcedentesEstimadas: number;
  valorConsultaAdicionalCentavos: number;
  valorExcedenteEstimadoCentavos: number;
};

export type PreverBuscaRequest = {
  logradouro: string;
  numero: string;
};

export type PreverBuscaCodigosRequest = {
  codigos: string;
};

export type UsoResumo = {
  consultasUsadas: number;
  limiteMensal: number;
  consultasRestantes: number;
  consultasExcedentes: number;
  valorConsultaAdicionalCentavos: number;
  valorExcedenteCentavos: number;
  totalEstimadoCentavos: number;
  percentualUsado: number;
};

export type PreverBuscaResponse = {
  previa: BuscaPreviaResumo;
  precisaConfirmarExcedente: boolean;
  excedente: ExcedenteResumo;
  uso?: UsoResumo;
  validacaoCodigos?: ResumoCodigosCadastrais;
  message?: string;
};

export type ListarPreviasPendentesResponse = {
  previas: PreverBuscaResponse[];
};

export type CriarTarefaRequest = {
  previaId: string;
  confirmarExcedente?: boolean;
  forceRefresh?: boolean;
};

export type CriarTarefaResponse = PreverBuscaResponse & {
  jobId?: string;
  status?: string;
  message: string;
  tarefa?: {
    id: string;
    status: string;
    municipioId: string;
    tipoBusca: TipoBusca;
    buscaPreviaId: string;
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
