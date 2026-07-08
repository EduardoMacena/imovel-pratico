import { getAuthToken, removeAuthToken } from "./auth-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurada");
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<TResponse>(
  path: string,
  options?: ApiRequestOptions
): Promise<TResponse> {
  const token = getAuthToken();

  const headers = new Headers(options?.headers);

  const hasBody = Boolean(options?.body);

  if (hasBody) {
    headers.set("Content-Type", "application/json");
  }

  if (options?.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401 || response.status === 403) {
    if (response.status === 401) {
      removeAuthToken();
    }

    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error(data?.message ?? "Acesso não autorizado");
  }

  if (!response.ok) {
    throw new Error(data?.message ?? "Erro na requisição");
  }

  return data as TResponse;
}