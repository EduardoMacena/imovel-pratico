"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { StatusBadge } from "../../components/StatusBadge";
import {
	criarCliente,
	listarClientes,
	listarPlanos,
	listarConsumoClientes,
} from "../../features/admin/api";
import type {
	ClienteResumo,
	PlanoResumo,
	ConsumoClienteResumo,
} from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import { Select } from "../../components/Select";
import {
	Actions,
	ClientItem,
	ClientMeta,
	ClientName,
	ClientTop,
	DetailsLink,
	EmptyState,
	EmptyStateTitle,
	ErrorBox,
	FinancialBox,
	FinancialGrid,
	FinancialHint,
	FinancialLabel,
	FinancialValue,
	Form,
	FormHeader,
	FormSubtitle,
	FormTitle,
	Grid,
	Header,
	HeaderContent,
	HeaderEyebrow,
	HeaderGrid,
	HeaderPanel,
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
	Sidebar,
	StatCard,
	StatGrid,
	StatLabel,
	StatValue,
	Subtitle,
	Title,
} from "./page.styles";

type UsoFinanceiro = ConsumoClienteResumo["uso"] & {
	consultasExcedentes?: number;
	valorExcedenteCentavos?: number;
	totalEstimadoCentavos?: number;
};

function formatCurrencyFromCents(value?: number | null) {
	if (value === null || value === undefined) {
		return "-";
	}

	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value / 100);
}

function formatNumber(value?: number | null) {
	if (typeof value !== "number") {
		return "-";
	}

	return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value?: string | null) {
	if (!value) {
		return "-";
	}

	const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
		? new Date(`${value}T12:00:00.000Z`)
		: new Date(value);

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeZone: "UTC",
	}).format(date);
}

function getPagamentoLabel(status?: string | null, vencido?: boolean) {
	if (vencido) {
		return "VENCIDO";
	}

	if (status === "PAGO") {
		return "PAGO";
	}

	if (status === "PENDENTE") {
		return "PENDENTE";
	}

	if (status === "CANCELADO") {
		return "CANCELADO";
	}

	return status ?? "-";
}

function calcularFinanceiroCliente(
	cliente: ClienteResumo,
	consumo: ConsumoClienteResumo | null
) {
	const plano = consumo?.plano ?? cliente.plano;
	const uso = consumo?.uso as UsoFinanceiro | undefined;

	const mensalidadeCentavos = plano?.precoCentavos ?? 0;
	const valorExcedenteCentavos = uso?.valorExcedenteCentavos ?? 0;
	const totalEstimadoCentavos =
		uso?.totalEstimadoCentavos ?? mensalidadeCentavos + valorExcedenteCentavos;

	const pagamentoStatus = consumo?.cliente.pagamentoStatus ?? cliente.pagamentoStatus;
	const pagamentoVencido = consumo?.cliente.pagamentoVencido ?? false;

	const pagamentoEmAberto = pagamentoStatus !== "PAGO" || pagamentoVencido;

	const valorDevedorCentavos = pagamentoEmAberto
		? totalEstimadoCentavos
		: valorExcedenteCentavos;

	const consultasExcedentes = uso?.consultasExcedentes ?? 0;

	return {
		plano,
		mensalidadeCentavos,
		valorExcedenteCentavos,
		totalEstimadoCentavos,
		valorDevedorCentavos,
		consultasExcedentes,
		pagamentoStatus,
		pagamentoVencido,
		vencimento: consumo?.cliente.pagamentoVenceEm ?? cliente.pagamentoVenceEm,
		pagamentoEmAberto,
	};
}

function getFinancialVariant(valorDevedorCentavos: number) {
	if (valorDevedorCentavos > 0) {
		return "danger" as const;
	}

	return "success" as const;
}

export default function ClientesPage() {
	const { isCheckingAuth } = useRequireSuperAdmin();

	const [planos, setPlanos] = useState<PlanoResumo[]>([]);
	const [planoId, setPlanoId] = useState("");

	const [clientes, setClientes] = useState<ClienteResumo[]>([]);
	const [nome, setNome] = useState("");

	const [consumos, setConsumos] = useState<ConsumoClienteResumo[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	function getConsumoCliente(clienteId: string) {
		return consumos.find((consumo) => consumo.cliente.id === clienteId) ?? null;
	}

	const resumo = useMemo(() => {
		const ativos = clientes.filter((cliente) => cliente.status === "ATIVO").length;
		const suspensos = clientes.filter(
			(cliente) => cliente.status === "SUSPENSO"
		).length;

		const totalUsuarios = clientes.reduce((total, cliente) => {
			return total + cliente.totalUsuarios;
		}, 0);

		const totalTarefas = clientes.reduce((total, cliente) => {
			return total + cliente.totalTarefas;
		}, 0);

		const financeiro = clientes.map((cliente) => {
			const consumo =
				consumos.find((item) => item.cliente.id === cliente.id) ?? null;

			return calcularFinanceiroCliente(cliente, consumo);
		});

		const receitaMensalAtiva = financeiro.reduce((total, item) => {
			return total + item.mensalidadeCentavos;
		}, 0);

		const totalExcedente = financeiro.reduce((total, item) => {
			return total + item.valorExcedenteCentavos;
		}, 0);

		const totalDevedor = financeiro.reduce((total, item) => {
			return total + item.valorDevedorCentavos;
		}, 0);

		const clientesComDebito = financeiro.filter(
			(item) => item.valorDevedorCentavos > 0
		).length;

		return {
			ativos,
			suspensos,
			totalUsuarios,
			totalTarefas,
			receitaMensalAtiva,
			totalExcedente,
			totalDevedor,
			clientesComDebito,
		};
	}, [clientes, consumos]);

	async function carregarConsumosClientes() {
		try {
			const data = await listarConsumoClientes();

			setConsumos(data.consumos);
		} catch (error) {
			console.error("Erro ao carregar consumo dos clientes:", error);
		}
	}

	async function carregarPlanos() {
		const data = await listarPlanos();

		const planosAtivos = data.planos.filter(
			(plano) => plano.status === "ATIVO"
		);

		setPlanos(planosAtivos);

		if (!planoId && planosAtivos[0]) {
			setPlanoId(planosAtivos[0].id);
		}
	}

	async function carregarClientes() {
		try {
			setErro(null);

			const data = await listarClientes();

			setClientes(data.clientes);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar clientes"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleCriarCliente(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setIsCreating(true);

		try {
			await criarCliente({
				nome,
				planoId,
				intervaloSegundos: 60,
				limiteDiario: 300,
			});

			setNome("");

			await carregarClientes();
			await carregarConsumosClientes();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao criar cliente"
			);
		} finally {
			setIsCreating(false);
		}
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarClientes();
			carregarPlanos();
			carregarConsumosClientes();
		}
	}, [isCheckingAuth]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<Header>
					<HeaderGrid>
						<HeaderContent>
							<HeaderEyebrow>Gestão comercial e financeira</HeaderEyebrow>

							<Title>Clientes</Title>

							<Subtitle>
								Cadastre imobiliárias, acompanhe plano, consumo, vencimento,
								excedente e valor em aberto de cada cliente.
							</Subtitle>
						</HeaderContent>

						<HeaderPanel>
							<HeaderPanelLabel>Total devedor estimado</HeaderPanelLabel>
							<HeaderPanelValue>
								{formatCurrencyFromCents(resumo.totalDevedor)}
							</HeaderPanelValue>
						</HeaderPanel>
					</HeaderGrid>
				</Header>

				<StatGrid>
					<StatCard>
						<StatLabel>Receita mensal ativa</StatLabel>
						<StatValue>
							{formatCurrencyFromCents(resumo.receitaMensalAtiva)}
						</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Excedente no mês</StatLabel>
						<StatValue>{formatCurrencyFromCents(resumo.totalExcedente)}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Clientes com débito</StatLabel>
						<StatValue>{resumo.clientesComDebito}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Clientes ativos</StatLabel>
						<StatValue>{resumo.ativos}</StatValue>
					</StatCard>
				</StatGrid>

				<Grid>
					<Sidebar>
						<Card>
							<FormHeader>
								<FormTitle>Novo cliente</FormTitle>
								<FormSubtitle>
									Crie uma nova imobiliária e vincule imediatamente um plano
									ativo.
								</FormSubtitle>
							</FormHeader>

							<Form onSubmit={handleCriarCliente}>
								<Input
									label="Nome do cliente"
									value={nome}
									onChange={(event) => setNome(event.target.value)}
									placeholder="Ex: TWA Investimentos"
									required
								/>

								<Select
									label="Plano"
									value={planoId}
									onChange={(event) => setPlanoId(event.target.value)}
									required
								>
									{planos.map((plano) => (
										<option key={plano.id} value={plano.id}>
											{plano.nome} — {plano.limiteMensalConsultas} consultas —{" "}
											{formatCurrencyFromCents(plano.precoCentavos)}
										</option>
									))}
								</Select>

								<Button type="submit" fullWidth disabled={isCreating}>
									{isCreating ? "Criando..." : "Criar cliente"}
								</Button>
							</Form>
						</Card>
					</Sidebar>

					<div>
						<ListHeader>
							<div>
								<ListTitle>Clientes cadastrados</ListTitle>
								<ListSubtitle>
									Controle operacional e financeiro por cliente: mensalidade,
									excedente, vencimento, status de pagamento e valor em aberto.
								</ListSubtitle>
							</div>
						</ListHeader>

						{erro && <ErrorBox>{erro}</ErrorBox>}

						{isLoading && (
							<EmptyState>
								<EmptyStateTitle>Carregando clientes...</EmptyStateTitle>
								Estamos buscando os clientes cadastrados e o resumo financeiro.
							</EmptyState>
						)}

						{!isLoading && clientes.length === 0 && (
							<EmptyState>
								<EmptyStateTitle>Nenhum cliente cadastrado.</EmptyStateTitle>
								Crie o primeiro cliente para iniciar a operação.
							</EmptyState>
						)}

						{!isLoading && clientes.length > 0 && (
							<List>
								{clientes.map((cliente) => {
									const consumo = getConsumoCliente(cliente.id);
									const financeiro = calcularFinanceiroCliente(cliente, consumo);
									const uso = consumo?.uso as UsoFinanceiro | undefined;

									return (
										<ClientItem key={cliente.id}>
											<ClientTop>
												<div>
													<ClientName>{cliente.nome}</ClientName>
													<ClientMeta>
														{cliente.slug} · Plano:{" "}
														{financeiro.plano?.nome ?? "Sem plano"}
													</ClientMeta>
												</div>

												<StatusBadge status={cliente.status} />
											</ClientTop>

											<FinancialGrid>
												<FinancialBox>
													<FinancialLabel>Valor devedor</FinancialLabel>
													<FinancialValue
														$variant={getFinancialVariant(
															financeiro.valorDevedorCentavos
														)}
													>
														{formatCurrencyFromCents(
															financeiro.valorDevedorCentavos
														)}
													</FinancialValue>
													<FinancialHint>
														{financeiro.valorDevedorCentavos > 0
															? "Em aberto / a cobrar"
															: "Sem débito estimado"}
													</FinancialHint>
												</FinancialBox>

												<FinancialBox>
													<FinancialLabel>Mensalidade</FinancialLabel>
													<FinancialValue>
														{formatCurrencyFromCents(
															financeiro.mensalidadeCentavos
														)}
													</FinancialValue>
													<FinancialHint>Valor fixo do plano</FinancialHint>
												</FinancialBox>

												<FinancialBox>
													<FinancialLabel>Excedente</FinancialLabel>
													<FinancialValue>
														{formatCurrencyFromCents(
															financeiro.valorExcedenteCentavos
														)}
													</FinancialValue>
													<FinancialHint>
														{formatNumber(financeiro.consultasExcedentes)} consulta(s)
														excedente(s)
													</FinancialHint>
												</FinancialBox>

												<FinancialBox>
													<FinancialLabel>Total do ciclo</FinancialLabel>
													<FinancialValue>
														{formatCurrencyFromCents(
															financeiro.totalEstimadoCentavos
														)}
													</FinancialValue>
													<FinancialHint>Mensalidade + excedente</FinancialHint>
												</FinancialBox>
											</FinancialGrid>

											<InfoGrid>
												<InfoBox>
													<InfoLabel>Pagamento</InfoLabel>
													<InfoValue>
														{getPagamentoLabel(
															financeiro.pagamentoStatus,
															financeiro.pagamentoVencido
														)}
													</InfoValue>
												</InfoBox>

												<InfoBox>
													<InfoLabel>Vencimento</InfoLabel>
													<InfoValue>{formatDate(financeiro.vencimento)}</InfoValue>
												</InfoBox>

												<InfoBox>
													<InfoLabel>Uso mensal</InfoLabel>
													<InfoValue>{uso?.percentualUsado ?? 0}%</InfoValue>
												</InfoBox>

												<InfoBox>
													<InfoLabel>Restantes</InfoLabel>
													<InfoValue>
														{formatNumber(uso?.consultasRestantes ?? 0)}
													</InfoValue>
												</InfoBox>

												<InfoBox>
													<InfoLabel>Tarefas</InfoLabel>
													<InfoValue>{cliente.totalTarefas}</InfoValue>
												</InfoBox>
											</InfoGrid>

											<Actions>
												<DetailsLink href={`/clientes/${cliente.id}/editar`}>
													Financeiro e configurações
												</DetailsLink>

												<DetailsLink href={`/clientes/${cliente.id}/usuarios`}>
													Usuários
												</DetailsLink>

												<DetailsLink href={`/clientes/${cliente.id}/tarefas`}>
													Tarefas
												</DetailsLink>
											</Actions>
										</ClientItem>
									);
								})}
							</List>
						)}
					</div>
				</Grid>
			</PageContainer>
		</>
	);
}
