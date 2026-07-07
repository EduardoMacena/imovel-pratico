export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
  cliente: {
    id: string;
    nome: string;
    slug: string;
  };
};
