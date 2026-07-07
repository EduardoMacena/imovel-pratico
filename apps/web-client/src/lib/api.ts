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

  headers.set("Content-Type", "application/json");

  if (options?.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    removeAuthToken();

    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error(data?.message ?? "Sessão expirada");
  }

  if (!response.ok) {
    throw new Error(data?.message ?? "Erro na requisição");
  }

  return data as TResponse;
}
