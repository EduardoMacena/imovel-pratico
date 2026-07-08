import { apiRequest } from "../../lib/api";
import type {
	AcaoTarefaAdminResponse,
	AtualizarClienteRequest,
	AtualizarClienteResponse,
	AtualizarUsuarioRequest,
	AtualizarUsuarioResponse,
	BuscarClienteResponse,
	BuscarTarefaAdminResponse,
	BuscarUsuarioResponse,
	CriarClienteRequest,
	CriarClienteResponse,
	CriarUsuarioRequest,
	CriarUsuarioResponse,
	DashboardAdminResponse,
	ListarClientesResponse,
	ListarTarefasDoClienteResponse,
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

export function listarTarefasDoCliente(clienteId: string) {
	return apiRequest<ListarTarefasDoClienteResponse>(
		`/admin/clientes/${clienteId}/tarefas`
	);
}

export function buscarCliente(clienteId: string) {
	return apiRequest<BuscarClienteResponse>(`/admin/clientes/${clienteId}`);
}

export function atualizarCliente(
	clienteId: string,
	data: AtualizarClienteRequest
) {
	return apiRequest<AtualizarClienteResponse>(`/admin/clientes/${clienteId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export function buscarUsuario(usuarioId: string) {
	return apiRequest<BuscarUsuarioResponse>(`/admin/usuarios/${usuarioId}`);
}

export function atualizarUsuario(
	usuarioId: string,
	data: AtualizarUsuarioRequest
) {
	return apiRequest<AtualizarUsuarioResponse>(`/admin/usuarios/${usuarioId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export function buscarDashboardAdmin() {
	return apiRequest<DashboardAdminResponse>("/admin/dashboard");
}

export function buscarTarefaAdmin(tarefaId: string) {
	return apiRequest<BuscarTarefaAdminResponse>(`/admin/tarefas/${tarefaId}`);
}

export function cancelarTarefaAdmin(tarefaId: string) {
	return apiRequest<AcaoTarefaAdminResponse>(
		`/admin/tarefas/${tarefaId}/cancelar`,
		{
			method: "POST",
		}
	);
}

export function reprocessarTarefaAdmin(tarefaId: string) {
	return apiRequest<AcaoTarefaAdminResponse>(
		`/admin/tarefas/${tarefaId}/reprocessar`,
		{
			method: "POST",
		}
	);
}
