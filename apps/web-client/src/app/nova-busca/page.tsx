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
	preverBuscaPorCodigos,
} from "../../features/busca/api";
import {
	MAX_CODIGOS_POR_PREVIA,
	analisarCodigosParaInterface,
} from "../../features/busca/codigos-cadastrais";
import type {
	BuscaPreviaStatus,
	MinhaAssinaturaResponse,
	PreverBuscaResponse,
	ProgressoTarefaResponse,
	ResumoCodigosCadastrais,
	TipoBusca,
} from "../../features/busca/types";
import { useRealtimeEvents } from "../../features/realtime/useRealtimeEvents";
import { formatCurrencyFromCents, formatNumberBR } from "../../lib/formatters";
import {
	Actions,
	CodeFeedback,
	CodeFeedbackList,
	CodeFeedbackTitle,
	CodeSummaryGrid,
	CodeSummaryItem,
	CodeSummaryLabel,
	CodeSummaryValue,
	CodigosField,
	CodigosHint,
	CodigosLabel,
	CodigosTextarea,
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
	SearchModeButton,
	SearchModeDescription,
	SearchModeSelector,
	SearchModeTitle,
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

function getTipoBuscaLabel(tipoBusca: TipoBusca) {
	return tipoBusca === "CODIGOS_CADASTRAIS"
		? "Códigos cadastrais"
		: "Endereço";
}

function formatQuantidadePrevia(
	quantidade: number,
	tipoBusca: TipoBusca
) {
	if (tipoBusca === "CODIGOS_CADASTRAIS") {
		return quantidade === 1
			? "1 código cadastral"
			: `${formatNumberBR(quantidade)} códigos cadastrais`;
	}

	return quantidade === 1
		? "1 registro"
		: `${formatNumberBR(quantidade)} registros`;
}

function getPendenciaTitle(previa: PreverBuscaResponse["previa"]) {
	if (previa.tipoBusca === "CODIGOS_CADASTRAIS") {
		return formatQuantidadePrevia(
			previa.quantidadeRegistros,
			previa.tipoBusca
		);
	}

	return `${previa.logradouro}, nº ${previa.numero}`;
}

function getMotivoCodigoInvalido(
	motivo: ResumoCodigosCadastrais["codigosInvalidos"][number]["motivo"]
) {
	return motivo === "TAMANHO_INVALIDO"
		? "tamanho inválido"
		: "caracteres não permitidos";
}

type CriarTarefaBuscaResponseComIds = Awaited<ReturnType<typeof criarTarefaBusca>> & {
	jobId?: string | null;
	tarefaId?: string | null;
	tarefa?: {
		id?: string | null;
	} | null;
};

function extrairTarefaIdCriada(data: CriarTarefaBuscaResponseComIds) {
	return data.tarefa?.id ?? data.tarefaId ?? data.jobId ?? null;
}

function NovaBuscaContent() {
	const { isCheckingAuth } = useRequireAuth();
	const searchParams = useSearchParams();

	const [tipoBusca, setTipoBusca] = useState<TipoBusca>(() =>
		searchParams.get("tipoBusca") === "codigos"
			? "CODIGOS_CADASTRAIS"
			: "ENDERECO"
	);

	const [logradouro, setLogradouro] = useState(
		() => searchParams.get("logradouro") ?? ""
	);

	const [numero, setNumero] = useState(() => searchParams.get("numero") ?? "");
	const [codigos, setCodigos] = useState(() => searchParams.get("codigos") ?? "");

	const [assinatura, setAssinatura] = useState<MinhaAssinaturaResponse | null>(null);

	const [jobId, setJobId] = useState<string | null>(null);
	const [progresso, setProgresso] = useState<ProgressoTarefaResponse | null>(null);

	const [previaBusca, setPreviaBusca] = useState<PreverBuscaResponse | null>(null);

	const [avisoExcedente, setAvisoExcedente] = useState<PreverBuscaResponse | null>(null);

	const [pendencias, setPendencias] = useState<PreverBuscaResponse[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingPendencias, setIsLoadingPendencias] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	const analiseCodigos = useMemo(
		() => analisarCodigosParaInterface(codigos),
		[codigos]
	);

	const codigosAcimaDoLimite =
		analiseCodigos.totalRecebidos > MAX_CODIGOS_POR_PREVIA;

	const codigosProntosParaEnvio =
		analiseCodigos.totalValidos > 0 && !codigosAcimaDoLimite;

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

	const previaPorCodigos =
		previaBusca?.previa.tipoBusca === "CODIGOS_CADASTRAIS";

	const previaProcessando =
		previaBusca && STATUS_PROCESSANDO_PREVIA.includes(previaBusca.previa.status);

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
			setErro(error instanceof Error ? error.message : "Erro ao carregar assinatura");
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

	async function criarTarefaComPrevia(previaId: string, confirmarExcedente: boolean) {
		const previaSelecionada =
			previaBusca?.previa.id === previaId
				? previaBusca
				: pendencias.find((item) => item.previa.id === previaId);

		if (
			previaSelecionada?.previa.status === "PRONTA" &&
			previaSelecionada.previa.quantidadeRegistros <= 0
		) {
			setErro(
				previaSelecionada.previa.tipoBusca === "CODIGOS_CADASTRAIS"
					? "Não é possível iniciar o processamento porque a prévia não possui códigos cadastrais válidos."
					: "Não é possível iniciar o processamento porque o 1RIBH não encontrou imóveis para este endereço."
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

			const tarefaId = extrairTarefaIdCriada(data);

			if (!tarefaId) {
				throw new Error("Tarefa criada, mas o ID da tarefa não foi retornado");
			}

			setJobId(tarefaId);
			setPreviaBusca(data);

			await carregarAssinatura();
			await carregarPendencias();
		} catch (error) {
			setErro(
				error instanceof Error ? error.message : "Erro desconhecido ao criar tarefa"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function iniciarFluxoBusca(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (tipoBusca === "CODIGOS_CADASTRAIS" && codigosAcimaDoLimite) {
			setErro(
				`Informe no máximo ${MAX_CODIGOS_POR_PREVIA} códigos cadastrais por prévia.`
			);
			return;
		}

		if (tipoBusca === "CODIGOS_CADASTRAIS" && !codigosProntosParaEnvio) {
			setErro("Informe ao menos um código cadastral válido.");
			return;
		}

		setErro(null);
		setProgresso(null);
		setJobId(null);
		setPreviaBusca(null);
		setAvisoExcedente(null);
		setIsLoading(true);

		try {
			const previa =
				tipoBusca === "CODIGOS_CADASTRAIS"
					? await preverBuscaPorCodigos({
							codigos,
						})
					: await preverBusca({
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
				error instanceof Error ? error.message : "Erro desconhecido ao criar prévia"
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
				error instanceof Error ? error.message : "Erro desconhecido ao revisar prévia"
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
				error instanceof Error ? error.message : "Erro desconhecido ao cancelar prévia"
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

						if (atualizada.previa.status === "AGUARDANDO_AUTORIZACAO_EXCEDENTE") {
							setAvisoExcedente(atualizada);
						}
					});
				}
			}

			if (event.type === "pendencias.updated") {
				void carregarPendencias();
			}

			if (event.type === "tarefa.progress" || event.type === "tarefa.completed") {
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
							{avisoExcedente.previa.tipoBusca === "CODIGOS_CADASTRAIS" ? (
								<>
									Você informou{" "}
									{formatQuantidadePrevia(
										avisoExcedente.previa.quantidadeRegistros,
										avisoExcedente.previa.tipoBusca
									)}{" "}
									{avisoExcedente.previa.quantidadeRegistros === 1
										? "válido"
										: "válidos"}
									. Seu plano ainda possui{" "}
									{formatNumberBR(
										avisoExcedente.excedente.consultasDisponiveisNoMomento
									)}{" "}
									consulta(s) inclusas disponíveis neste momento.
								</>
							) : (
								<>
									O 1RIBH encontrou{" "}
									{formatQuantidadePrevia(
										avisoExcedente.previa.quantidadeRegistros,
										avisoExcedente.previa.tipoBusca
									)}{" "}
									para este endereço. Seu plano ainda possui{" "}
									{formatNumberBR(
										avisoExcedente.excedente.consultasDisponiveisNoMomento
									)}{" "}
									consulta(s) inclusas disponíveis neste momento.
								</>
							)}
						</ModalText>

						<ModalGrid>
							<ModalInfo>
								<strong>
									{avisoExcedente.previa.tipoBusca === "CODIGOS_CADASTRAIS"
										? "Códigos válidos"
										: "Registros encontrados"}
								</strong>
								<span>{formatNumberBR(avisoExcedente.previa.quantidadeRegistros)}</span>
							</ModalInfo>

							<ModalInfo>
								<strong>Consultas disponíveis</strong>
								<span>
									{formatNumberBR(avisoExcedente.excedente.consultasDisponiveisNoMomento)}
								</span>
							</ModalInfo>

							<ModalInfo>
								<strong>Consultas excedentes</strong>
								<span>
									{formatNumberBR(avisoExcedente.excedente.consultasExcedentesEstimadas)}
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
							Esta autorização vale somente para esta busca. As outras pendências precisam
							ser revisadas individualmente.
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
								onClick={() => criarTarefaComPrevia(avisoExcedente.previa.id, true)}
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

								<HeroTitle>Escolha a rota certa para cada captação.</HeroTitle>

								<HeroSubtitle>
									Localize imóveis por endereço com descoberta automática no 1RIBH ou
									informe códigos cadastrais diretamente. Em ambos os casos, você revisa
									a prévia e o eventual excedente antes do processamento.
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
									<HeroPanelValue>{assinatura?.plano.nome ?? "-"}</HeroPanelValue>
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
										<OperationTitle>
											{tipoBusca === "CODIGOS_CADASTRAIS"
												? "Consultar códigos cadastrais"
												: "Localizar por endereço"}
										</OperationTitle>
										<OperationDescription>
											{tipoBusca === "CODIGOS_CADASTRAIS"
												? "Cole os códigos já conhecidos. A prévia é criada imediatamente, sem consultar o Worker Registro ou o 1RIBH."
												: "O sistema consulta o 1RIBH em fila e salva os imóveis encontrados para você revisar antes da tarefa de CPF e contato."}
										</OperationDescription>
									</div>

									{progresso?.status && <StatusBadge status={progresso.status} />}
								</OperationCardHeader>

								<OperationCardBody>
									{buscaBloqueada && assinatura && (
										<ErrorBox>
											Seu acesso está bloqueado por status operacional, plano inativo ou
											pendência financeira.
										</ErrorBox>
									)}

									{!assinatura && (
										<EmptyState>
											Carregando dados da assinatura antes de liberar novas buscas.
										</EmptyState>
									)}

									<OperationForm onSubmit={iniciarFluxoBusca}>
										<SearchModeSelector
											role="radiogroup"
											aria-label="Escolha o tipo da busca"
										>
											<SearchModeButton
												type="button"
												role="radio"
												aria-checked={tipoBusca === "ENDERECO"}
												$active={tipoBusca === "ENDERECO"}
												onClick={() => {
													setTipoBusca("ENDERECO");
													setErro(null);
												}}
											>
												<SearchModeTitle>Busca por endereço</SearchModeTitle>
												<SearchModeDescription>
													Descobre os códigos automaticamente no 1RIBH.
												</SearchModeDescription>
											</SearchModeButton>

											<SearchModeButton
												type="button"
												role="radio"
												aria-checked={tipoBusca === "CODIGOS_CADASTRAIS"}
												$active={tipoBusca === "CODIGOS_CADASTRAIS"}
												onClick={() => {
													setTipoBusca("CODIGOS_CADASTRAIS");
													setErro(null);
												}}
											>
												<SearchModeTitle>Códigos cadastrais</SearchModeTitle>
												<SearchModeDescription>
													Usa os códigos informados sem consultar o 1RIBH.
												</SearchModeDescription>
											</SearchModeButton>
										</SearchModeSelector>

										{tipoBusca === "ENDERECO" ? (
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
										) : (
											<>
												<CodigosField htmlFor="codigos-cadastrais">
													<CodigosLabel>Códigos cadastrais</CodigosLabel>
													<CodigosTextarea
														id="codigos-cadastrais"
														value={codigos}
														onChange={(event) => setCodigos(event.target.value)}
														placeholder={
															"Ex:\n001.002.003-4\n009.008.007-6\n123456789"
														}
														maxLength={100000}
														aria-describedby="codigos-cadastrais-ajuda"
														aria-invalid={
															codigosAcimaDoLimite ||
															(analiseCodigos.totalRecebidos > 0 &&
																analiseCodigos.totalValidos === 0)
														}
														required
													/>
													<CodigosHint id="codigos-cadastrais-ajuda">
														Use uma linha por código ou separe por vírgula ou ponto e
														vírgula. Espaços internos são removidos e letras são
														convertidas para maiúsculas. Limite de{" "}
														{formatNumberBR(MAX_CODIGOS_POR_PREVIA)} códigos por prévia.
													</CodigosHint>
												</CodigosField>

												<CodeSummaryGrid aria-live="polite">
													<CodeSummaryItem>
														<CodeSummaryLabel>Recebidos</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(analiseCodigos.totalRecebidos)}
														</CodeSummaryValue>
													</CodeSummaryItem>

													<CodeSummaryItem
														$variant={
															analiseCodigos.totalValidos > 0
																? "success"
																: "neutral"
														}
													>
														<CodeSummaryLabel>Válidos únicos</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(analiseCodigos.totalValidos)}
														</CodeSummaryValue>
													</CodeSummaryItem>

													<CodeSummaryItem
														$variant={
															analiseCodigos.totalDuplicados > 0
																? "warning"
																: "neutral"
														}
													>
														<CodeSummaryLabel>Duplicados</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(analiseCodigos.totalDuplicados)}
														</CodeSummaryValue>
													</CodeSummaryItem>

													<CodeSummaryItem
														$variant={
															analiseCodigos.totalInvalidos > 0 ||
															codigosAcimaDoLimite
																? "danger"
																: "neutral"
														}
													>
														<CodeSummaryLabel>Inválidos</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(analiseCodigos.totalInvalidos)}
														</CodeSummaryValue>
													</CodeSummaryItem>
												</CodeSummaryGrid>

												{codigosAcimaDoLimite && (
													<ErrorBox>
														A entrada possui{" "}
														{formatNumberBR(analiseCodigos.totalRecebidos)} códigos.
														Reduza para no máximo{" "}
														{formatNumberBR(MAX_CODIGOS_POR_PREVIA)} antes de criar a
														prévia.
													</ErrorBox>
												)}

												{!codigosAcimaDoLimite &&
													(analiseCodigos.totalDuplicados > 0 ||
														analiseCodigos.totalInvalidos > 0) && (
														<CodeFeedback>
															<CodeFeedbackTitle>
																Revisão da entrada
															</CodeFeedbackTitle>

															{analiseCodigos.codigosDuplicados.length > 0 && (
																<>
																	<strong>Duplicados ignorados</strong>
																	<CodeFeedbackList>
																		{analiseCodigos.codigosDuplicados
																			.slice(0, 5)
																			.map((codigo, index) => (
																				<li key={`${codigo}-${index}`}>{codigo}</li>
																			))}
																	</CodeFeedbackList>
																</>
															)}

															{analiseCodigos.codigosInvalidos.length > 0 && (
																<>
																	<strong>Inválidos ignorados</strong>
																	<CodeFeedbackList>
																		{analiseCodigos.codigosInvalidos
																			.slice(0, 5)
																			.map((item, index) => (
																				<li
																					key={`${item.valorOriginal}-${index}`}
																				>
																					{item.valorOriginal || "(vazio)"} —{" "}
																					{getMotivoCodigoInvalido(item.motivo)}
																				</li>
																			))}
																	</CodeFeedbackList>
																</>
															)}

															{analiseCodigos.totalDuplicados +
																analiseCodigos.totalInvalidos >
																10 && (
																<span>
																	Mostrando apenas os primeiros itens para manter a
																	leitura objetiva.
																</span>
															)}
														</CodeFeedback>
													)}
											</>
										)}

										<Actions>
											<Button
												type="submit"
												disabled={
													isLoading ||
													buscaBloqueada ||
													(tipoBusca === "CODIGOS_CADASTRAIS" &&
														!codigosProntosParaEnvio)
												}
											>
												{isLoading
													? "Criando prévia..."
													: tipoBusca === "CODIGOS_CADASTRAIS"
														? "Revisar códigos"
														: "Consultar prévia"}
											</Button>

											<InlineHint>
												{tipoBusca === "CODIGOS_CADASTRAIS"
													? "A API revalida a lista, remove duplicados e calcula o excedente antes de liberar o processamento."
													: "A prévia é processada em segundo plano, respeita o intervalo mínimo do 1RIBH e evita consultas repetidas."}
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
															: previaPorCodigos
																? "Prévia dos códigos cadastrais"
																: "Prévia da busca por endereço"}
													</PreviewTitle>

													<PreviewSubtitle>
														{previaProcessando
															? "Sua consulta está na fila do 1RIBH. Você pode sair desta tela e voltar depois."
															: previaPorCodigos
																? "A API normalizou os códigos e salvou a lista que será processada pelo Worker CND."
																: "Esta é a lista retornada pelo 1RIBH. O Worker CND usará estes registros salvos sem consultar o 1RIBH novamente."}
													</PreviewSubtitle>

													<PreviewStatus>
														<PreviewStatusBadge
															$variant={getPreviaStatusVariant(previaBusca.previa.status)}
														>
															{getPreviaStatusLabel(previaBusca.previa.status)}
														</PreviewStatusBadge>
													</PreviewStatus>
												</div>

												<PreviewBadge>
													{formatQuantidadePrevia(
														previaBusca.previa.quantidadeRegistros,
														previaBusca.previa.tipoBusca
													)}
												</PreviewBadge>
											</PreviewHeader>

											<PreviewGrid>
												{previaPorCodigos ? (
													<>
														<PreviewInfo>
															<strong>Tipo de busca</strong>
															<span>Entrada direta</span>
														</PreviewInfo>

														<PreviewInfo>
															<strong>Códigos válidos</strong>
															<span>
																{formatNumberBR(
																	previaBusca.previa.quantidadeRegistros
																)}
															</span>
														</PreviewInfo>
													</>
												) : (
													<>
														<PreviewInfo>
															<strong>Logradouro</strong>
															<span>{previaBusca.previa.logradouro}</span>
														</PreviewInfo>

														<PreviewInfo>
															<strong>Número</strong>
															<span>{previaBusca.previa.numero}</span>
														</PreviewInfo>
													</>
												)}

												<PreviewInfo>
													<strong>Excedente estimado</strong>
													<span>
														{formatCurrencyFromCents(
															previaBusca.excedente.valorExcedenteEstimadoCentavos
														)}
													</span>
												</PreviewInfo>
											</PreviewGrid>
											{previaPorCodigos && previaBusca.validacaoCodigos && (
												<CodeSummaryGrid aria-label="Validação confirmada pela API">
													<CodeSummaryItem>
														<CodeSummaryLabel>Recebidos pela API</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(
																previaBusca.validacaoCodigos.totalRecebidos
															)}
														</CodeSummaryValue>
													</CodeSummaryItem>

													<CodeSummaryItem $variant="success">
														<CodeSummaryLabel>Válidos únicos</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(
																previaBusca.validacaoCodigos.totalValidos
															)}
														</CodeSummaryValue>
													</CodeSummaryItem>

													<CodeSummaryItem
														$variant={
															previaBusca.validacaoCodigos.totalDuplicados > 0
																? "warning"
																: "neutral"
														}
													>
														<CodeSummaryLabel>Duplicados removidos</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(
																previaBusca.validacaoCodigos.totalDuplicados
															)}
														</CodeSummaryValue>
													</CodeSummaryItem>

													<CodeSummaryItem
														$variant={
															previaBusca.validacaoCodigos.totalInvalidos > 0
																? "danger"
																: "neutral"
														}
													>
														<CodeSummaryLabel>Inválidos removidos</CodeSummaryLabel>
														<CodeSummaryValue>
															{formatNumberBR(
																previaBusca.validacaoCodigos.totalInvalidos
															)}
														</CodeSummaryValue>
													</CodeSummaryItem>
												</CodeSummaryGrid>
											)}


											{previaBusca.previa.erro && (
												<ErrorBox>{previaBusca.previa.erro}</ErrorBox>
											)}

											{previaSemRegistros && (
												<NoResultsBox>
													<NoResultsTitle>
														{previaPorCodigos
															? "Nenhum código cadastral válido na prévia."
															: "Nenhum imóvel encontrado para este endereço."}
													</NoResultsTitle>

													<p>
														{previaPorCodigos
															? "Revise a lista informada e crie uma nova prévia com ao menos um código válido."
															: "O 1RIBH não retornou índice cadastral para o logradouro e número informados. Confira o endereço e tente novamente."}
													</p>
												</NoResultsBox>
											)}

											{previaProcessando && (
												<EmptyState>
													A prévia ainda está sendo processada. Assim que estiver pronta,
													esta tela será atualizada automaticamente.
												</EmptyState>
											)}

											{previaBusca.previa.registros.length > 0 && (
												<PreviewList>
													{previaBusca.previa.registros.map((registro, index) => (
														<PreviewListItem key={`${registro.indiceCadastral}-${index}`}>
															<strong>{registro.indiceCadastral}</strong>
															<span>
																{previaPorCodigos
																	? "Entrada direta"
																	: registro.complemento ?? "Sem complemento"}
															</span>
														</PreviewListItem>
													))}
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
														{isLoading ? "Iniciando..." : "Iniciar processamento"}
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
														onClick={() => cancelarPreviaPorId(previaBusca.previa.id)}
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
											Carregando progresso da tarefa. Assim que o processamento iniciar,
											os resultados aparecerão aqui.
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
									Pendências precisam ser revisadas uma por uma. O sistema não permite
									autorizar todas de uma vez, porque o excedente é recalculado a cada
									confirmação.
								</SidebarDescription>

								{isLoadingPendencias && (
									<EmptyState>Atualizando pendências...</EmptyState>
								)}

								{!isLoadingPendencias && pendencias.length === 0 && (
									<SidebarList>
										<SidebarListItem>Nenhuma prévia pendente no momento.</SidebarListItem>
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
													<strong>{getPendenciaTitle(item.previa)}</strong>

													<span>
														{itemSemRegistros ? (
															<>
																{item.previa.tipoBusca === "CODIGOS_CADASTRAIS"
																	? "Sem códigos válidos · revise a entrada e crie uma nova busca."
																	: "Sem imóveis encontrados · confira o endereço e faça uma nova busca."}
															</>
														) : (
															<>
																{getTipoBuscaLabel(item.previa.tipoBusca)} ·{" "}
																{getPreviaStatusLabel(item.previa.status)} ·{" "}
																{formatQuantidadePrevia(
																	item.previa.quantidadeRegistros,
																	item.previa.tipoBusca
																)}{" "}
																· Excedente estimado:{" "}
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
															onClick={() => cancelarPreviaPorId(item.previa.id)}
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
									A prévia protege o fluxo financeiro e garante que a mesma lista revisada
									seja usada no processamento.
								</SidebarDescription>

								<SidebarList>
									<SidebarListItem>
										Por endereço, o sistema descobre os códigos no 1RIBH em fila.
									</SidebarListItem>

									<SidebarListItem>
										Na entrada direta, os códigos são normalizados sem consultar o 1RIBH.
									</SidebarListItem>

									<SidebarListItem>
										Antes da confirmação, a API calcula as consultas e o possível
										excedente.
									</SidebarListItem>

									<SidebarListItem>
										Ao confirmar, o Worker CND usa exatamente a prévia salva.
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
