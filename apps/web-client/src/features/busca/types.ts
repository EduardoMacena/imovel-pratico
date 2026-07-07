export type CriarTarefaRequest = {
  logradouro: string;
  numero: string;
  mesAnoInicio: string;
  mesAnoFinal: string;
  intervaloSegundos: number;
};

export type CriarTarefaResponse = {
  jobId: string;
  status: string;
  message: string;
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
