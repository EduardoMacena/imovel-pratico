"use client";

import Link from "next/link";
import { AppHeader } from "../../components/AppHeader";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { listarTarefas } from "../../features/busca/api";
import type { TarefaResumo } from "../../features/busca/types";
import {
	Actions,
	Address,
	BackLink,
	DetailsLink,
	EmptyState,
	EmptyStateTitle,
	ErrorBox,
	Header,
	HeaderContent,
	HeaderEyebrow,
	HeaderPanel,
	HeaderPanelLabel,
	HeaderPanelValue,
	InfoBox,
	InfoGrid,
	InfoLabel,
	InfoValue,
	Item,
	ItemFooter,
	ItemTop,
	List,
	PageContainer,
	StatCard,
	StatGrid,
	StatLabel,
	StatValue,
	Subtitle,
	Title,
} from "./page.styles";

function formatDate(value: string | null) {
	if (!value) {
		return "-";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(value));
}

export default function HistoricoPage() {
	const { isCheckingAuth } = useRequireAuth();
	const [tarefas, setTarefas] = useState<TarefaResumo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	const resumo = useMemo(() => {
		const finalizadas = tarefas.filter(
			(tarefa) => tarefa.status === "COMPLETED"
		).length;

		const emProcessamento = tarefas.filter(
			(tarefa) =>
				tarefa.status === "PROCESSING" || tarefa.status === "PENDING"
		).length;

		const comErro = tarefas.filter(
			(tarefa) => tarefa.status === "ERROR" || tarefa.status === "CANCELED"
		).length;

		const resultados = tarefas.reduce((total, tarefa) => {
			return total + tarefa.totalResultados;
		}, 0);

		return {
			finalizadas,
			emProcessamento,
			comErro,
			resultados,
		};
	}, [tarefas]);

	async function carregarTarefas() {
		try {
			setErro(null);

			const data = await listarTarefas();

			setTarefas(data.tarefas);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar histórico"
			);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		carregarTarefas();
	}, []);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<Header>
					<HeaderContent>
						<Link href="/nova-busca" passHref legacyBehavior>
							<BackLink>← Voltar para nova busca</BackLink>
						</Link>

						<HeaderEyebrow>Histórico operacional</HeaderEyebrow>

						<Title>Histórico de buscas</Title>

						<Subtitle>
							Acompanhe as tarefas de captação executadas, confira o status de
							processamento e acesse os resultados encontrados.
						</Subtitle>
					</HeaderContent>

					<HeaderPanel>
						<HeaderPanelLabel>Total de buscas</HeaderPanelLabel>
						<HeaderPanelValue>{tarefas.length}</HeaderPanelValue>
					</HeaderPanel>
				</Header>

				<StatGrid>
					<StatCard>
						<StatLabel>Finalizadas</StatLabel>
						<StatValue>{resumo.finalizadas}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Em processamento</StatLabel>
						<StatValue>{resumo.emProcessamento}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Com erro/canceladas</StatLabel>
						<StatValue>{resumo.comErro}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Resultados encontrados</StatLabel>
						<StatValue>{resumo.resultados}</StatValue>
					</StatCard>
				</StatGrid>

				{erro && <ErrorBox>{erro}</ErrorBox>}

				{isLoading && (
					<EmptyState>
						<EmptyStateTitle>Carregando histórico...</EmptyStateTitle>
						Estamos buscando as últimas tarefas executadas pela sua imobiliária.
					</EmptyState>
				)}

				{!isLoading && !erro && tarefas.length === 0 && (
					<EmptyState>
						<EmptyStateTitle>Nenhuma busca encontrada ainda.</EmptyStateTitle>
						Quando você iniciar sua primeira captação, ela aparecerá aqui com
						status, progresso e resultados.
					</EmptyState>
				)}

				{!isLoading && tarefas.length > 0 && (
					<List>
						{tarefas.map((tarefa) => (
							<Item key={tarefa.id}>
								<ItemTop>
									<div>
										<Address>
											{tarefa.endereco.logradouro}, {tarefa.endereco.numero}
										</Address>
									</div>

									<StatusBadge status={tarefa.status} />
								</ItemTop>

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

								<ItemFooter>
									<Actions>
										<Link
											href={`/historico/${tarefa.id}`}
											passHref
											legacyBehavior
										>
											<DetailsLink>Ver detalhes</DetailsLink>
										</Link>
									</Actions>
								</ItemFooter>
							</Item>
						))}
					</List>
				)}
			</PageContainer>
		</>
	);
}