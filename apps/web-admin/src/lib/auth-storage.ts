const TOKEN_KEY = "@imovel-pratico-admin:token";
const USER_KEY = "@imovel-pratico-admin:user";
const CLIENTE_KEY = "@imovel-pratico-admin:cliente";

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
  role: string;
};

export type AuthCliente = {
  id: string;
  nome: string;
  slug: string;
};

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(CLIENTE_KEY);
}

export function setAuthUser(user: AuthUser) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as AuthUser;
}

export function setAuthCliente(cliente: AuthCliente) {
  window.localStorage.setItem(CLIENTE_KEY, JSON.stringify(cliente));
}

export function getAuthCliente(): AuthCliente | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(CLIENTE_KEY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as AuthCliente;
}
