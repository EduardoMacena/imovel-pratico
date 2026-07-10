"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "../components/AppHeader";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ProgressBar } from "../components/ProgressBar";
import { ResultCard } from "../components/ResultCard";
import { StatusBadge } from "../components/StatusBadge";
import {
	buscarProgressoTarefa,
	criarTarefaBusca,
	buscarMinhaAssinatura,
} from "../features/busca/api";
import type {
	ProgressoTarefaResponse,
	MinhaAssinaturaResponse,
} from "../features/busca/types";
import { SubscriptionSummary } from "../components/SubscriptionSummary";
import {
	Actions,
	EmptyState,
	ErrorBox,
	FormGrid,
	HeaderActions,
	HeaderLink,
	HeroContent,
	HeroGrid,
	HeroPanel,
	HeroPanelContent,
	HeroPanelEyebrow,
	HeroPanelGrid,
	HeroPanelItem,
	HeroPanelLabel,
	HeroPanelText,
	HeroPanelValue,
	InlineHint,
	MainGrid,
	PageContainer,
	ProductBadge,
	ProgressWrapper,
	ResultsCount,
	ResultsHeader,
	ResultsList,
	ResultsSection,
	ResultsTitle,
	SearchCardBody,
	SearchCardHeader,
	SearchDescription,
	SearchForm,
	SearchTitle,
	Sidebar,
	SidebarCard,
	SidebarDescription,
	SidebarList,
	SidebarListItem,
	SidebarTitle,
	Subtitle,
	TaskId,
	Title,
} from "./page.styles";

export default function HomePage() {
	const { isCheckingAuth } = useRequireAuth();

	const [logradouro, setLogradouro] = useState(
		"RUA DESEMBARGADOR JORGE FONTANA"
	);
	const [numero, setNumero] = useState("200");

	const [assinatura, setAssinatura] = useState<MinhaAssinaturaResponse | null>(
		null
	);

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

	async function carregarAssinatura() {
		try {
			const data = await buscarMinhaAssinatura();

			setAssinatura(data);
		} catch (error) {
			setErro(
				error instanceof Error ? error.message : "Erro ao carregar assinatura"
			);
		}
	}

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
		if (!isCheckingAuth) {
			carregarAssinatura();

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
		}
	}, [jobId, isFinalizado, isCheckingAuth]);

	if (isCheckingAuth) {
		return null;
	}

	const buscaBloqueada =
		assinatura?.cliente.pagamentoStatus !== "PAGO" ||
		assinatura?.cliente.status !== "ATIVO" ||
		assinatura?.plano.status !== "ATIVO" ||
		assinatura?.uso.consultasRestantes === 0;

	return (
		<>
			<AppHeader />

			<PageContainer>
				<HeroGrid>
					<HeroContent>
						<ProductBadge>Imóvel Prático</ProductBadge>

						<Title>Captação inteligente de proprietários</Title>

						<Subtitle>
							Inicie uma busca por endereço, acompanhe o processamento em
							tempo real e visualize contatos enriquecidos em uma operação
							simples, organizada e profissional.
						</Subtitle>

						<HeaderActions>
							<Link href="/historico" passHref legacyBehavior>
								<HeaderLink>Ver histórico de buscas</HeaderLink>
							</Link>
						</HeaderActions>
					</HeroContent>

					<HeroPanel>
						<HeroPanelContent>
							<HeroPanelEyebrow>Fluxo da busca</HeroPanelEyebrow>

							<HeroPanelText>
								Endereço informado, índice cadastral localizado, proprietário
								identificado e contato enriquecido em uma única jornada.
							</HeroPanelText>

							<HeroPanelGrid>
								<HeroPanelItem>
									<HeroPanelLabel>Plano</HeroPanelLabel>
									<HeroPanelValue>
										{assinatura?.plano.nome ?? "Carregando"}
									</HeroPanelValue>
								</HeroPanelItem>

								<HeroPanelItem>
									<HeroPanelLabel>Restantes</HeroPanelLabel>
									<HeroPanelValue>
										{assinatura?.uso.consultasRestantes ?? "-"}
									</HeroPanelValue>
								</HeroPanelItem>

								<HeroPanelItem>
									<HeroPanelLabel>Status</HeroPanelLabel>
									<HeroPanelValue>
										{assinatura?.cliente.pagamentoStatus ?? "-"}
									</HeroPanelValue>
								</HeroPanelItem>
							</HeroPanelGrid>
						</HeroPanelContent>
					</HeroPanel>
				</HeroGrid>

				<MainGrid>
					<div>
						<Card>
							<SearchCardHeader>
								<div>
									<SearchTitle>Nova busca</SearchTitle>
									<SearchDescription>
										Informe o logradouro e o número do imóvel para iniciar a
										captação automática.
									</SearchDescription>
								</div>

								{progresso?.status && <StatusBadge status={progresso.status} />}
							</SearchCardHeader>

							<SearchCardBody>
								{buscaBloqueada && assinatura && (
									<ErrorBox>
										{assinatura.cliente.pagamentoStatus !== "PAGO"
											? "Seu plano está pendente ou vencido. Regularize o pagamento para iniciar novas buscas."
											: "Você atingiu o limite mensal de consultas do seu plano."}
									</ErrorBox>
								)}

								<SearchForm onSubmit={criarTarefa}>
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
										<Button type="submit" disabled={isLoading || buscaBloqueada}>
											{isLoading ? "Criando tarefa..." : "Iniciar busca"}
										</Button>

										<InlineHint>
											A busca respeita o limite e o intervalo do seu plano.
										</InlineHint>
									</Actions>
								</SearchForm>

								{jobId && <TaskId>Tarefa: {jobId}</TaskId>}

								{erro && <ErrorBox>{erro}</ErrorBox>}

								{progresso && (
									<ProgressWrapper>
										<ProgressBar
											status={progresso.status}
											total={progresso.progress.total}
											current={progresso.progress.current}
											percentage={progresso.progress.percentage}
										/>
									</ProgressWrapper>
								)}

								{jobId && !progresso && !erro && (
									<EmptyState>
										Carregando progresso da tarefa. Assim que o processamento
										iniciar, os resultados aparecerão aqui.
									</EmptyState>
								)}
							</SearchCardBody>
						</Card>

						{progresso?.resultados && progresso.resultados.length > 0 && (
							<ResultsSection>
								<ResultsHeader>
									<div>
										<ResultsTitle>Resultados encontrados</ResultsTitle>
										<ResultsCount>
											{progresso.resultados.length} resultado(s) localizado(s)
										</ResultsCount>
									</div>
								</ResultsHeader>

								<ResultsList>
									{progresso.resultados.map((resultado) => (
										<ResultCard key={resultado.id} resultado={resultado} />
									))}
								</ResultsList>
							</ResultsSection>
						)}
					</div>

					<Sidebar>
						{assinatura && <SubscriptionSummary assinatura={assinatura} />}

						<SidebarCard>
							<SidebarTitle>Como obter melhores resultados</SidebarTitle>

							<SidebarDescription>
								Use endereços completos e revise a grafia antes de iniciar a
								busca. Isso reduz tentativas inválidas e melhora a precisão da
								captação.
							</SidebarDescription>

							<SidebarList>
								<SidebarListItem>
									Digite o logradouro sem abreviações excessivas.
								</SidebarListItem>

								<SidebarListItem>
									Confirme o número antes de iniciar a tarefa.
								</SidebarListItem>

								<SidebarListItem>
									Acompanhe o histórico para consultar buscas anteriores.
								</SidebarListItem>
							</SidebarList>
						</SidebarCard>
					</Sidebar>
				</MainGrid>
			</PageContainer>
		</>
	);
}