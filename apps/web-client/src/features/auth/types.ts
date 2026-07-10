export type LoginRequest = {
  email: string;
  senha: string;
};

export type AuthUsuario = {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo?: boolean;
  clienteId?: string;
  precisaTrocarSenha: boolean;
  senhaAlteradaEm?: string | null;
};

export type AuthCliente = {
  id: string;
  nome: string;
  slug: string;
};

export type LoginResponse = {
  token: string;
  usuario: AuthUsuario;
  cliente: AuthCliente;
};

export type TrocarMinhaSenhaRequest = {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

export type TrocarMinhaSenhaResponse = {
  usuario: AuthUsuario;
  message: string;
};