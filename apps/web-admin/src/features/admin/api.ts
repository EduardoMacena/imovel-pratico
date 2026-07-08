import { apiRequest } from "../../lib/api";
import type {
  CriarClienteRequest,
  CriarClienteResponse,
  CriarUsuarioRequest,
  CriarUsuarioResponse,
  ListarClientesResponse,
  ListarUsuariosResponse,
} from "./types";

export function listarClientes() {
  return apiRequest<ListarClientesResponse>("/admin/clientes");
}

export function criarCliente(data: CriarClienteRequest) {
  return apiRequest<CriarClienteResponse>("/admin/clientes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listarUsuariosDoCliente(clienteId: string) {
  return apiRequest<ListarUsuariosResponse>(
    `/admin/clientes/${clienteId}/usuarios`
  );
}

export function criarUsuario(clienteId: string, data: CriarUsuarioRequest) {
  return apiRequest<CriarUsuarioResponse>(
    `/admin/clientes/${clienteId}/usuarios`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
