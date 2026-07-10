import { apiRequest } from "../../lib/api";
import type {
  LoginRequest,
  LoginResponse,
  RedefinirSenhaRequest,
  RedefinirSenhaResponse,
  SolicitarRedefinicaoSenhaRequest,
  SolicitarRedefinicaoSenhaResponse,
  TrocarMinhaSenhaRequest,
  TrocarMinhaSenhaResponse,
} from "./types";

export function login(data: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(data),
  });
}

export function trocarMinhaSenha(data: TrocarMinhaSenhaRequest) {
  return apiRequest<TrocarMinhaSenhaResponse>("/auth/minha-senha", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function solicitarRedefinicaoSenha(
  data: SolicitarRedefinicaoSenhaRequest
) {
  return apiRequest<SolicitarRedefinicaoSenhaResponse>("/auth/esqueci-senha", {
    method: "POST",
    auth: false,
    body: JSON.stringify(data),
  });
}

export function redefinirSenha(data: RedefinirSenhaRequest) {
  return apiRequest<RedefinirSenhaResponse>("/auth/redefinir-senha", {
    method: "POST",
    auth: false,
    body: JSON.stringify(data),
  });
}