import { getAuthToken, removeAuthToken } from "./auth-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurada");
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

type ApiErrorPayload = {
  code?: string;
  message?: string;
  [key: string]: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly payload: ApiErrorPayload | null;

  constructor({
    status,
    payload,
    fallbackMessage,
  }: {
    status: number;
    payload: ApiErrorPayload | null;
    fallbackMessage: string;
  }) {
    super(payload?.message ?? fallbackMessage);

    this.name = "ApiError";
    this.status = status;
    this.code = payload?.code;
    this.payload = payload;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function asApiErrorPayload(value: unknown): ApiErrorPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiErrorPayload;
}

export async function apiRequest<TResponse>(
  path: string,
  options?: ApiRequestOptions,
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
  const payload = asApiErrorPayload(data);

  if (response.status === 401) {
    removeAuthToken();

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }

    throw new ApiError({
      status: response.status,
      payload,
      fallbackMessage: "Sessão expirada",
    });
  }

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      payload,
      fallbackMessage: "Erro na requisição",
    });
  }

  return data as TResponse;
}

export async function apiDownload(path: string, filename: string) {
  const token = getAuthToken();
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }

    throw new ApiError({
      status: response.status,
      payload: null,
      fallbackMessage: "Sessão expirada",
    });
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new ApiError({
      status: response.status,
      payload: asApiErrorPayload(data),
      fallbackMessage: "Erro ao baixar arquivo",
    });
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}
