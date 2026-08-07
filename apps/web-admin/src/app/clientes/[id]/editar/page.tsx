"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "../../../../components/AppHeader";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { Input } from "../../../../components/Input";
import { Select } from "../../../../components/Select";
import { StatusBadge } from "../../../../components/StatusBadge";
import {
	atualizarCliente,
	buscarCliente,
	listarPlanos,
	criarWorkerAgentCliente,
	listarWorkerAgentsCliente,
	revogarWorkerAgent,
} from "../../../../features/admin/api";
import type {
	ClienteStatus,
	PlanoResumo,
	ClienteModoProcessamento,
	WorkerAgentResumo,
	WorkerAgentTipo,
} from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
import {
	formatarCep,
	formatarCnpj,
	formatarTelefone,
	formatarUf,
	valorNullable,
	valorNullableUf,
} from "../../../../features/admin/clientes-formatters";
import {
	Actions,
	BackLink,
	EmptyState,
	EmptyStateTitle,
	ErrorBox,
	Form,
	FormGrid,
	FormHeader,
	FormSection,
	FormSectionTitle,
	Header,
	HeaderContent,
	HeaderEyebrow,
	HeaderGrid,
	HeaderPanel,
	HeaderPanelItem,
	HeaderPanelLabel,
	HeaderPanelValue,
	PageContainer,
	Subtitle,
	SuccessBox,
	Title,
} from "./page.styles";

export default function EditarClientePage() {
	const { isCheckingAuth } = useRequireSuperAdmin();
	const params = useParams<{ id: string }>();

	const clienteId = params.id;

	const [planos, setPlanos] = useState<PlanoResumo[]>([]);

	const [modoProcessamento, setModoProcessamento] =
		useState<ClienteModoProcessamento>("AGENT");

	const [agents, setAgents] = useState<WorkerAgentResumo[]>([]);
	const [isLoadingAgents, setIsLoadingAgents] = useState(false);
	const [isCreatingAgent, setIsCreatingAgent] = useState(false);
	const [agentTipo, setAgentTipo] = useState<WorkerAgentTipo>("REGISTRO");
	const [agentIdentificador, setAgentIdentificador] = useState("");
	const [tokenGerado, setTokenGerado] = useState<{
		token: string;
		identificador: string;
		tipo: WorkerAgentTipo;
	} | null>(null);
	const [revogandoAgentId, setRevogandoAgentId] = useState<string | null>(null);

	const [nome, setNome] = useState("");
	const [cnpj, setCnpj] = useState("");
	const [razaoSocial, setRazaoSocial] = useState("");
	const [nomeFantasia, setNomeFantasia] = useState("");
	const [emailComercial, setEmailComercial] = useState("");
	const [telefoneComercial, setTelefoneComercial] = useState("");
	const [enderecoCep, setEnderecoCep] = useState("");
	const [enderecoLogradouro, setEnderecoLogradouro] = useState("");
	const [enderecoNumero, setEnderecoNumero] = useState("");
	const [enderecoComplemento, setEnderecoComplemento] = useState("");
	const [enderecoBairro, setEnderecoBairro] = useState("");
	const [enderecoCidade, setEnderecoCidade] = useState("");
	const [enderecoUf, setEnderecoUf] = useState("");
	const [slug, setSlug] = useState("");
	const [status, setStatus] = useState<ClienteStatus>("ATIVO");
	const [workerUrl, setWorkerUrl] = useState("");
	const [intervaloSegundos, setIntervaloSegundos] = useState("60");
	const [limiteDiario, setLimiteDiario] = useState("300");
	const [planoId, setPlanoId] = useState("");

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const [sucesso, setSucesso] = useState<string | null>(null);

	async function carregarPlanos() {
		const data = await listarPlanos();

		setPlanos(data.planos);
	}

	async function carregarCliente() {
		try {
			setErro(null);

			const data = await buscarCliente(clienteId);
			const cliente = data.cliente;

			setNome(cliente.nome);
			setCnpj(formatarCnpj(cliente.cnpj ?? ""));
			setRazaoSocial(cliente.razaoSocial ?? "");
			setNomeFantasia(cliente.nomeFantasia ?? "");
			setEmailComercial(cliente.emailComercial ?? "");
			setTelefoneComercial(
				formatarTelefone(cliente.telefoneComercial ?? "")
			);
			setEnderecoCep(formatarCep(cliente.enderecoCep ?? ""));
			setEnderecoLogradouro(cliente.enderecoLogradouro ?? "");
			setEnderecoNumero(cliente.enderecoNumero ?? "");
			setEnderecoComplemento(cliente.enderecoComplemento ?? "");
			setEnderecoBairro(cliente.enderecoBairro ?? "");
			setEnderecoCidade(cliente.enderecoCidade ?? "");
			setEnderecoUf(formatarUf(cliente.enderecoUf ?? ""));
			setSlug(cliente.slug);
			setStatus(cliente.status);
			setModoProcessamento(cliente.modoProcessamento ?? "AGENT");
			setWorkerUrl(cliente.workerUrl ?? "");
			setIntervaloSegundos(String(cliente.intervaloSegundos));
			setLimiteDiario(String(cliente.limiteDiario));
			setPlanoId(cliente.planoId ?? "");
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar cliente"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setSucesso(null);
		setIsSaving(true);

		try {
			const resultado = await atualizarCliente(clienteId, {
				nome,
				cnpj: valorNullable(cnpj),
				razaoSocial: valorNullable(razaoSocial),
				nomeFantasia: valorNullable(nomeFantasia),
				emailComercial: valorNullable(emailComercial),
				telefoneComercial: valorNullable(telefoneComercial),
				enderecoCep: valorNullable(enderecoCep),
				enderecoLogradouro: valorNullable(enderecoLogradouro),
				enderecoNumero: valorNullable(enderecoNumero),
				enderecoComplemento: valorNullable(enderecoComplemento),
				enderecoBairro: valorNullable(enderecoBairro),
				enderecoCidade: valorNullable(enderecoCidade),
				enderecoUf: valorNullableUf(enderecoUf),
				slug,
				status,
				modoProcessamento,
				workerUrl: workerUrl.trim() || null,
				limiteDiario: Number(limiteDiario),
				planoId,
			});

			setIntervaloSegundos(
				String(resultado.cliente.intervaloSegundos)
			);
			setSucesso("Cliente atualizado com sucesso.");
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao atualizar cliente"
			);
		} finally {
			setIsSaving(false);
		}
	}

	async function carregarAgents() {
		try {
			setIsLoadingAgents(true);

			const data = await listarWorkerAgentsCliente(clienteId);

			setAgents(data.agents);
		} catch (error) {
			console.error("Erro ao carregar agents:", error);
		} finally {
			setIsLoadingAgents(false);
		}
	}

	async function handleCriarAgent() {
		if (!agentIdentificador.trim()) {
			setErro("Informe um identificador para o agent.");
			return;
		}

		setErro(null);
		setTokenGerado(null);
		setIsCreatingAgent(true);

		try {
			const data = await criarWorkerAgentCliente(clienteId, {
				tipo: agentTipo,
				identificador: agentIdentificador.trim(),
			});

			setTokenGerado({
				token: data.token,
				identificador: data.agent.identificador,
				tipo: data.agent.tipo,
			});

			setAgentIdentificador("");

			await carregarAgents();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao criar agent"
			);
		} finally {
			setIsCreatingAgent(false);
		}
	}

	async function handleRevogarAgent(agentId: string) {
		setErro(null);
		setRevogandoAgentId(agentId);

		try {
			await revogarWorkerAgent(agentId);
			await carregarAgents();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao revogar agent"
			);
		} finally {
			setRevogandoAgentId(null);
		}
	}

	function formatarStatusAgent(agent: WorkerAgentResumo) {
		if (agent.statusOperacional === "ONLINE") {
			return "Online";
		}

		if (agent.statusOperacional === "INSTAVEL") {
			return "Instável";
		}

		if (agent.statusOperacional === "REVOGADO") {
			return "Revogado";
		}

		if (agent.statusOperacional === "INATIVO") {
			return "Inativo";
		}

		return "Offline";
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarPlanos();
			carregarCliente();
			carregarAgents();

			const timer = window.setInterval(() => {
				carregarAgents();
			}, 30000);

			return () => {
				window.clearInterval(timer);
			};
		}
	}, [isCheckingAuth]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<BackLink href="/clientes">← Voltar para clientes</BackLink>

				<Header>
					<HeaderGrid>
						<HeaderContent>
							<HeaderEyebrow>Gestão operacional do cliente</HeaderEyebrow>

							<Title>Editar cliente</Title>

							<Subtitle>
								Configure dados cadastrais, plano, status operacional e worker
								dedicado. Pagamentos, vencimentos e cobrança ficam no módulo
								Financeiro.
							</Subtitle>
						</HeaderContent>

						<HeaderPanel>
							<HeaderPanelItem>
								<HeaderPanelLabel>Processamento</HeaderPanelLabel>
								<HeaderPanelValue>{modoProcessamento}</HeaderPanelValue>
							</HeaderPanelItem>

							<HeaderPanelItem>
								<HeaderPanelLabel>Status do cliente</HeaderPanelLabel>
								<HeaderPanelValue>
									<StatusBadge status={status} />
								</HeaderPanelValue>
							</HeaderPanelItem>

							<HeaderPanelItem>
								<HeaderPanelLabel>Plano</HeaderPanelLabel>
								<HeaderPanelValue>
									{planos.find((plano) => plano.id === planoId)?.nome ?? "-"}
								</HeaderPanelValue>
							</HeaderPanelItem>

							<HeaderPanelItem>
								<HeaderPanelLabel>Cliente</HeaderPanelLabel>
								<HeaderPanelValue>{nome || "-"}</HeaderPanelValue>
							</HeaderPanelItem>
						</HeaderPanel>
					</HeaderGrid>
				</Header>

				{erro && <ErrorBox>{erro}</ErrorBox>}
				{sucesso && <SuccessBox>{sucesso}</SuccessBox>}

				{isLoading && (
					<EmptyState>
						<EmptyStateTitle>Carregando cliente...</EmptyStateTitle>
						Estamos buscando os dados do cliente.
					</EmptyState>
				)}

				{!isLoading && (
					<>
						<Card>
							<FormHeader>
								<FormSectionTitle>Configurações do cliente</FormSectionTitle>
								<Subtitle>
									Altere somente informações operacionais e cadastrais. A
									cobrança mensal deve ser feita por fatura.
								</Subtitle>
							</FormHeader>

							<Form onSubmit={handleSubmit}>
								<FormSection>
									<FormSectionTitle>Identificação</FormSectionTitle>

									<FormGrid>
										<Input
											label="Nome"
											value={nome}
											onChange={(event) => setNome(event.target.value)}
											required
										/>

										<Input
											label="Slug"
											value={slug}
											onChange={(event) => setSlug(event.target.value)}
											required
										/>

										<Select
											label="Status operacional"
											value={status}
											onChange={(event) =>
												setStatus(event.target.value as ClienteStatus)
											}
											required
										>
											<option value="ATIVO">ATIVO</option>
											<option value="INATIVO">INATIVO</option>
											<option value="SUSPENSO">SUSPENSO</option>
										</Select>

										<Select
											label="Plano contratado"
											value={planoId}
											onChange={(event) => setPlanoId(event.target.value)}
											required
										>
											{planos.map((plano) => (
												<option key={plano.id} value={plano.id}>
													{plano.nome}
												</option>
											))}
										</Select>
									</FormGrid>
								</FormSection>
								<FormSection>
									<FormSectionTitle>Identidade empresarial</FormSectionTitle>

									<Subtitle>
										Dados opcionais de identificação e contato da empresa. A
										validação oficial permanece na API.
									</Subtitle>

									<FormGrid>
										<Input
											label="CNPJ"
											value={cnpj}
											onChange={(event) =>
												setCnpj(formatarCnpj(event.target.value))
											}
											placeholder="00.000.000/0000-00"
											maxLength={18}
										/>

										<Input
											label="Razão social"
											value={razaoSocial}
											onChange={(event) => setRazaoSocial(event.target.value)}
										/>

										<Input
											label="Nome fantasia"
											value={nomeFantasia}
											onChange={(event) => setNomeFantasia(event.target.value)}
										/>

										<Input
											label="E-mail comercial"
											type="email"
											value={emailComercial}
											onChange={(event) =>
												setEmailComercial(event.target.value)
											}
										/>

										<Input
											label="Telefone comercial"
											value={telefoneComercial}
											onChange={(event) =>
												setTelefoneComercial(
													formatarTelefone(event.target.value)
												)
											}
											placeholder="(43) 99999-1234"
											inputMode="tel"
										/>
									</FormGrid>
								</FormSection>

								<FormSection>
									<FormSectionTitle>Endereço comercial</FormSectionTitle>

									<FormGrid>
										<Input
											label="CEP"
											value={enderecoCep}
											onChange={(event) =>
												setEnderecoCep(formatarCep(event.target.value))
											}
											placeholder="00000-000"
											inputMode="numeric"
										/>

										<Input
											label="Logradouro"
											value={enderecoLogradouro}
											onChange={(event) =>
												setEnderecoLogradouro(event.target.value)
											}
										/>

										<Input
											label="Número"
											value={enderecoNumero}
											onChange={(event) =>
												setEnderecoNumero(event.target.value)
											}
										/>

										<Input
											label="Complemento"
											value={enderecoComplemento}
											onChange={(event) =>
												setEnderecoComplemento(event.target.value)
											}
										/>

										<Input
											label="Bairro"
											value={enderecoBairro}
											onChange={(event) =>
												setEnderecoBairro(event.target.value)
											}
										/>

										<Input
											label="Cidade"
											value={enderecoCidade}
											onChange={(event) =>
												setEnderecoCidade(event.target.value)
											}
										/>

										<Input
											label="UF"
											value={enderecoUf}
											onChange={(event) =>
												setEnderecoUf(formatarUf(event.target.value))
											}
											maxLength={2}
											placeholder="PR"
										/>
									</FormGrid>
								</FormSection>


								<FormSection>
									<FormSectionTitle>Worker e operação</FormSectionTitle>

									<FormGrid>
										<Input
											label="Worker URL"
											value={workerUrl}
											onChange={(event) => setWorkerUrl(event.target.value)}
											placeholder="Ex: https://cliente-workers.imovelpratico.com"
										/>

										<Input
											label="Intervalo entre consultas (definido pelo plano)"
											type="number"
											value={intervaloSegundos}
											disabled
										/>

										<Input
											label="Limite diário operacional"
											type="number"
											min={1}
											value={limiteDiario}
											onChange={(event) => setLimiteDiario(event.target.value)}
											required
										/>

										<Select
											label="Modo de processamento"
											value={modoProcessamento}
											onChange={(event) =>
												setModoProcessamento(
													event.target.value as ClienteModoProcessamento
												)
											}
											required
										>
											<option value="QUEUE">QUEUE — Nuvem / VPS</option>
											<option value="AGENT">AGENT — Máquina do cliente</option>
										</Select>
									</FormGrid>
								</FormSection>

								<Actions>
									<Button type="submit" disabled={isSaving}>
										{isSaving ? "Salvando..." : "Salvar alterações"}
									</Button>
								</Actions>
							</Form>
						</Card>

						<Card>
							<FormHeader>
								<FormSectionTitle>
									Serviços na máquina do cliente
								</FormSectionTitle>
								<Subtitle>
									Acompanhe os agents locais do cliente. O status é calculado
									pelo último heartbeat recebido pela API.
								</Subtitle>
							</FormHeader>

							{tokenGerado && (
								<SuccessBox>
									Token gerado para {tokenGerado.tipo} —{" "}
									{tokenGerado.identificador}. Copie agora, ele não será exibido
									novamente:
									<br />
									<strong>{tokenGerado.token}</strong>
								</SuccessBox>
							)}

							<FormSection>
								<FormSectionTitle>Gerar novo agent</FormSectionTitle>

								<FormGrid>
									<Select
										label="Tipo do agent"
										value={agentTipo}
										onChange={(event) =>
											setAgentTipo(event.target.value as WorkerAgentTipo)
										}
									>
										<option value="REGISTRO">
											REGISTRO — busca prévia / 1RIBH
										</option>
										<option value="CND">CND — consulta proprietários</option>
									</Select>

									<Input
										label="Identificador"
										value={agentIdentificador}
										onChange={(event) =>
											setAgentIdentificador(event.target.value)
										}
										placeholder="Ex: cnd-windows-twa-01"
									/>
								</FormGrid>

								<Actions>
									<Button
										type="button"
										disabled={isCreatingAgent}
										onClick={handleCriarAgent}
									>
										{isCreatingAgent ? "Gerando..." : "Gerar token do agent"}
									</Button>
								</Actions>
							</FormSection>

							<FormSection>
								<FormSectionTitle>Agents cadastrados</FormSectionTitle>

								{isLoadingAgents && (
									<EmptyState>
										<EmptyStateTitle>Carregando agents...</EmptyStateTitle>
										Buscando serviços vinculados ao cliente.
									</EmptyState>
								)}

								{!isLoadingAgents && agents.length === 0 && (
									<EmptyState>
										<EmptyStateTitle>Nenhum agent cadastrado.</EmptyStateTitle>
										Gere um agent REGISTRO e um agent CND para usar
										processamento local.
									</EmptyState>
								)}

								{!isLoadingAgents &&
									agents.map((agent) => (
										<div
											key={agent.id}
											style={{
												border: "1px solid rgba(148, 163, 184, 0.2)",
												borderRadius: 16,
												padding: 16,
												marginTop: 12,
												display: "grid",
												gap: 12,
											}}
										>
											<div>
												<strong>
													{agent.tipo} — {agent.identificador}
												</strong>
												<br />
												<span>Status: {formatarStatusAgent(agent)}</span>
												<br />
												<span>
													Último sinal:{" "}
													{agent.ultimoSinalEm
														? new Intl.DateTimeFormat("pt-BR", {
																dateStyle: "short",
																timeStyle: "medium",
															}).format(new Date(agent.ultimoSinalEm))
														: "Nunca conectado"}
												</span>
											</div>

											<Actions>
												<Button
													type="button"
													disabled={
														agent.status === "REVOGADO" ||
														revogandoAgentId === agent.id
													}
													onClick={() => handleRevogarAgent(agent.id)}
												>
													{revogandoAgentId === agent.id
														? "Revogando..."
														: "Revogar"}
												</Button>
											</Actions>
										</div>
									))}
							</FormSection>
						</Card>
					</>
				)}
			</PageContainer>
		</>
	);
}
