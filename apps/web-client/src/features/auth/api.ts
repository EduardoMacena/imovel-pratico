import { apiRequest } from "../../lib/api";
import type { LoginRequest, LoginResponse } from "./types";

export function login(data: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(data),
  });
}
