"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useRequireAuth } from "../hooks/useRequireAuth";
import Link from "next/link";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ProgressBar } from "../components/ProgressBar";
import { ResultCard } from "../components/ResultCard";
import { StatusBadge } from "../components/StatusBadge";
import { buscarProgressoTarefa, criarTarefaBusca } from "../features/busca/api";
import type { ProgressoTarefaResponse } from "../features/busca/types";
import {
	Actions,
	EmptyState,
	ErrorBox,
	FormGrid,
	Header,
	PageContainer,
	ProductBadge,
	ResultsCount,
	ResultsHeader,
	ResultsList,
	ResultsSection,
	ResultsTitle,
	Subtitle,
	TaskId,
	Title,
	HeaderActions,
	HeaderLink,
} from "./page.styles";

export default function HomePage() {
	const { isCheckingAuth } = useRequireAuth();

	const [logradouro, setLogradouro] = useState(
		"RUA DESEMBARGADOR JORGE FONTANA"
	);
	const [numero, setNumero] = useState("200");

	const [jobId, setJobId] = useState<string | null>(null);
	const [progresso, setProgresso] = useState<ProgressoTarefaResponse | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	const isFinalizado = useMemo(() => {
		return (
			progresso?.status === "COMPLETED" ||
			progresso?.status === "ERROR" ||
			progresso?.status === "CANCELED"
		);
	}, [progresso?.status]);

	async function criarTarefa(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setProgresso(null);
		setJobId(null);
		setIsLoading(true);

		try {
			const data = await criarTarefaBusca({
				logradouro,
				numero,
			});

			setJobId(data.jobId);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao criar tarefa"
			);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (!jobId || isFinalizado) {
			return;
		}

		let isMounted = true;

		async function carregarProgresso() {
			if (!jobId) {
				return;
			}

			try {
				const data = await buscarProgressoTarefa(jobId);

				if (isMounted) {
					setProgresso(data);
				}
			} catch (error) {
				if (isMounted) {
					setErro(
						error instanceof Error
							? error.message
							: "Erro desconhecido ao buscar progresso"
					);
				}
			}
		}

		carregarProgresso();

		const interval = window.setInterval(carregarProgresso, 3000);

		return () => {
			isMounted = false;
			window.clearInterval(interval);
		};
	}, [jobId, isFinalizado]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<Header>
					<ProductBadge>Imóvel Prático</ProductBadge>

					<Title>Captação inteligente de imóveis</Title>

					<Subtitle>
						Inicie uma busca por endereço, acompanhe o progresso da tarefa e
						veja os proprietários encontrados automaticamente.
					</Subtitle>

					<HeaderActions>
						<Link href="/historico" passHref legacyBehavior>
							<HeaderLink>Ver histórico de buscas</HeaderLink>
						</Link>
					</HeaderActions>
				</Header>

				<Card>
					<form onSubmit={criarTarefa}>
						<FormGrid>
							<Input
								label="Logradouro"
								value={logradouro}
								onChange={(event) => setLogradouro(event.target.value)}
								placeholder="Ex: Rua Desembargador Jorge Fontana"
								required
							/>

							<Input
								label="Número"
								value={numero}
								onChange={(event) => setNumero(event.target.value)}
								placeholder="Ex: 200"
								required
							/>
						</FormGrid>

						<Actions>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Criando tarefa..." : "Iniciar busca"}
							</Button>

							{progresso?.status && <StatusBadge status={progresso.status} />}

							{jobId && <TaskId>Tarefa: {jobId}</TaskId>}
						</Actions>
					</form>

					{erro && <ErrorBox>{erro}</ErrorBox>}

					{progresso && (
						<ProgressBar
							status={progresso.status}
							total={progresso.progress.total}
							current={progresso.progress.current}
							percentage={progresso.progress.percentage}
						/>
					)}

					{jobId && !progresso && !erro && (
						<EmptyState>Carregando progresso da tarefa...</EmptyState>
					)}

					{progresso?.resultados && progresso.resultados.length > 0 && (
						<ResultsSection>
							<ResultsHeader>
								<ResultsTitle>Resultados encontrados</ResultsTitle>
								<ResultsCount>
									{progresso.resultados.length} resultado(s)
								</ResultsCount>
							</ResultsHeader>

							<ResultsList>
								{progresso.resultados.map((resultado) => (
									<ResultCard key={resultado.id} resultado={resultado} />
								))}
							</ResultsList>
						</ResultsSection>
					)}
				</Card>
			</PageContainer>
		</>
	);
}
