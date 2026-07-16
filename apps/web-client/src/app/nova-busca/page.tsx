"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { ProgressBar } from "../../components/ProgressBar";
import { ResultCard } from "../../components/ResultCard";
import { StatusBadge } from "../../components/StatusBadge";
import { SubscriptionSummary } from "../../components/SubscriptionSummary";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import {
	buscarMinhaAssinatura,
	buscarPrevia,
	buscarProgressoTarefa,
	cancelarPrevia,
	criarTarefaBusca,
	listarPreviasPendentes,
	preverBusca,
} from "../../features/busca/api";
import type {
	BuscaPreviaStatus,
	MinhaAssinaturaResponse,
	PreverBuscaResponse,
	ProgressoTarefaResponse,
} from "../../features/busca/types";
import { useRealtimeEvents } from "../../features/realtime/useRealtimeEvents";
import { formatCurrencyFromCents, formatNumberBR } from "../../lib/formatters";
import {
	Actions,
	EmptyState,
	ErrorBox,
	FormGrid,
	HeaderActions,
	HeaderLink,
	HeroCard,
	HeroContent,
	HeroEyebrow,
	HeroGrid,
	HeroPanel,
	HeroPanelGrid,
	HeroPanelItem,
	HeroPanelLabel,
	HeroPanelValue,
	HeroSubtitle,
	HeroTitle,
	InlineHint,
	MainGrid,
	NoResultsBox,
	NoResultsTitle,
	ModalActions,
	ModalCancelButton,
	ModalCard,
	ModalConfirmButton,
	ModalEyebrow,
	ModalGrid,
	ModalInfo,
	ModalOverlay,
	ModalText,
	ModalTitle,
	OperationCard,
	OperationCardBody,
	OperationCardHeader,
	OperationDescription,
	OperationEyebrow,
	OperationForm,
	OperationTitle,
	PageContainer,
	PageShell,
	PendingPreviewActions,
	PendingPreviewItem,
	PendingPreviewList,
	PreviewActions,
	PreviewBadge,
	PreviewCard,
	PreviewGrid,
	PreviewHeader,
	PreviewInfo,
	PreviewList,
	PreviewListItem,
	PreviewStatus,
	PreviewStatusBadge,
	PreviewSubtitle,
	PreviewTitle,
	ProgressWrapper,
	ResultsCount,
	ResultsHeader,
	ResultsList,
	ResultsSection,
	ResultsTitle,
	Sidebar,
	SidebarCard,
	SidebarDescription,
	SidebarList,
	SidebarListItem,
	SidebarTitle,
	SmallActionButton,
	SmallDangerButton,
	TaskId,
} from "./page.styles";

const STATUS_PROCESSANDO_PREVIA: BuscaPreviaStatus[] = [
	"PROCESSANDO",
	"AGUARDANDO_INTERVALO",
	"CONSULTANDO_REGISTRO",
	"AUTORIZANDO",
];

const STATUS_COM_POLLING: BuscaPreviaStatus[] = [
	"PROCESSANDO",
	"AGUARDANDO_INTERVALO",
	"CONSULTANDO_REGISTRO",
	"AUTORIZANDO",
	"PRONTA",
	"AGUARDANDO_AUTORIZACAO_EXCEDENTE",
];

function getPreviaStatusLabel(status: BuscaPreviaStatus) {
	const labels: Record<BuscaPreviaStatus, string> = {
		PENDENTE: "Pendente",
		PROCESSANDO: "Processando",
		AGUARDANDO_INTERVALO: "Aguardando intervalo do 1RIBH",
		CONSULTANDO_REGISTRO: "Consultando 1RIBH",
		PRONTA: "Prévia pronta",
		AGUARDANDO_AUTORIZACAO_EXCEDENTE: "Aguardando autorização",
		AUTORIZANDO: "Autorizando",
		CONFIRMADA: "Confirmada",
		CANCELADA: "Cancelada",
		EXPIRADA: "Expirada",
		ERRO: "Erro",
	};

	return labels[status] ?? status;
}

function getPreviaStatusVariant(status: BuscaPreviaStatus) {
	if (status === "PRONTA" || status === "CONFIRMADA") {
		return "success" as const;
	}

	if (
		status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE" ||
		status === "AGUARDANDO_INTERVALO" ||
		status === "AUTORIZANDO"
	) {
		return "warning" as const;
	}

	if (status === "ERRO" || status === "CANCELADA" || status === "EXPIRADA") {
		return "danger" as const;
	}

	return "info" as const;
}

function NovaBuscaContent() {
	const { isCheckingAuth } = useRequireAuth();
	const searchParams = useSearchParams();

	const [logradouro, setLogradouro] = useState(
		() => searchParams.get("logradouro") ?? ""
	);

	const [numero, setNumero] = useState(() => searchParams.get("numero") ?? "");

	const [assinatura, setAssinatura] = useState<MinhaAssinaturaResponse | null>(
		null
	);

	const [jobId, setJobId] = useState<string | null>(null);
	const [progresso, setProgresso] = useState<ProgressoTarefaResponse | null>(
		null
	);

	const [previaBusca, setPreviaBusca] = useState<PreverBuscaResponse | null>(
		null
	);

	const [avisoExcedente, setAvisoExcedente] =
		useState<PreverBuscaResponse | null>(null);

	const [pendencias, setPendencias] = useState<PreverBuscaResponse[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingPendencias, setIsLoadingPendencias] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	const isFinalizado = useMemo(() => {
		return (
			progresso?.status === "COMPLETED" ||
			progresso?.status === "ERROR" ||
			progresso?.status === "CANCELED"
		);
	}, [progresso?.status]);

	const buscaBloqueada =
		!assinatura ||
		assinatura.cliente.pagamentoStatus !== "PAGO" ||
		assinatura.cliente.status !== "ATIVO" ||
		assinatura.plano.status !== "ATIVO";

	const previaProcessando =
		previaBusca &&
		STATUS_PROCESSANDO_PREVIA.includes(previaBusca.previa.status);

	const previaSemRegistros =
		previaBusca?.previa.status === "PRONTA" &&
		previaBusca.previa.quantidadeRegistros <= 0;

	const previaProntaSemExcedente =
		previaBusca?.previa.status === "PRONTA" &&
		previaBusca.previa.quantidadeRegistros > 0 &&
		!previaBusca.precisaConfirmarExcedente;

	const previaAguardandoExcedente =
		previaBusca?.previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE" &&
		previaBusca.previa.quantidadeRegistros > 0;

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

	async function carregarPendencias() {
		try {
			setIsLoadingPendencias(true);

			const data = await listarPreviasPendentes();

			setPendencias(data.previas);
		} catch (error) {
			console.error("Erro ao carregar pendências:", error);
		} finally {
			setIsLoadingPendencias(false);
		}
	}

	async function criarTarefaComPrevia(
		previaId: string,
		confirmarExcedente: boolean
	) {
		const previaSelecionada =
			previaBusca?.previa.id === previaId
				? previaBusca
				: pendencias.find((item) => item.previa.id === previaId);

		if (
			previaSelecionada?.previa.status === "PRONTA" &&
			previaSelecionada.previa.quantidadeRegistros <= 0
		) {
			setErro(
				"Não é possível iniciar o processamento porque o 1RIBH não encontrou imóveis para este endereço."
			);
			return;
		}

		setErro(null);
		setIsLoading(true);

		try {
			const data = await criarTarefaBusca({
				previaId,
				confirmarExcedente,
			});

			if (data.precisaConfirmarExcedente) {
				setAvisoExcedente(data);
				setPreviaBusca(data);
				return;
			}

			setAvisoExcedente(null);

			if (!data.jobId) {
				throw new Error("Tarefa criada, mas o ID do job não foi retornado");
			}

			setJobId(data.jobId);
			setPreviaBusca(data);

			await carregarAssinatura();
			await carregarPendencias();
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

	async function iniciarFluxoBusca(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setProgresso(null);
		setJobId(null);
		setPreviaBusca(null);
		setAvisoExcedente(null);
		setIsLoading(true);

		try {
			const previa = await preverBusca({
				logradouro,
				numero,
			});

			setPreviaBusca(previa);

			if (previa.previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE") {
				setAvisoExcedente(previa);
			}

			await carregarPendencias();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao criar prévia"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function revisarPendencia(previaId: string) {
		setErro(null);
		setIsLoading(true);

		try {
			const atualizada = await buscarPrevia(previaId);

			setPreviaBusca(atualizada);

			if (atualizada.previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE") {
				setAvisoExcedente(atualizada);
			} else {
				setAvisoExcedente(null);
			}
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao revisar prévia"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function cancelarPreviaPorId(previaId: string) {
		setErro(null);
		setIsLoading(true);

		try {
			await cancelarPrevia(previaId);

			if (previaBusca?.previa.id === previaId) {
				setPreviaBusca(null);
			}

			if (avisoExcedente?.previa.id === previaId) {
				setAvisoExcedente(null);
			}

			await carregarPendencias();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao cancelar prévia"
			);
		} finally {
			setIsLoading(false);
		}
	}

	useRealtimeEvents(
		(event) => {
			if (isCheckingAuth) {
				return;
			}

			if (event.type === "busca_previa.updated") {
				void carregarPendencias();

				if (previaBusca?.previa.id === event.previaId) {
					void buscarPrevia(event.previaId).then((atualizada) => {
						setPreviaBusca(atualizada);

						if (
							atualizada.previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE"
						) {
							setAvisoExcedente(atualizada);
						}
					});
				}
			}

			if (event.type === "pendencias.updated") {
				void carregarPendencias();
			}

			if (
				event.type === "tarefa.progress" ||
				event.type === "tarefa.completed"
			) {
				if (jobId === event.tarefaId || progresso?.id === event.tarefaId) {
					void buscarProgressoTarefa(event.tarefaId).then(setProgresso);
				}

				if (event.type === "tarefa.completed") {
					void carregarAssinatura();
					void carregarPendencias();
				}
			}
		},
		[isCheckingAuth, previaBusca?.previa.id, jobId, progresso?.id]
	);

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarAssinatura();
			carregarPendencias();
		}
	}, [isCheckingAuth]);

	useEffect(() => {
		if (isCheckingAuth) {
			return;
		}

		const interval = window.setInterval(() => {
			carregarPendencias();
		}, 60000);

		return () => window.clearInterval(interval);
	}, [isCheckingAuth]);

	useEffect(() => {
		if (!previaBusca?.previa.id) {
			return;
		}

		if (!STATUS_COM_POLLING.includes(previaBusca.previa.status)) {
			return;
		}

		if (
			previaBusca.previa.status === "PRONTA" ||
			previaBusca.previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE"
		) {
			return;
		}

		let isMounted = true;

		async function atualizarPrevia() {
			if (!previaBusca?.previa.id) {
				return;
			}

			try {
				const atualizada = await buscarPrevia(previaBusca.previa.id);

				if (!isMounted) {
					return;
				}

				setPreviaBusca(atualizada);

				if (atualizada.previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE") {
					setAvisoExcedente(atualizada);
				}

				await carregarPendencias();
			} catch (error) {
				if (isMounted) {
					setErro(
						error instanceof Error
							? error.message
							: "Erro desconhecido ao atualizar prévia"
					);
				}
			}
		}

		const interval = window.setInterval(atualizarPrevia, 3000);

		return () => {
			isMounted = false;
			window.clearInterval(interval);
		};
	}, [previaBusca?.previa.id, previaBusca?.previa.status]);

	useEffect(() => {
		if (isCheckingAuth || !jobId || isFinalizado) {
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
	}, [jobId, isFinalizado, isCheckingAuth]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			{avisoExcedente?.excedente && (
				<ModalOverlay>
					<ModalCard>
						<ModalEyebrow>Autorização individual</ModalEyebrow>

						<ModalTitle>Esta busca pode gerar cobrança adicional</ModalTitle>

						<ModalText>
							O 1RIBH encontrou {avisoExcedente.previa.quantidadeRegistros}{" "}
							registro(s) para este endereço. Seu plano ainda possui{" "}
							{avisoExcedente.excedente.consultasDisponiveisNoMomento}{" "}
							consulta(s) inclusas disponíveis neste momento.
						</ModalText>

						<ModalGrid>
							<ModalInfo>
								<strong>Registros encontrados</strong>
								<span>
									{formatNumberBR(avisoExcedente.previa.quantidadeRegistros)}
								</span>
							</ModalInfo>

							<ModalInfo>
								<strong>Consultas disponíveis</strong>
								<span>
									{formatNumberBR(
										avisoExcedente.excedente.consultasDisponiveisNoMomento
									)}
								</span>
							</ModalInfo>

							<ModalInfo>
								<strong>Consultas excedentes</strong>
								<span>
									{formatNumberBR(
										avisoExcedente.excedente.consultasExcedentesEstimadas
									)}
								</span>
							</ModalInfo>

							<ModalInfo>
								<strong>Valor adicional estimado</strong>
								<span>
									{formatCurrencyFromCents(
										avisoExcedente.excedente.valorExcedenteEstimadoCentavos
									)}
								</span>
							</ModalInfo>
						</ModalGrid>

						<ModalText>
							Esta autorização vale somente para esta busca. As outras
							pendências precisam ser revisadas individualmente.
						</ModalText>

						<ModalActions>
							<ModalCancelButton
								type="button"
								disabled={isLoading}
								onClick={() => cancelarPreviaPorId(avisoExcedente.previa.id)}
							>
								Cancelar esta busca
							</ModalCancelButton>

							<ModalConfirmButton
								type="button"
								disabled={isLoading}
								onClick={() =>
									criarTarefaComPrevia(avisoExcedente.previa.id, true)
								}
							>
								{isLoading ? "Autorizando..." : "Autorizar esta busca"}
							</ModalConfirmButton>
						</ModalActions>
					</ModalCard>
				</ModalOverlay>
			)}

			<PageShell>
				<PageContainer>
					<HeroGrid>
						<HeroCard>
							<HeroContent>
								<HeroEyebrow>Nova busca inteligente</HeroEyebrow>

								<HeroTitle>
									Consulte a prévia antes de iniciar o processamento.
								</HeroTitle>

								<HeroSubtitle>
									A prévia entra em uma fila segura do 1RIBH. Mesmo se você sair
									da tela, ela continua processando e poderá ser revisada
									depois.
								</HeroSubtitle>

								<HeaderActions>
									<Link href="/" passHref legacyBehavior>
										<HeaderLink>Voltar ao dashboard</HeaderLink>
									</Link>

									<Link href="/historico" passHref legacyBehavior>
										<HeaderLink>Ver histórico</HeaderLink>
									</Link>
								</HeaderActions>
							</HeroContent>
						</HeroCard>

						<HeroPanel>
							<HeroPanelGrid>
								<HeroPanelItem>
									<HeroPanelLabel>Plano</HeroPanelLabel>
									<HeroPanelValue>
										{assinatura?.plano.nome ?? "-"}
									</HeroPanelValue>
								</HeroPanelItem>

								<HeroPanelItem>
									<HeroPanelLabel>Inclusas restantes</HeroPanelLabel>
									<HeroPanelValue>
										{assinatura?.uso.consultasRestantes ?? "-"}
									</HeroPanelValue>
								</HeroPanelItem>

								<HeroPanelItem>
									<HeroPanelLabel>Pendências</HeroPanelLabel>
									<HeroPanelValue>{pendencias.length}</HeroPanelValue>
								</HeroPanelItem>
							</HeroPanelGrid>
						</HeroPanel>
					</HeroGrid>

					<MainGrid>
						<div>
							<OperationCard>
								<OperationCardHeader>
									<div>
										<OperationEyebrow>Prévia operacional</OperationEyebrow>
										<OperationTitle>Dados do imóvel</OperationTitle>
										<OperationDescription>
											Primeiro o sistema cria a prévia e consulta o 1RIBH em
											fila. Depois você revisa os registros antes de iniciar a
											tarefa de CPF e contato.
										</OperationDescription>
									</div>

									{progresso?.status && (
										<StatusBadge status={progresso.status} />
									)}
								</OperationCardHeader>

								<OperationCardBody>
									{buscaBloqueada && assinatura && (
										<ErrorBox>
											Seu acesso está bloqueado por status operacional, plano
											inativo ou pendência financeira.
										</ErrorBox>
									)}

									{!assinatura && (
										<EmptyState>
											Carregando dados da assinatura antes de liberar novas
											buscas.
										</EmptyState>
									)}

									<OperationForm onSubmit={iniciarFluxoBusca}>
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
											<Button
												type="submit"
												disabled={isLoading || buscaBloqueada}
											>
												{isLoading ? "Criando prévia..." : "Consultar prévia"}
											</Button>

											<InlineHint>
												A prévia é processada em segundo plano. O sistema
												respeita o intervalo mínimo do 1RIBH e evita consultas
												repetidas.
											</InlineHint>
										</Actions>
									</OperationForm>

									{previaBusca && (
										<PreviewCard>
											<PreviewHeader>
												<div>
													<PreviewTitle>
														{previaProcessando
															? "Prévia em processamento"
															: "Prévia da busca"}
													</PreviewTitle>

													<PreviewSubtitle>
														{previaProcessando
															? "Sua consulta está na fila do 1RIBH. Você pode sair desta tela e voltar depois."
															: "Esta é a lista retornada pelo 1RIBH. O worker-cnd usará estes registros salvos, sem consultar o 1RIBH novamente."}
													</PreviewSubtitle>

													<PreviewStatus>
														<PreviewStatusBadge
															$variant={getPreviaStatusVariant(
																previaBusca.previa.status
															)}
														>
															{getPreviaStatusLabel(previaBusca.previa.status)}
														</PreviewStatusBadge>
													</PreviewStatus>
												</div>

												<PreviewBadge>
													{formatNumberBR(
														previaBusca.previa.quantidadeRegistros
													)}{" "}
													registro(s)
												</PreviewBadge>
											</PreviewHeader>

											<PreviewGrid>
												<PreviewInfo>
													<strong>Logradouro</strong>
													<span>{previaBusca.previa.logradouro}</span>
												</PreviewInfo>

												<PreviewInfo>
													<strong>Número</strong>
													<span>{previaBusca.previa.numero}</span>
												</PreviewInfo>

												<PreviewInfo>
													<strong>Excedente estimado</strong>
													<span>
														{formatCurrencyFromCents(
															previaBusca.excedente
																.valorExcedenteEstimadoCentavos
														)}
													</span>
												</PreviewInfo>
											</PreviewGrid>

											{previaBusca.previa.erro && (
												<ErrorBox>{previaBusca.previa.erro}</ErrorBox>
											)}

											{previaSemRegistros && (
												<NoResultsBox>
													<NoResultsTitle>
														Nenhum imóvel encontrado para este endereço.
													</NoResultsTitle>

													<p>
														O 1RIBH não retornou índice cadastral para o
														logradouro e número informados. Confira se o
														endereço está correto, ajuste os dados e tente uma
														nova busca.
													</p>
												</NoResultsBox>
											)}

											{previaProcessando && (
												<EmptyState>
													A prévia ainda está sendo processada. Assim que
													estiver pronta, esta tela será atualizada
													automaticamente.
												</EmptyState>
											)}

											{previaBusca.previa.registros.length > 0 && (
												<PreviewList>
													{previaBusca.previa.registros.map(
														(registro, index) => (
															<PreviewListItem
																key={`${registro.indiceCadastral}-${index}`}
															>
																<strong>{registro.indiceCadastral}</strong>
																<span>
																	{registro.complemento ?? "Sem complemento"}
																</span>
															</PreviewListItem>
														)
													)}
												</PreviewList>
											)}

											<PreviewActions>
												{previaProntaSemExcedente && (
													<Button
														type="button"
														disabled={isLoading}
														onClick={() =>
															criarTarefaComPrevia(previaBusca.previa.id, false)
														}
													>
														{isLoading
															? "Iniciando..."
															: "Iniciar processamento"}
													</Button>
												)}

												{previaAguardandoExcedente && (
													<Button
														type="button"
														disabled={isLoading}
														onClick={() => setAvisoExcedente(previaBusca)}
													>
														Revisar autorização
													</Button>
												)}

												{!["CONFIRMADA", "CANCELADA", "EXPIRADA"].includes(
													previaBusca.previa.status
												) && (
													<Button
														type="button"
														variant="danger"
														disabled={isLoading}
														onClick={() =>
															cancelarPreviaPorId(previaBusca.previa.id)
														}
													>
														Cancelar prévia
													</Button>
												)}
											</PreviewActions>
										</PreviewCard>
									)}

									{jobId && <TaskId>Tarefa ativa: {jobId}</TaskId>}

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
								</OperationCardBody>
							</OperationCard>

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
								<SidebarTitle>Central de pendências</SidebarTitle>

								<SidebarDescription>
									Pendências precisam ser revisadas uma por uma. O sistema não
									permite autorizar todas de uma vez, porque o excedente é
									recalculado a cada confirmação.
								</SidebarDescription>

								{isLoadingPendencias && (
									<EmptyState>Atualizando pendências...</EmptyState>
								)}

								{!isLoadingPendencias && pendencias.length === 0 && (
									<SidebarList>
										<SidebarListItem>
											Nenhuma prévia pendente no momento.
										</SidebarListItem>
									</SidebarList>
								)}

								{!isLoadingPendencias && pendencias.length > 0 && (
									<PendingPreviewList>
										{pendencias.map((item) => {
											const itemSemRegistros =
												item.previa.status === "PRONTA" &&
												item.previa.quantidadeRegistros <= 0;

											return (
												<PendingPreviewItem key={item.previa.id}>
													<strong>
														{item.previa.logradouro}, nº {item.previa.numero}
													</strong>

													<span>
														{itemSemRegistros ? (
															<>
																Sem imóveis encontrados · confira o endereço e
																faça uma nova busca.
															</>
														) : (
															<>
																{getPreviaStatusLabel(item.previa.status)} ·{" "}
																{formatNumberBR(
																	item.previa.quantidadeRegistros
																)}{" "}
																registro(s) · Excedente estimado:{" "}
																{formatCurrencyFromCents(
																	item.excedente.valorExcedenteEstimadoCentavos
																)}
															</>
														)}
													</span>

													<PendingPreviewActions>
														{!itemSemRegistros && (
															<SmallActionButton
																type="button"
																disabled={isLoading}
																onClick={() => revisarPendencia(item.previa.id)}
															>
																Revisar
															</SmallActionButton>
														)}

														<SmallDangerButton
															type="button"
															disabled={isLoading}
															onClick={() =>
																cancelarPreviaPorId(item.previa.id)
															}
														>
															{itemSemRegistros ? "Descartar" : "Cancelar"}
														</SmallDangerButton>
													</PendingPreviewActions>
												</PendingPreviewItem>
											);
										})}
									</PendingPreviewList>
								)}
							</SidebarCard>

							<SidebarCard>
								<SidebarTitle>Fluxo protegido</SidebarTitle>

								<SidebarDescription>
									A prévia evita cobrança surpresa e também evita consultar o
									1RIBH duas vezes para o mesmo endereço.
								</SidebarDescription>

								<SidebarList>
									<SidebarListItem>
										Primeiro o sistema cria uma prévia em fila.
									</SidebarListItem>

									<SidebarListItem>
										Depois calcula se haverá consulta excedente.
									</SidebarListItem>

									<SidebarListItem>
										Ao confirmar, o worker-cnd usa a prévia já salva.
									</SidebarListItem>
								</SidebarList>
							</SidebarCard>
						</Sidebar>
					</MainGrid>
				</PageContainer>
			</PageShell>
		</>
	);
}

export default function NovaBuscaPage() {
	return (
		<Suspense fallback={null}>
			<NovaBuscaContent />
		</Suspense>
	);
}
