"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "../../../../components/AppHeader";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { Input } from "../../../../components/Input";
import { Select } from "../../../../components/Select";
import {
	atualizarCliente,
	buscarCliente,
  listarPlanos
} from "../../../../features/admin/api";
import type {
	ClienteStatus,
	PagamentoStatus,
  PlanoResumo
} from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
import {
	Actions,
	BackLink,
	EmptyState,
	ErrorBox,
	Form,
	Header,
	PageContainer,
	Subtitle,
	SuccessBox,
	Title,
} from "./page.styles";

function toDateInput(value?: string | null) {
	if (!value) {
		return "";
	}

	return new Date(value).toISOString().slice(0, 10);
}

function fromDateInput(value: string) {
	if (!value) {
		return null;
	}

	return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export default function EditarClientePage() {
	const { isCheckingAuth } = useRequireSuperAdmin();
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const clienteId = params.id;

	const [planos, setPlanos] = useState<PlanoResumo[]>([]);
	const [planoId, setPlanoId] = useState("");

	const [nome, setNome] = useState("");
	const [slug, setSlug] = useState("");
	const [status, setStatus] = useState<ClienteStatus>("ATIVO");
	const [workerUrl, setWorkerUrl] = useState("");

	const [pagamentoStatus, setPagamentoStatus] =
		useState<PagamentoStatus>("PENDENTE");
	const [pagamentoVenceEm, setPagamentoVenceEm] = useState("");

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

			setNome(data.cliente.nome);
			setSlug(data.cliente.slug);
			setStatus(data.cliente.status);
			setWorkerUrl(data.cliente.workerUrl ?? "");
			setPlanoId(data.cliente.planoId ?? "");
      setPagamentoStatus(data.cliente.pagamentoStatus);
      setPagamentoVenceEm(toDateInput(data.cliente.pagamentoVenceEm));
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
			await atualizarCliente(clienteId, {
				nome,
				slug,
				status,
				workerUrl: workerUrl.trim() || null,
        pagamentoStatus,
        pagamentoVenceEm: fromDateInput(pagamentoVenceEm),
        planoId,
			});

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

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarPlanos();
			carregarCliente();
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
					<Title>Editar cliente</Title>
					<Subtitle>
						Configure plano, pagamento, intervalo de processamento e status do
						cliente.
					</Subtitle>
				</Header>

				{isLoading && <EmptyState>Carregando cliente...</EmptyState>}

				{!isLoading && (
					<Card>
						<Form onSubmit={handleSubmit}>
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
								label="Status do cliente"
								value={status}
								onChange={(event) =>
									setStatus(event.target.value as ClienteStatus)
								}
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
										{plano.nome} — {plano.limiteMensalConsultas} consultas —{" "}
										{plano.intervaloSegundos}s — {plano.status}
									</option>
								))}
							</Select>

              <Select
                label="Status do pagamento"
                value={pagamentoStatus}
                onChange={event =>
                  setPagamentoStatus(event.target.value as PagamentoStatus)
                }
              >
                <option value="PAGO">PAGO</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="VENCIDO">VENCIDO</option>
                <option value="CANCELADO">CANCELADO</option>
              </Select>

							<Input
								label="Vencimento do pagamento"
								type="date"
								value={pagamentoVenceEm}
								onChange={(event) => setPagamentoVenceEm(event.target.value)}
							/>

							<Input
								label="Worker URL"
								value={workerUrl}
								onChange={(event) => setWorkerUrl(event.target.value)}
								placeholder="Opcional"
							/>

							{erro && <ErrorBox>{erro}</ErrorBox>}
							{sucesso && <SuccessBox>{sucesso}</SuccessBox>}

							<Actions>
								<Button type="submit" disabled={isSaving}>
									{isSaving ? "Salvando..." : "Salvar alterações"}
								</Button>

								<Button
									type="button"
									onClick={() => router.push(`/clientes/${clienteId}/usuarios`)}
								>
									Gerenciar usuários
								</Button>
							</Actions>
						</Form>
					</Card>
				)}
			</PageContainer>
		</>
	);
}
