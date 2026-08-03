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
	CriarClienteOnboardingRequest,
	CriarClienteOnboardingResponse,
	CriarClienteRequest,
	CriarClienteResponse,
	CriarUsuarioRequest,
	CriarUsuarioResponse,
	DashboardAdminResponse,
	ListarClientesResponse,
	ListarMunicipiosElegiveisResponse,
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
	ListarEventosMonitoramentoRequest,
	ListarEventosMonitoramentoResponse,
	ListarFilasMonitoramentoResponse,
	MonitoramentoResumoResponse,
	CriarWorkerAgentRequest,
	CriarWorkerAgentResponse,
	ListarWorkerAgentsClienteResponse,
	RevogarWorkerAgentResponse,
	CancelarWorkerAgentInstallLinkResponse,
	CriarWorkerAgentInstallLinkRequest,
	CriarWorkerAgentInstallLinkResponse,
	ListarWorkerAgentInstallLinksResponse,
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

export function listarMunicipiosElegiveis() {
	return apiRequest<ListarMunicipiosElegiveisResponse>("/admin/municipios");
}

export function criarClienteOnboarding(data: CriarClienteOnboardingRequest) {
	return apiRequest<CriarClienteOnboardingResponse>(
		"/admin/clientes/onboarding",
		{
			method: "POST",
			body: JSON.stringify(data),
		}
	);
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

export function buscarResumoMonitoramento(params?: { clienteId?: string }) {
	const searchParams = new URLSearchParams();

	if (params?.clienteId) {
		searchParams.set("clienteId", params.clienteId);
	}

	const query = searchParams.toString();

	return apiRequest<MonitoramentoResumoResponse>(
		`/admin/monitoramento/resumo${query ? `?${query}` : ""}`
	);
}

export function listarEventosMonitoramento(
	params?: ListarEventosMonitoramentoRequest
) {
	const searchParams = new URLSearchParams();

	if (params?.clienteId) {
		searchParams.set("clienteId", params.clienteId);
	}

	if (params?.nivel) {
		searchParams.set("nivel", params.nivel);
	}

	if (params?.servico) {
		searchParams.set("servico", params.servico);
	}

	if (params?.tipo) {
		searchParams.set("tipo", params.tipo);
	}

	if (params?.take) {
		searchParams.set("take", String(params.take));
	}

	const query = searchParams.toString();

	return apiRequest<ListarEventosMonitoramentoResponse>(
		`/admin/monitoramento/eventos${query ? `?${query}` : ""}`
	);
}

export function listarFilasMonitoramento(params?: { clienteId?: string }) {
	const searchParams = new URLSearchParams();

	if (params?.clienteId) {
		searchParams.set("clienteId", params.clienteId);
	}

	const query = searchParams.toString();

	return apiRequest<ListarFilasMonitoramentoResponse>(
		`/admin/monitoramento/filas${query ? `?${query}` : ""}`
	);
}

export function listarWorkerAgentsCliente(clienteId: string) {
	return apiRequest<ListarWorkerAgentsClienteResponse>(
		`/admin/clientes/${clienteId}/agents`
	);
}

export function criarWorkerAgentCliente(
	clienteId: string,
	data: CriarWorkerAgentRequest
) {
	return apiRequest<CriarWorkerAgentResponse>(
		`/admin/clientes/${clienteId}/agents`,
		{
			method: "POST",
			body: JSON.stringify(data),
		}
	);
}

export function revogarWorkerAgent(agentId: string) {
	return apiRequest<RevogarWorkerAgentResponse>(
		`/admin/agents/${agentId}/revogar`,
		{
			method: "POST",
		}
	);
}

export function listarWorkerAgentInstallLinks(clienteId: string) {
	return apiRequest<ListarWorkerAgentInstallLinksResponse>(
	  `/admin/clientes/${clienteId}/agents/install-links`
	);
  }
  
  export function criarWorkerAgentInstallLink(
	clienteId: string,
	data: CriarWorkerAgentInstallLinkRequest
  ) {
	return apiRequest<CriarWorkerAgentInstallLinkResponse>(
	  `/admin/clientes/${clienteId}/agents/install-links`,
	  {
		method: "POST",
		body: JSON.stringify(data),
	  }
	);
  }
  
  export function cancelarWorkerAgentInstallLink(linkId: string) {
	return apiRequest<CancelarWorkerAgentInstallLinkResponse>(
	  `/admin/agents/install-links/${linkId}/cancelar`,
	  {
		method: "POST",
	  }
	);
  }