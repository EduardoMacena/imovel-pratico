"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../../../components/AppHeader";
import { StatusBadge } from "../../../../components/StatusBadge";
import { listarTarefasDoCliente } from "../../../../features/admin/api";
import type {
	ClienteStatus,
	TarefaClienteResumo,
} from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
import {
	Address,
	BackLink,
	EmptyState,
	EmptyStateTitle,
	ErrorBox,
	Header,
	HeaderContent,
	HeaderEyebrow,
	HeaderGrid,
	HeaderPanel,
	HeaderPanelItem,
	HeaderPanelLabel,
	HeaderPanelValue,
	InfoBox,
	InfoGrid,
	InfoLabel,
	InfoValue,
	List,
	ListHeader,
	ListSubtitle,
	ListTitle,
	PageContainer,
	StatCard,
	StatGrid,
	StatLabel,
	StatValue,
	Subtitle,
	TaskActions,
	TaskId,
	TaskItem,
	TaskLink,
	TaskTop,
	Title,
} from "./page.styles";

type Cliente = {
	id: string;
	nome: string;
	slug: string;
	status: ClienteStatus;
};

function formatDate(value?: string | null) {
	if (!value) {
		return "-";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(value));
}

export default function TarefasClientePage() {
	const { isCheckingAuth } = useRequireSuperAdmin();
	const params = useParams<{ id: string }>();

	const clienteId = params.id;

	const [cliente, setCliente] = useState<Cliente | null>(null);
	const [tarefas, setTarefas] = useState<TarefaClienteResumo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	const resumo = useMemo(() => {
		const total = tarefas.length;

		const completed = tarefas.filter(
			(tarefa) => tarefa.status === "COMPLETED"
		).length;

		const processing = tarefas.filter(
			(tarefa) => tarefa.status === "PROCESSING" || tarefa.status === "PENDING"
		).length;

		const error = tarefas.filter((tarefa) => tarefa.status === "ERROR").length;

		const resultados = tarefas.reduce(
			(acc, tarefa) => acc + tarefa.totalResultados,
			0
		);

		return {
			total,
			completed,
			processing,
			error,
			resultados,
		};
	}, [tarefas]);

	async function carregarTarefas() {
		try {
			setErro(null);

			const data = await listarTarefasDoCliente(clienteId);

			setCliente(data.cliente);
			setTarefas(data.tarefas);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar tarefas"
			);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarTarefas();
		}
	}, [isCheckingAuth]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<BackLink href="/clientes">← Voltar para clientes</BackLink>

				<Header>
					<HeaderGrid>
						<HeaderContent>
							<HeaderEyebrow>Monitoramento operacional</HeaderEyebrow>

							<Title>Tarefas do cliente</Title>

							<Subtitle>
								{cliente
									? `${cliente.nome} • ${cliente.slug}`
									: "Visualize as buscas executadas por este cliente, acompanhe progresso, resultados e falhas."}
							</Subtitle>
						</HeaderContent>

						<HeaderPanel>
							<HeaderPanelItem>
								<HeaderPanelLabel>Status do cliente</HeaderPanelLabel>
								<HeaderPanelValue>
									{cliente?.status ? (
										<StatusBadge status={cliente.status} />
									) : (
										"-"
									)}
								</HeaderPanelValue>
							</HeaderPanelItem>

							<HeaderPanelItem>
								<HeaderPanelLabel>Total de tarefas</HeaderPanelLabel>
								<HeaderPanelValue>{resumo.total}</HeaderPanelValue>
							</HeaderPanelItem>

							<HeaderPanelItem>
								<HeaderPanelLabel>Resultados encontrados</HeaderPanelLabel>
								<HeaderPanelValue>{resumo.resultados}</HeaderPanelValue>
							</HeaderPanelItem>
						</HeaderPanel>
					</HeaderGrid>
				</Header>

				{erro && <ErrorBox>{erro}</ErrorBox>}

				{isLoading && (
					<EmptyState>
						<EmptyStateTitle>Carregando tarefas...</EmptyStateTitle>
						Estamos buscando as tarefas executadas por este cliente.
					</EmptyState>
				)}

				{!isLoading && !erro && (
					<>
						<StatGrid>
							<StatCard>
								<StatLabel>Total de tarefas</StatLabel>
								<StatValue>{resumo.total}</StatValue>
							</StatCard>

							<StatCard>
								<StatLabel>Concluídas</StatLabel>
								<StatValue>{resumo.completed}</StatValue>
							</StatCard>

							<StatCard>
								<StatLabel>Em andamento</StatLabel>
								<StatValue>{resumo.processing}</StatValue>
							</StatCard>

							<StatCard>
								<StatLabel>Com erro</StatLabel>
								<StatValue>{resumo.error}</StatValue>
							</StatCard>

							<StatCard>
								<StatLabel>Resultados</StatLabel>
								<StatValue>{resumo.resultados}</StatValue>
							</StatCard>
						</StatGrid>

						<ListHeader>
							<div>
								<ListTitle>Histórico de tarefas</ListTitle>
								<ListSubtitle>
									Veja cada busca executada, seu status, período, progresso e
									quantidade de resultados encontrados.
								</ListSubtitle>
							</div>
						</ListHeader>

						{tarefas.length === 0 && (
							<EmptyState>
								<EmptyStateTitle>Nenhuma tarefa encontrada.</EmptyStateTitle>
								Este cliente ainda não executou buscas na plataforma.
							</EmptyState>
						)}

						{tarefas.length > 0 && (
							<List>
								{tarefas.map((tarefa) => (
									<TaskItem key={tarefa.id}>
										<TaskTop>
											<div>
												<Address>
													{tarefa.endereco.logradouro}, {tarefa.endereco.numero}
												</Address>

												<TaskId>Tarefa: {tarefa.id}</TaskId>
											</div>

											<StatusBadge status={tarefa.status} />
										</TaskTop>

										<InfoGrid>
											<InfoBox>
												<InfoLabel>Período</InfoLabel>
												<InfoValue>
													{tarefa.periodo.mesAnoInicio} até{" "}
													{tarefa.periodo.mesAnoFinal}
												</InfoValue>
											</InfoBox>

											<InfoBox>
												<InfoLabel>Progresso</InfoLabel>
												<InfoValue>
													{tarefa.progress.current}/{tarefa.progress.total} ·{" "}
													{tarefa.progress.percentage}%
												</InfoValue>
											</InfoBox>

											<InfoBox>
												<InfoLabel>Resultados</InfoLabel>
												<InfoValue>{tarefa.totalResultados}</InfoValue>
											</InfoBox>

											<InfoBox>
												<InfoLabel>Criado em</InfoLabel>
												<InfoValue>{formatDate(tarefa.createdAt)}</InfoValue>
											</InfoBox>
										</InfoGrid>

										{tarefa.erro && <ErrorBox>{tarefa.erro}</ErrorBox>}

										<TaskActions>
											<TaskLink href={`/tarefas/${tarefa.id}`}>
												Ver detalhe da tarefa
											</TaskLink>
										</TaskActions>
									</TaskItem>
								))}
							</List>
						)}
					</>
				)}
			</PageContainer>
		</>
	);
}