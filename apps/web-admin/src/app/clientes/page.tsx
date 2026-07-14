"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { StatusBadge } from "../../components/StatusBadge";
import {
  criarCliente,
  listarClientes,
  listarPlanos,
} from "../../features/admin/api";
import type {
  ClienteResumo,
  PlanoResumo,
} from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import { formatCurrencyFromCents, formatDateTimeBR } from "../../lib/formatters";
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

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

export default function ClientesPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [planos, setPlanos] = useState<PlanoResumo[]>([]);
  const [planoId, setPlanoId] = useState("");

  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [nome, setNome] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const ativos = clientes.filter(cliente => cliente.status === "ATIVO").length;
    const suspensos = clientes.filter(
      cliente => cliente.status === "SUSPENSO"
    ).length;

    const totalUsuarios = clientes.reduce((total, cliente) => {
      return total + cliente.totalUsuarios;
    }, 0);

    const totalTarefas = clientes.reduce((total, cliente) => {
      return total + cliente.totalTarefas;
    }, 0);

    return {
      ativos,
      suspensos,
      totalUsuarios,
      totalTarefas,
    };
  }, [clientes]);

  async function carregarPlanos() {
    const data = await listarPlanos();

    const planosAtivos = data.planos.filter(plano => plano.status === "ATIVO");

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
              <HeaderEyebrow>Gestão operacional</HeaderEyebrow>

              <Title>Clientes</Title>

              <Subtitle>
                Cadastre imobiliárias, configure plano, worker dedicado,
                usuários e acompanhe tarefas. A cobrança fica concentrada no
                módulo financeiro.
              </Subtitle>
            </HeaderContent>

            <HeaderPanel>
              <HeaderPanelLabel>Clientes ativos</HeaderPanelLabel>
              <HeaderPanelValue>{resumo.ativos}</HeaderPanelValue>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        <StatGrid>
          <StatCard>
            <StatLabel>Clientes ativos</StatLabel>
            <StatValue>{resumo.ativos}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Clientes suspensos</StatLabel>
            <StatValue>{resumo.suspensos}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Usuários cadastrados</StatLabel>
            <StatValue>{resumo.totalUsuarios}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Tarefas criadas</StatLabel>
            <StatValue>{resumo.totalTarefas}</StatValue>
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
                  onChange={event => setNome(event.target.value)}
                  placeholder="Ex: TWA Investimentos"
                  required
                />

                <Select
                  label="Plano"
                  value={planoId}
                  onChange={event => setPlanoId(event.target.value)}
                  required
                >
                  {planos.map(plano => (
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
                  Controle operacional por cliente. Para cobrança, vencimento e
                  pagamento, use o menu Financeiro.
                </ListSubtitle>
              </div>
            </ListHeader>

            {erro && <ErrorBox>{erro}</ErrorBox>}

            {isLoading && (
              <EmptyState>
                <EmptyStateTitle>Carregando clientes...</EmptyStateTitle>
                Estamos buscando os clientes cadastrados.
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
                {clientes.map(cliente => (
                  <ClientItem key={cliente.id}>
                    <ClientTop>
                      <div>
                        <ClientName>{cliente.nome}</ClientName>
                        <ClientMeta>
                          {cliente.slug} · Plano:{" "}
                          {cliente.plano?.nome ?? "Sem plano"}
                        </ClientMeta>
                      </div>

                      <StatusBadge status={cliente.status} />
                    </ClientTop>

                    <InfoGrid>
                      <InfoBox>
                        <InfoLabel>Plano</InfoLabel>
                        <InfoValue>{cliente.plano?.nome ?? "-"}</InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Mensalidade</InfoLabel>
                        <InfoValue>
                          {formatCurrencyFromCents(
                            cliente.plano?.precoCentavos
                          )}
                        </InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Usuários</InfoLabel>
                        <InfoValue>{cliente.totalUsuarios}</InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Tarefas</InfoLabel>
                        <InfoValue>{cliente.totalTarefas}</InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Criado em</InfoLabel>
                        <InfoValue>{formatDate(cliente.createdAt)}</InfoValue>
                      </InfoBox>
                    </InfoGrid>

                    <Actions>
                      <DetailsLink href={`/clientes/${cliente.id}/editar`}>
                        Configurações
                      </DetailsLink>

                      <DetailsLink href={`/clientes/${cliente.id}/usuarios`}>
                        Usuários
                      </DetailsLink>

                      <DetailsLink href={`/clientes/${cliente.id}/tarefas`}>
                        Tarefas
                      </DetailsLink>

                      <DetailsLink href="/financeiro">
                        Financeiro
                      </DetailsLink>
                    </Actions>
                  </ClientItem>
                ))}
              </List>
            )}
          </div>
        </Grid>
      </PageContainer>
    </>
  );
}
