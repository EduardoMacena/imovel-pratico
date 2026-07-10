"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../../components/AppHeader";
import { StatusBadge } from "../../../components/StatusBadge";
import {
	buscarTarefaAdmin,
	cancelarTarefaAdmin,
	exportarResultadosTarefaAdmin,
	exportarResultadosTarefaAdminExcel,
	reprocessarTarefaAdmin,
} from "../../../features/admin/api";
import type { BuscarTarefaAdminResponse } from "../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../hooks/useRequireSuperAdmin";
import { OwnerDetails } from "../../../components/OwnerDetails";
import {
	ActionButton,
	Actions,
	BackLink,
	DangerButton,
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
	PageContainer,
	ProgressFill,
	ProgressHeader,
	ProgressPanel,
	ProgressTrack,
	ResultItem,
	ResultList,
	ResultMeta,
	ResultMetaItem,
	ResultTitle,
	ResultTop,
	Section,
	SectionHeader,
	SectionSubtitle,
	SectionTitle,
	Subtitle,
	SuccessBox,
	SummaryBox,
	SummaryGrid,
	SummaryLabel,
	SummaryValue,
	Title,
} from "./page.styles";

type Tarefa = BuscarTarefaAdminResponse["tarefa"];

function formatDate(value?: string | null) {
	if (!value) {
		return "-";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(value));
}

export default function DetalheTarefaPage() {
	const { isCheckingAuth } = useRequireSuperAdmin();
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const tarefaId = params.id;

	const [tarefa, setTarefa] = useState<Tarefa | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const [sucesso, setSucesso] = useState<string | null>(null);

	const [isExporting, setIsExporting] = useState(false);
	const [isExportingExcel, setIsExportingExcel] = useState(false);

	const podeCancelar = useMemo(() => {
		return tarefa?.status === "PENDING" || tarefa?.status === "PROCESSING";
	}, [tarefa?.status]);

	const podeReprocessar = useMemo(() => {
		return (
			tarefa?.status === "COMPLETED" ||
			tarefa?.status === "ERROR" ||
			tarefa?.status === "CANCELED"
		);
	}, [tarefa?.status]);

	async function handleExportarExcel() {
		setIsExportingExcel(true);
		setErro(null);
		setSucesso(null);

		try {
			await exportarResultadosTarefaAdminExcel(tarefaId);

			setSucesso("Excel exportado com sucesso.");
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao exportar Excel"
			);
		} finally {
			setIsExportingExcel(false);
		}
	}

	async function handleExportarCsv() {
		setIsExporting(true);
		setErro(null);
		setSucesso(null);

		try {
			await exportarResultadosTarefaAdmin(tarefaId);

			setSucesso("CSV exportado com sucesso.");
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao exportar CSV"
			);
		} finally {
			setIsExporting(false);
		}
	}

	async function carregarTarefa() {
		try {
			setErro(null);

			const data = await buscarTarefaAdmin(tarefaId);

			setTarefa(data.tarefa);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar tarefa"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleCancelar() {
		const confirmado = window.confirm(
			"Tem certeza que deseja cancelar esta tarefa?"
		);

		if (!confirmado) {
			return;
		}

		setIsActionLoading(true);
		setErro(null);
		setSucesso(null);

		try {
			const data = await cancelarTarefaAdmin(tarefaId);

			setSucesso(data.queue?.reason ?? "Tarefa cancelada com sucesso.");

			await carregarTarefa();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao cancelar tarefa"
			);
		} finally {
			setIsActionLoading(false);
		}
	}

	async function handleReprocessar() {
		const confirmado = window.confirm(
			"Tem certeza que deseja reprocessar esta tarefa? Os resultados atuais serão apagados."
		);

		if (!confirmado) {
			return;
		}

		setIsActionLoading(true);
		setErro(null);
		setSucesso(null);

		try {
			const data = await reprocessarTarefaAdmin(tarefaId);

			setSucesso(data.message ?? "Tarefa enviada para reprocessamento.");

			await carregarTarefa();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao reprocessar tarefa"
			);
		} finally {
			setIsActionLoading(false);
		}
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarTarefa();
		}
	}, [isCheckingAuth]);

	useEffect(() => {
		if (
			!tarefa ||
			tarefa.status === "COMPLETED" ||
			tarefa.status === "ERROR" ||
			tarefa.status === "CANCELED"
		) {
			return;
		}

		const intervalId = window.setInterval(() => {
			carregarTarefa();
		}, 3000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [tarefa?.status]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<BackLink href="/clientes">← Voltar para clientes</BackLink>

				{isLoading && (
					<EmptyState>
						<EmptyStateTitle>Carregando tarefa...</EmptyStateTitle>
						Estamos buscando detalhes, progresso e resultados da tarefa.
					</EmptyState>
				)}

				{erro && <ErrorBox>{erro}</ErrorBox>}
				{sucesso && <SuccessBox>{sucesso}</SuccessBox>}

				{!isLoading && tarefa && (
					<>
						<Header>
							<HeaderGrid>
								<HeaderContent>
									<HeaderEyebrow>Controle da tarefa</HeaderEyebrow>

									<Title>Detalhe da tarefa</Title>

									<Subtitle>
										{tarefa.cliente.nome} • {tarefa.endereco.logradouro},{" "}
										{tarefa.endereco.numero}
									</Subtitle>

									<Actions>
										<ActionButton
											type="button"
											onClick={() =>
												router.push(`/clientes/${tarefa.cliente.id}/tarefas`)
											}
										>
											Tarefas do cliente
										</ActionButton>

										<ActionButton
											type="button"
											disabled={isExporting}
											onClick={handleExportarCsv}
										>
											{isExporting ? "Exportando..." : "Exportar CSV"}
										</ActionButton>

										<ActionButton
											type="button"
											disabled={isExportingExcel}
											onClick={handleExportarExcel}
										>
											{isExportingExcel ? "Exportando..." : "Exportar Excel"}
										</ActionButton>

										{podeCancelar && (
											<DangerButton
												type="button"
												disabled={isActionLoading}
												onClick={handleCancelar}
											>
												{isActionLoading ? "Aguarde..." : "Cancelar"}
											</DangerButton>
										)}

										{podeReprocessar && (
											<ActionButton
												type="button"
												disabled={isActionLoading}
												onClick={handleReprocessar}
											>
												{isActionLoading ? "Aguarde..." : "Reprocessar"}
											</ActionButton>
										)}
									</Actions>
								</HeaderContent>

								<HeaderPanel>
									<HeaderPanelItem>
										<HeaderPanelLabel>Status</HeaderPanelLabel>
										<HeaderPanelValue>
											<StatusBadge status={tarefa.status} />
										</HeaderPanelValue>
									</HeaderPanelItem>

									<HeaderPanelItem>
										<HeaderPanelLabel>Progresso</HeaderPanelLabel>
										<HeaderPanelValue>
											{tarefa.progress.percentage}%
										</HeaderPanelValue>
									</HeaderPanelItem>

									<HeaderPanelItem>
										<HeaderPanelLabel>Resultados</HeaderPanelLabel>
										<HeaderPanelValue>
											{tarefa.resultados.length}
										</HeaderPanelValue>
									</HeaderPanelItem>
								</HeaderPanel>
							</HeaderGrid>
						</Header>

						<SummaryGrid>
							<SummaryBox>
								<SummaryLabel>Status</SummaryLabel>
								<SummaryValue>{tarefa.status}</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Progresso</SummaryLabel>
								<SummaryValue>
									{tarefa.progress.current}/{tarefa.progress.total} ·{" "}
									{tarefa.progress.percentage}%
								</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Resultados</SummaryLabel>
								<SummaryValue>{tarefa.resultados.length}</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Intervalo</SummaryLabel>
								<SummaryValue>
									{tarefa.configuracao.intervaloSegundos}s
								</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Período</SummaryLabel>
								<SummaryValue>
									{tarefa.periodo.mesAnoInicio} até {tarefa.periodo.mesAnoFinal}
								</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Criada em</SummaryLabel>
								<SummaryValue>{formatDate(tarefa.createdAt)}</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Iniciada em</SummaryLabel>
								<SummaryValue>{formatDate(tarefa.startedAt)}</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Finalizada em</SummaryLabel>
								<SummaryValue>{formatDate(tarefa.completedAt)}</SummaryValue>
							</SummaryBox>
						</SummaryGrid>

						<ProgressPanel>
							<ProgressHeader>
								<strong>Processamento da tarefa</strong>
								<span>
									{tarefa.progress.current}/{tarefa.progress.total} ·{" "}
									{tarefa.progress.percentage}%
								</span>
							</ProgressHeader>

							<ProgressTrack>
								<ProgressFill $percent={tarefa.progress.percentage} />
							</ProgressTrack>
						</ProgressPanel>

						{tarefa.erro && <ErrorBox>{tarefa.erro}</ErrorBox>}

						<Section>
							<SectionHeader>
								<div>
									<SectionTitle>Resultados</SectionTitle>
									<SectionSubtitle>
										Proprietários, contatos enriquecidos, endereço e dados
										retornados pela consulta.
									</SectionSubtitle>
								</div>
							</SectionHeader>

							{tarefa.resultados.length === 0 && (
								<EmptyState>
									<EmptyStateTitle>Nenhum resultado encontrado ainda.</EmptyStateTitle>
									Se a tarefa ainda estiver em processamento, os resultados
									aparecerão automaticamente.
								</EmptyState>
							)}

							{tarefa.resultados.length > 0 && (
								<ResultList>
									{tarefa.resultados.map((resultado) => (
										<ResultItem key={resultado.id}>
											<ResultTop>
												<div>
													<ResultTitle>
														{resultado.proprietario.nome ??
															"Proprietário não identificado"}
													</ResultTitle>

													<ResultMeta>
														<ResultMetaItem>
															Índice cadastral: {resultado.indiceCadastral}
														</ResultMetaItem>

														{resultado.fonteContato && (
															<ResultMetaItem>
																Fonte: {resultado.fonteContato}
															</ResultMetaItem>
														)}
													</ResultMeta>
												</div>

												<StatusBadge status={resultado.status} />
											</ResultTop>

											<InfoGrid>
												<InfoBox>
													<InfoLabel>CPF</InfoLabel>
													<InfoValue>
														{resultado.proprietario.cpf ?? "-"}
													</InfoValue>
												</InfoBox>

												<InfoBox>
													<InfoLabel>Endereço</InfoLabel>
													<InfoValue>
														{resultado.proprietario.endereco ?? "-"}
													</InfoValue>
												</InfoBox>

												<InfoBox>
													<InfoLabel>Telefone</InfoLabel>
													<InfoValue>
														{resultado.proprietario.telefone ?? "-"}
													</InfoValue>
												</InfoBox>

												<InfoBox>
													<InfoLabel>E-mail</InfoLabel>
													<InfoValue>
														{resultado.proprietario.email ?? "-"}
													</InfoValue>
												</InfoBox>
											</InfoGrid>

											<OwnerDetails
												fonteContato={resultado.fonteContato}
												dadosContato={resultado.dadosContato}
											/>

											{resultado.erro && <ErrorBox>{resultado.erro}</ErrorBox>}
										</ResultItem>
									))}
								</ResultList>
							)}
						</Section>
					</>
				)}
			</PageContainer>
		</>
	);
}