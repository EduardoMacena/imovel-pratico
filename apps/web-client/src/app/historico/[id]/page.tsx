"use client";

import { AppHeader } from "../../../components/AppHeader";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/Card";
import { ProgressBar } from "../../../components/ProgressBar";
import { ResultCard } from "../../../components/ResultCard";
import { StatusBadge } from "../../../components/StatusBadge";
import { buscarProgressoTarefa } from "../../../features/busca/api";
import type { ProgressoTarefaResponse } from "../../../features/busca/types";
import {
	BackLink,
	EmptyState,
	ErrorBox,
	Header,
	HeaderTop,
	PageContainer,
	ResultsCount,
	ResultsHeader,
	ResultsList,
	ResultsSection,
	ResultsTitle,
	Subtitle,
	SummaryBox,
	SummaryGrid,
	SummaryLabel,
	SummaryValue,
	TaskId,
	Title,
	TitleGroup,
} from "./page.styles";

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

	const [tarefa, setTarefa] = useState<ProgressoTarefaResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	const isFinalizado = useMemo(() => {
		return isFinalStatus(tarefa?.status);
	}, [tarefa?.status]);

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

					<HeaderTop>
						<TitleGroup>
							<Title>Detalhes da busca</Title>

							<Subtitle>
								Acompanhe o processamento, o endereço pesquisado e os
								proprietários encontrados.
							</Subtitle>

							<TaskId>Tarefa: {tarefaId}</TaskId>
						</TitleGroup>

						{tarefa?.status && <StatusBadge status={tarefa.status} />}
					</HeaderTop>
				</Header>

				{erro && <ErrorBox>{erro}</ErrorBox>}

				{isLoading && <EmptyState>Carregando detalhes da busca...</EmptyState>}

				{!isLoading && !erro && tarefa && (
					<Card>
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

						<ProgressBar
							status={tarefa.status}
							total={tarefa.progress.total}
							current={tarefa.progress.current}
							percentage={tarefa.progress.percentage}
						/>

						{tarefa.erro && <ErrorBox>{tarefa.erro}</ErrorBox>}

						<ResultsSection>
							<ResultsHeader>
								<ResultsTitle>Resultados da busca</ResultsTitle>

								<ResultsCount>
									{tarefa.resultados.length} resultado(s) encontrado(s)
								</ResultsCount>
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
