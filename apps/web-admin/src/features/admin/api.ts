import { apiDownload, apiRequest } from "../../lib/api";
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
	AtualizarPlanoRequest,
	AtualizarPlanoResponse,
	BuscarPlanoResponse,
	CriarPlanoRequest,
	CriarPlanoResponse,
	ListarPlanosResponse,
	BuscarConsumoClienteResponse,
	ListarConsumoClientesResponse,
  FaturaResponse,
  GerarFaturaRequest,
  ListarFaturasResponse,
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

export function exportarResultadosTarefaAdmin(tarefaId: string) {
	return apiDownload(
		`/admin/tarefas/${tarefaId}/exportar`,
		`resultados-admin-tarefa-${tarefaId}.csv`
	);
}

export function exportarResultadosTarefaAdminExcel(tarefaId: string) {
	return apiDownload(
		`/admin/tarefas/${tarefaId}/exportar-excel`,
		`resultados-admin-tarefa-${tarefaId}.xlsx`
	);
}

export function exportarResultadosTarefaAdminPdf(tarefaId: string) {
  return apiDownload(
    `/admin/tarefas/${tarefaId}/exportar-pdf`,
    `proprietarios-admin-tarefa-${tarefaId}.pdf`
  );
}

export function listarPlanos() {
	return apiRequest<ListarPlanosResponse>("/admin/planos");
}

export function buscarPlano(planoId: string) {
	return apiRequest<BuscarPlanoResponse>(`/admin/planos/${planoId}`);
}

export function criarPlano(data: CriarPlanoRequest) {
	return apiRequest<CriarPlanoResponse>("/admin/planos", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export function atualizarPlano(planoId: string, data: AtualizarPlanoRequest) {
	return apiRequest<AtualizarPlanoResponse>(`/admin/planos/${planoId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export function listarConsumoClientes() {
	return apiRequest<ListarConsumoClientesResponse>("/admin/consumo/clientes");
}

export function buscarConsumoCliente(clienteId: string) {
	return apiRequest<BuscarConsumoClienteResponse>(
		`/admin/consumo/clientes/${clienteId}`
	);
}

export function listarFaturas(params?: {
  clienteId?: string;
  status?: string;
  referenciaMes?: number;
  referenciaAno?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.clienteId) {
    searchParams.set("clienteId", params.clienteId);
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.referenciaMes) {
    searchParams.set("referenciaMes", String(params.referenciaMes));
  }

  if (params?.referenciaAno) {
    searchParams.set("referenciaAno", String(params.referenciaAno));
  }

  const query = searchParams.toString();

  return apiRequest<ListarFaturasResponse>(
    `/admin/faturas${query ? `?${query}` : ""}`
  );
}

export function gerarFatura(data: GerarFaturaRequest) {
  return apiRequest<FaturaResponse>("/admin/faturas/gerar", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function marcarFaturaPaga(faturaId: string) {
  return apiRequest<FaturaResponse>(`/admin/faturas/${faturaId}/marcar-paga`, {
    method: "POST",
  });
}

export function cancelarFatura(faturaId: string) {
  return apiRequest<FaturaResponse>(`/admin/faturas/${faturaId}/cancelar`, {
    method: "POST",
  });
}

export function exportarResultadosTarefaAdminCsv(tarefaId: string) {
  return apiDownload(
    `/admin/tarefas/${tarefaId}/exportar`,
    `proprietarios-admin-tarefa-${tarefaId}.csv`
  );
}
