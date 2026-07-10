import { apiRequest } from "../../lib/api";
import type {
  LoginRequest,
  LoginResponse,
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