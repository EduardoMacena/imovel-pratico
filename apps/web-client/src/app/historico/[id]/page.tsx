"use client";

import { AppHeader } from "../../../components/AppHeader";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/Card";
import { ProgressBar } from "../../../components/ProgressBar";
import { ResultCard } from "../../../components/ResultCard";
import { StatusBadge } from "../../../components/StatusBadge";
import {
	buscarProgressoTarefa,
	exportarResultadosTarefa,
	exportarResultadosTarefaExcel,
} from "../../../features/busca/api";
import type { ProgressoTarefaResponse } from "../../../features/busca/types";
import {
	BackLink,
	EmptyState,
	ErrorBox,
	ExportActions,
	Header,
	HeaderContent,
	HeaderEyebrow,
	HeaderGrid,
	HeaderPanel,
	HeaderPanelLabel,
	HeaderPanelMetric,
	HeaderPanelValue,
	PageContainer,
	ProgressPanel,
	ResultsCount,
	ResultsHeader,
	ResultsList,
	ResultsSection,
	ResultsTitle,
	Subtitle,
	SummaryBox,
	SummaryGrid,
	SummaryLabel,
	SummarySectionHeader,
	SummarySectionTitle,
	SummaryValue,
	TaskId,
	Title,
	TitleGroup,
} from "./page.styles";
import { Button } from "../../../components/Button";

function formatDate(value?: string | null) {
	if (!value) {
		return "-";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(value));
}

function isFinalStatus(status?: string) {
	return status === "COMPLETED" || status === "ERROR" || status === "CANCELED";
}

export default function DetalheHistoricoPage() {
	const { isCheckingAuth } = useRequireAuth();

	const params = useParams<{ id: string }>();

	const tarefaId = params.id;

	const [isExporting, setIsExporting] = useState(false);
	const [isExportingExcel, setIsExportingExcel] = useState(false);

	const [tarefa, setTarefa] = useState<ProgressoTarefaResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	const isFinalizado = useMemo(() => {
		return isFinalStatus(tarefa?.status);
	}, [tarefa?.status]);

	async function handleExportarExcel() {
		setIsExportingExcel(true);

		try {
			await exportarResultadosTarefaExcel(tarefaId);
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

		try {
			await exportarResultadosTarefa(tarefaId);
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

	useEffect(() => {
		let isMounted = true;

		async function carregarTarefa() {
			try {
				setErro(null);

				const data = await buscarProgressoTarefa(tarefaId);

				if (isMounted) {
					setTarefa(data);
				}
			} catch (error) {
				if (isMounted) {
					setErro(
						error instanceof Error
							? error.message
							: "Erro desconhecido ao carregar detalhes da busca"
					);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		carregarTarefa();

		if (isFinalizado) {
			return () => {
				isMounted = false;
			};
		}

		const interval = window.setInterval(carregarTarefa, 3000);

		return () => {
			isMounted = false;
			window.clearInterval(interval);
		};
	}, [tarefaId, isFinalizado]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<Header>
					<BackLink href="/historico">← Voltar para o histórico</BackLink>

					<HeaderGrid>
						<HeaderContent>
							<HeaderEyebrow>Detalhe operacional</HeaderEyebrow>

							<TitleGroup>
								<Title>Detalhes da busca</Title>

								<Subtitle>
									Acompanhe o processamento, o endereço pesquisado, os
									proprietários encontrados e os contatos enriquecidos.
								</Subtitle>
							</TitleGroup>

							<TaskId>Tarefa: {tarefaId}</TaskId>

							<ExportActions>
								<Button
									type="button"
									variant="ghost"
									disabled={isExporting}
									onClick={handleExportarCsv}
								>
									{isExporting ? "Exportando..." : "Exportar CSV"}
								</Button>

								<Button
									type="button"
									variant="accent"
									disabled={isExportingExcel}
									onClick={handleExportarExcel}
								>
									{isExportingExcel ? "Exportando..." : "Exportar Excel"}
								</Button>
							</ExportActions>
						</HeaderContent>

						<HeaderPanel>
							<HeaderPanelLabel>Status da tarefa</HeaderPanelLabel>

							{tarefa?.status ? (
								<StatusBadge status={tarefa.status} />
							) : (
								<HeaderPanelValue>-</HeaderPanelValue>
							)}

							<HeaderPanelMetric>
								<HeaderPanelLabel>Progresso</HeaderPanelLabel>
								<HeaderPanelValue>
									{tarefa?.progress.percentage ?? 0}%
								</HeaderPanelValue>
							</HeaderPanelMetric>

							<HeaderPanelMetric>
								<HeaderPanelLabel>Resultados</HeaderPanelLabel>
								<HeaderPanelValue>
									{tarefa?.resultados.length ?? 0}
								</HeaderPanelValue>
							</HeaderPanelMetric>
						</HeaderPanel>
					</HeaderGrid>
				</Header>

				{erro && <ErrorBox>{erro}</ErrorBox>}

				{isLoading && (
					<EmptyState>Carregando detalhes da busca...</EmptyState>
				)}

				{!isLoading && !erro && tarefa && (
					<Card>
						<SummarySectionHeader>
							<div>
								<SummarySectionTitle>Resumo da tarefa</SummarySectionTitle>
								<Subtitle>
									Informações principais da busca e acompanhamento do
									processamento.
								</Subtitle>
							</div>
						</SummarySectionHeader>

						<SummaryGrid>
							<SummaryBox>
								<SummaryLabel>Endereço</SummaryLabel>
								<SummaryValue>
									{tarefa.endereco?.logradouro}, {tarefa.endereco?.numero}
								</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Período</SummaryLabel>
								<SummaryValue>
									{tarefa.periodo?.mesAnoInicio} até{" "}
									{tarefa.periodo?.mesAnoFinal}
								</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Criado em</SummaryLabel>
								<SummaryValue>{formatDate(tarefa.createdAt)}</SummaryValue>
							</SummaryBox>

							<SummaryBox>
								<SummaryLabel>Concluído em</SummaryLabel>
								<SummaryValue>{formatDate(tarefa.completedAt)}</SummaryValue>
							</SummaryBox>
						</SummaryGrid>

						<ProgressPanel>
							<ProgressBar
								status={tarefa.status}
								total={tarefa.progress.total}
								current={tarefa.progress.current}
								percentage={tarefa.progress.percentage}
							/>
						</ProgressPanel>

						{tarefa.erro && <ErrorBox>{tarefa.erro}</ErrorBox>}

						<ResultsSection>
							<ResultsHeader>
								<div>
									<ResultsTitle>Resultados da busca</ResultsTitle>

									<ResultsCount>
										{tarefa.resultados.length} resultado(s) encontrado(s)
									</ResultsCount>
								</div>
							</ResultsHeader>

							{tarefa.resultados.length === 0 && (
								<EmptyState>
									Nenhum resultado salvo ainda. Se a tarefa estiver em
									processamento, os resultados aparecerão aqui automaticamente.
								</EmptyState>
							)}

							{tarefa.resultados.length > 0 && (
								<ResultsList>
									{tarefa.resultados.map((resultado) => (
										<ResultCard key={resultado.id} resultado={resultado} />
									))}
								</ResultsList>
							)}
						</ResultsSection>
					</Card>
				)}
			</PageContainer>
		</>
	);
}