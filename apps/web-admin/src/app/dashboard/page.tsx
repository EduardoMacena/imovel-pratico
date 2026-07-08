"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { buscarDashboardAdmin } from "../../features/admin/api";
import type { DashboardAdminResponse } from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import {
  ClientItem,
  EmptyState,
  ErrorBox,
  Header,
  IndicatorCard,
  IndicatorGrid,
  IndicatorLabel,
  IndicatorValue,
  InfoBox,
  InfoLabel,
  InfoValue,
  ItemMuted,
  ItemTitle,
  ItemTop,
  List,
  PageContainer,
  Section,
  SectionGrid,
  SectionHeader,
  SectionLink,
  SectionTitle,
  Subtitle,
  TaskInfoGrid,
  TaskItem,
  Title,
} from "./page.styles";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [dashboard, setDashboard] = useState<DashboardAdminResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarDashboard() {
    try {
      setErro(null);

      const data = await buscarDashboardAdmin();

      setDashboard(data);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarDashboard();
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
          <Title>Dashboard geral</Title>

          <Subtitle>
            Visão geral da operação do SaaS, clientes cadastrados, tarefas
            executadas e resultados encontrados.
          </Subtitle>
        </Header>

        {erro && <ErrorBox>{erro}</ErrorBox>}

        {isLoading && <EmptyState>Carregando dashboard...</EmptyState>}

        {!isLoading && dashboard && (
          <>
            <IndicatorGrid>
              <IndicatorCard>
                <IndicatorLabel>Total de clientes</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.totalClientes}
                </IndicatorValue>
              </IndicatorCard>

              <IndicatorCard>
                <IndicatorLabel>Clientes ativos</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.clientesAtivos}
                </IndicatorValue>
              </IndicatorCard>

              <IndicatorCard>
                <IndicatorLabel>Tarefas totais</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.tarefasTotal}
                </IndicatorValue>
              </IndicatorCard>

              <IndicatorCard>
                <IndicatorLabel>Últimos 30 dias</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.tarefasUltimos30Dias}
                </IndicatorValue>
              </IndicatorCard>

              <IndicatorCard>
                <IndicatorLabel>Concluídas</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.tarefasConcluidas}
                </IndicatorValue>
              </IndicatorCard>

              <IndicatorCard>
                <IndicatorLabel>Em andamento</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.tarefasPendentes +
                    dashboard.indicadores.tarefasProcessando}
                </IndicatorValue>
              </IndicatorCard>

              <IndicatorCard>
                <IndicatorLabel>Com erro</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.tarefasComErro}
                </IndicatorValue>
              </IndicatorCard>

              <IndicatorCard>
                <IndicatorLabel>Resultados encontrados</IndicatorLabel>
                <IndicatorValue>
                  {dashboard.indicadores.resultadosTotal}
                </IndicatorValue>
              </IndicatorCard>
            </IndicatorGrid>

            <SectionGrid>
              <Section>
                <SectionHeader>
                  <SectionTitle>Clientes por uso</SectionTitle>
                  <SectionLink href="/clientes">Ver clientes</SectionLink>
                </SectionHeader>

                {dashboard.clientesPorUso.length === 0 && (
                  <EmptyState>Nenhum cliente encontrado.</EmptyState>
                )}

                {dashboard.clientesPorUso.length > 0 && (
                  <List>
                    {dashboard.clientesPorUso.map(cliente => (
                      <ClientItem key={cliente.id}>
                        <ItemTop>
                          <div>
                            <ItemTitle>{cliente.nome}</ItemTitle>
                            <ItemMuted>{cliente.slug}</ItemMuted>
                          </div>

                          <StatusBadge status={cliente.status} />
                        </ItemTop>

                        <TaskInfoGrid>
                          <InfoBox>
                            <InfoLabel>Usuários</InfoLabel>
                            <InfoValue>{cliente.totalUsuarios}</InfoValue>
                          </InfoBox>

                          <InfoBox>
                            <InfoLabel>Tarefas</InfoLabel>
                            <InfoValue>{cliente.totalTarefas}</InfoValue>
                          </InfoBox>
                        </TaskInfoGrid>
                      </ClientItem>
                    ))}
                  </List>
                )}
              </Section>

              <Section>
                <SectionHeader>
                  <SectionTitle>Últimas tarefas</SectionTitle>
                </SectionHeader>

                {dashboard.ultimasTarefas.length === 0 && (
                  <EmptyState>Nenhuma tarefa encontrada.</EmptyState>
                )}

                {dashboard.ultimasTarefas.length > 0 && (
                  <List>
                    {dashboard.ultimasTarefas.map(tarefa => (
                      <TaskItem key={tarefa.id}>
                        <ItemTop>
                          <div>
                            <ItemTitle>{tarefa.cliente.nome}</ItemTitle>
                            <ItemMuted>
                              {tarefa.endereco.logradouro},{" "}
                              {tarefa.endereco.numero}
                            </ItemMuted>
                          </div>

                          <StatusBadge status={tarefa.status} />
                        </ItemTop>

                        <TaskInfoGrid>
                          <InfoBox>
                            <InfoLabel>Progresso</InfoLabel>
                            <InfoValue>
                              {tarefa.progress.current}/{tarefa.progress.total}{" "}
                              — {tarefa.progress.percentage}%
                            </InfoValue>
                          </InfoBox>

                          <InfoBox>
                            <InfoLabel>Resultados</InfoLabel>
                            <InfoValue>{tarefa.totalResultados}</InfoValue>
                          </InfoBox>

                          <InfoBox>
                            <InfoLabel>Período</InfoLabel>
                            <InfoValue>
                              {tarefa.periodo.mesAnoInicio} até{" "}
                              {tarefa.periodo.mesAnoFinal}
                            </InfoValue>
                          </InfoBox>

                          <InfoBox>
                            <InfoLabel>Criado em</InfoLabel>
                            <InfoValue>{formatDate(tarefa.createdAt)}</InfoValue>
                          </InfoBox>
                        </TaskInfoGrid>
                      </TaskItem>
                    ))}
                  </List>
                )}
              </Section>
            </SectionGrid>
          </>
        )}
      </PageContainer>
    </>
  );
}
