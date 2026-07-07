"use client";

import Link from "next/link";
import { AppHeader } from "../../components/AppHeader";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { listarTarefas } from "../../features/busca/api";
import type { TarefaResumo } from "../../features/busca/types";
import {
	Actions,
	Address,
	BackLink,
	DetailsLink,
	EmptyState,
	ErrorBox,
	Header,
	InfoBox,
	InfoGrid,
	InfoLabel,
	InfoValue,
	Item,
	ItemTop,
	List,
	PageContainer,
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
					<Link href="/" passHref legacyBehavior>
						<BackLink>← Voltar para nova busca</BackLink>
					</Link>

					<Title>Histórico de buscas</Title>

					<Subtitle>
						Acompanhe as últimas tarefas de captação executadas pelo sistema.
					</Subtitle>
				</Header>

				{erro && <ErrorBox>{erro}</ErrorBox>}

				{isLoading && <EmptyState>Carregando histórico...</EmptyState>}

				{!isLoading && !erro && tarefas.length === 0 && (
					<EmptyState>Nenhuma busca encontrada ainda.</EmptyState>
				)}

				{!isLoading && tarefas.length > 0 && (
					<List>
						{tarefas.map((tarefa) => (
							<Item key={tarefa.id}>
								<ItemTop>
									<Address>
										{tarefa.endereco.logradouro}, {tarefa.endereco.numero}
									</Address>

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
											{tarefa.progress.current}/{tarefa.progress.total} —{" "}
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

								<Actions>
									<Link
										href={`/historico/${tarefa.id}`}
										passHref
										legacyBehavior
									>
										<DetailsLink>Ver detalhes</DetailsLink>
									</Link>
								</Actions>
							</Item>
						))}
					</List>
				)}
			</PageContainer>
		</>
	);
}
