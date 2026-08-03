"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { listarClientes } from "../../features/admin/api";
import type { ClienteResumo } from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import { formatCurrencyFromCents } from "../../lib/formatters";
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
  StatCard,
  StatGrid,
  StatLabel,
  StatValue,
  Subtitle,
  Title,
} from "./page.styles";

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date(value),
  );
}

export default function ClientesPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const ativos = clientes.filter(
      (cliente) => cliente.status === "ATIVO",
    ).length;
    const suspensos = clientes.filter(
      (cliente) => cliente.status === "SUSPENSO",
    ).length;

    return {
      ativos,
      suspensos,
      totalUsuarios: clientes.reduce(
        (total, cliente) => total + cliente.totalUsuarios,
        0,
      ),
      totalTarefas: clientes.reduce(
        (total, cliente) => total + cliente.totalTarefas,
        0,
      ),
    };
  }, [clientes]);

  async function carregarClientes() {
    try {
      setErro(null);
      setIsLoading(true);
      const data = await listarClientes();
      setClientes(data.clientes);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar clientes",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) void carregarClientes();
  }, [isCheckingAuth]);

  if (isCheckingAuth) return null;

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
                Acompanhe imobiliárias, planos, usuários e operação. O cadastro
                guiado reúne empresa, pagamento, município e administrador em um
                único fluxo seguro.
              </Subtitle>
              <Actions>
                <DetailsLink href="/clientes/novo">
                  + Cadastrar novo cliente
                </DetailsLink>
              </Actions>
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

        <ListHeader>
          <div>
            <ListTitle>Clientes cadastrados</ListTitle>
            <ListSubtitle>
              Controle configurações, usuários, tarefas, instaladores e situação
              operacional.
            </ListSubtitle>
          </div>
          <DetailsLink href="/clientes/novo">Novo cliente</DetailsLink>
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
            Conclua o fluxo guiado para criar o primeiro cliente, município
            principal e administrador inicial.
            <Actions>
              <DetailsLink href="/clientes/novo">
                Iniciar primeiro cadastro
              </DetailsLink>
            </Actions>
          </EmptyState>
        )}

        {!isLoading && clientes.length > 0 && (
          <List>
            {clientes.map((cliente) => (
              <ClientItem key={cliente.id}>
                <ClientTop>
                  <div>
                    <ClientName>{cliente.nome}</ClientName>
                    <ClientMeta>
                      {cliente.slug} · Plano:{" "}
                      {cliente.plano?.nome ?? "Sem plano"} · Processamento:{" "}
                      {cliente.modoProcessamento}
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
                      {formatCurrencyFromCents(cliente.plano?.precoCentavos)}
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
                  <DetailsLink href={`/clientes/${cliente.id}/instalador`}>
                    Instalador
                  </DetailsLink>
                  <DetailsLink href="/financeiro">Financeiro</DetailsLink>
                </Actions>
              </ClientItem>
            ))}
          </List>
        )}
      </PageContainer>
    </>
  );
}
