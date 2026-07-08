export type ClienteStatus = "ATIVO" | "INATIVO" | "SUSPENSO";

export type UsuarioRole = "SUPER_ADMIN" | "ADMIN" | "GERENTE" | "OPERADOR";

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