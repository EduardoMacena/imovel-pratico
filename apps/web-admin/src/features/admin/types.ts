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