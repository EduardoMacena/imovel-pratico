"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { criarPlano, listarPlanos } from "../../features/admin/api";
import type { PlanoResumo, PlanoStatus } from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import {
	Actions,
	Badge,
	EmptyState,
	EmptyStateTitle,
	ErrorBox,
	EditLink,
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
	ListHeader,
	ListSubtitle,
	ListTitle,
	PageContainer,
	PlanoCard,
	PlanoDescription,
	PlanoHeader,
	PlanosGrid,
	PlanoTitle,
	Sidebar,
	StatCard,
	StatGrid,
	StatLabel,
	StatValue,
	Subtitle,
	SuccessBox,
	Title,
} from "./page.styles";

function formatCurrencyFromCents(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value / 100);
}

function toCents(value: string) {
	const normalized = value.replace(",", ".");
	return Math.round(Number(normalized || 0) * 100);
}

export default function PlanosPage() {
	const { isCheckingAuth } = useRequireSuperAdmin();

	const [planos, setPlanos] = useState<PlanoResumo[]>([]);

	const [nome, setNome] = useState("");
	const [descricao, setDescricao] = useState("");
	const [limiteMensalConsultas, setLimiteMensalConsultas] = useState(300);
	const [intervaloSegundos, setIntervaloSegundos] = useState(90);
	const [precoReais, setPrecoReais] = useState("0");
	const [status, setStatus] = useState<PlanoStatus>("ATIVO");

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const [sucesso, setSucesso] = useState<string | null>(null);

	const resumo = useMemo(() => {
		const ativos = planos.filter((plano) => plano.status === "ATIVO").length;
		const inativos = planos.filter((plano) => plano.status === "INATIVO").length;

		const maiorLimite = planos.reduce((maior, plano) => {
			return Math.max(maior, plano.limiteMensalConsultas);
		}, 0);

		const menorIntervalo = planos.reduce((menor, plano) => {
			if (menor === 0) {
				return plano.intervaloSegundos;
			}

			return Math.min(menor, plano.intervaloSegundos);
		}, 0);

		return {
			ativos,
			inativos,
			maiorLimite,
			menorIntervalo,
		};
	}, [planos]);

	async function carregarPlanos() {
		try {
			setErro(null);

			const data = await listarPlanos();

			setPlanos(data.planos);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar planos"
			);
		} finally {
			setIsLoading(false);
		}
	}

	function limparFormulario() {
		setNome("");
		setDescricao("");
		setLimiteMensalConsultas(300);
		setIntervaloSegundos(90);
		setPrecoReais("0");
		setStatus("ATIVO");
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setSucesso(null);
		setIsSaving(true);

		try {
			await criarPlano({
				nome,
				descricao: descricao.trim() || null,
				limiteMensalConsultas,
				intervaloSegundos,
				precoCentavos: toCents(precoReais),
				status,
			});

			setSucesso("Plano criado com sucesso.");
			limparFormulario();
			await carregarPlanos();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao criar plano"
			);
		} finally {
			setIsSaving(false);
		}
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarPlanos();
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
							<HeaderEyebrow>Gestão comercial</HeaderEyebrow>

							<Title>Planos</Title>

							<Subtitle>
								Cadastre e edite os planos comerciais usados pelos clientes,
								definindo limite mensal, intervalo entre consultas, preço e
								status.
							</Subtitle>
						</HeaderContent>

						<HeaderPanel>
							<HeaderPanelLabel>Total de planos</HeaderPanelLabel>
							<HeaderPanelValue>{planos.length}</HeaderPanelValue>
						</HeaderPanel>
					</HeaderGrid>
				</Header>

				<StatGrid>
					<StatCard>
						<StatLabel>Planos ativos</StatLabel>
						<StatValue>{resumo.ativos}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Planos inativos</StatLabel>
						<StatValue>{resumo.inativos}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Maior limite mensal</StatLabel>
						<StatValue>{resumo.maiorLimite}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Menor intervalo</StatLabel>
						<StatValue>
							{resumo.menorIntervalo ? `${resumo.menorIntervalo}s` : "-"}
						</StatValue>
					</StatCard>
				</StatGrid>

				<Grid>
					<Sidebar>
						<Card>
							<FormHeader>
								<FormTitle>Novo plano</FormTitle>
								<FormSubtitle>
									Crie uma oferta comercial para vincular aos clientes da
									plataforma.
								</FormSubtitle>
							</FormHeader>

							<Form onSubmit={handleSubmit}>
								<Input
									label="Nome do plano"
									value={nome}
									onChange={(event) => setNome(event.target.value)}
									placeholder="Ex: Inicial"
									required
								/>

								<Input
									label="Descrição"
									value={descricao}
									onChange={(event) => setDescricao(event.target.value)}
									placeholder="Opcional"
								/>

								<Select
									label="Limite mensal de consultas"
									value={limiteMensalConsultas}
									onChange={(event) =>
										setLimiteMensalConsultas(Number(event.target.value))
									}
								>
									<option value={10}>10 consultas/mês</option>
									<option value={300}>300 consultas/mês</option>
									<option value={500}>500 consultas/mês</option>
									<option value={1000}>1000 consultas/mês</option>
									<option value={2000}>2000 consultas/mês</option>
								</Select>

								<Input
									label="Intervalo entre consultas em segundos"
									type="number"
									min={40}
									max={300}
									value={intervaloSegundos}
									onChange={(event) =>
										setIntervaloSegundos(Number(event.target.value))
									}
									required
								/>

								<Input
									label="Preço mensal em reais"
									type="number"
									min={0}
									step="0.01"
									value={precoReais}
									onChange={(event) => setPrecoReais(event.target.value)}
									required
								/>

								<Select
									label="Status"
									value={status}
									onChange={(event) =>
										setStatus(event.target.value as PlanoStatus)
									}
								>
									<option value="ATIVO">ATIVO</option>
									<option value="INATIVO">INATIVO</option>
								</Select>

								{erro && <ErrorBox>{erro}</ErrorBox>}
								{sucesso && <SuccessBox>{sucesso}</SuccessBox>}

								<Actions>
									<Button type="submit" fullWidth disabled={isSaving}>
										{isSaving ? "Criando..." : "Criar plano"}
									</Button>
								</Actions>
							</Form>
						</Card>
					</Sidebar>

					<div>
						<ListHeader>
							<div>
								<ListTitle>Planos cadastrados</ListTitle>
								<ListSubtitle>
									Visualize limites, intervalos, preços, slug e status dos planos
									disponíveis.
								</ListSubtitle>
							</div>
						</ListHeader>

						{isLoading && (
							<EmptyState>
								<EmptyStateTitle>Carregando planos...</EmptyStateTitle>
								Estamos buscando os planos comerciais cadastrados.
							</EmptyState>
						)}

						{!isLoading && planos.length === 0 && (
							<EmptyState>
								<EmptyStateTitle>Nenhum plano cadastrado.</EmptyStateTitle>
								Crie o primeiro plano para iniciar a configuração comercial do
								SaaS.
							</EmptyState>
						)}

						{!isLoading && planos.length > 0 && (
							<PlanosGrid>
								{planos.map((plano) => (
									<PlanoCard key={plano.id}>
										<PlanoHeader>
											<div>
												<PlanoTitle>{plano.nome}</PlanoTitle>
												<PlanoDescription>
													{plano.descricao || "Sem descrição"}
												</PlanoDescription>
											</div>

											<Badge $status={plano.status}>{plano.status}</Badge>
										</PlanoHeader>

										<InfoGrid>
											<InfoBox>
												<InfoLabel>Limite mensal</InfoLabel>
												<InfoValue>
													{plano.limiteMensalConsultas} consultas
												</InfoValue>
											</InfoBox>

											<InfoBox>
												<InfoLabel>Intervalo</InfoLabel>
												<InfoValue>{plano.intervaloSegundos}s</InfoValue>
											</InfoBox>

											<InfoBox>
												<InfoLabel>Preço</InfoLabel>
												<InfoValue>
													{formatCurrencyFromCents(plano.precoCentavos)}
												</InfoValue>
											</InfoBox>

											<InfoBox>
												<InfoLabel>Slug</InfoLabel>
												<InfoValue>{plano.slug}</InfoValue>
											</InfoBox>
										</InfoGrid>

										<EditLink href={`/planos/${plano.id}/editar`}>
											Editar plano
										</EditLink>
									</PlanoCard>
								))}
							</PlanosGrid>
						)}
					</div>
				</Grid>
			</PageContainer>
		</>
	);
}