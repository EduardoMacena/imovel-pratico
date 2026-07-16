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
} from "../../../../features/admin/api";
import type {
  ClienteStatus,
  PlanoResumo,
} from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
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

  const [nome, setNome] = useState("");
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
      setSlug(cliente.slug);
      setStatus(cliente.status);
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
      await atualizarCliente(clienteId, {
        nome,
        slug,
        status,
        workerUrl: workerUrl.trim() || null,
        intervaloSegundos: Number(intervaloSegundos),
        limiteDiario: Number(limiteDiario),
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
                <HeaderPanelLabel>Status do cliente</HeaderPanelLabel>
                <HeaderPanelValue>
                  <StatusBadge status={status} />
                </HeaderPanelValue>
              </HeaderPanelItem>

              <HeaderPanelItem>
                <HeaderPanelLabel>Plano</HeaderPanelLabel>
                <HeaderPanelValue>
                  {planos.find(plano => plano.id === planoId)?.nome ?? "-"}
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
          <Card>
            <FormHeader>
              <FormSectionTitle>Configurações do cliente</FormSectionTitle>
              <Subtitle>
                Altere somente informações operacionais e cadastrais. A cobrança
                mensal deve ser feita por fatura.
              </Subtitle>
            </FormHeader>

            <Form onSubmit={handleSubmit}>
              <FormSection>
                <FormSectionTitle>Identificação</FormSectionTitle>

                <FormGrid>
                  <Input
                    label="Nome"
                    value={nome}
                    onChange={event => setNome(event.target.value)}
                    required
                  />

                  <Input
                    label="Slug"
                    value={slug}
                    onChange={event => setSlug(event.target.value)}
                    required
                  />

                  <Select
                    label="Status operacional"
                    value={status}
                    onChange={event =>
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
                    onChange={event => setPlanoId(event.target.value)}
                    required
                  >
                    {planos.map(plano => (
                      <option key={plano.id} value={plano.id}>
                        {plano.nome}
                      </option>
                    ))}
                  </Select>
                </FormGrid>
              </FormSection>

              <FormSection>
                <FormSectionTitle>Worker e operação</FormSectionTitle>

                <FormGrid>
                  <Input
                    label="Worker URL"
                    value={workerUrl}
                    onChange={event => setWorkerUrl(event.target.value)}
                    placeholder="Ex: https://cliente-workers.imovelpratico.com"
                  />

                  <Input
                    label="Intervalo entre consultas"
                    type="number"
                    min={1}
                    value={intervaloSegundos}
                    onChange={event => setIntervaloSegundos(event.target.value)}
                    required
                  />

                  <Input
                    label="Limite diário operacional"
                    type="number"
                    min={1}
                    value={limiteDiario}
                    onChange={event => setLimiteDiario(event.target.value)}
                    required
                  />
                </FormGrid>
              </FormSection>

              <Actions>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </Actions>
            </Form>
          </Card>
        )}
      </PageContainer>
    </>
  );
}
