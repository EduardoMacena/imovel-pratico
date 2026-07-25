"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { buscarDashboardAdmin } from "../../features/admin/api";
import type { DashboardAdminResponse } from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import {
  ActionCard,
  ActionDescription,
  ActionGrid,
  ActionTitle,
  BarFill,
  BarInfo,
  BarLabel,
  BarList,
  BarRow,
  BarTrack,
  ClientItem,
  ClientLink,
  DashboardGrid,
  EmptyState,
  EmptyStateTitle,
  ErrorBox,
  HeaderActions,
  HeroCard,
  HeroContent,
  HeroEyebrow,
  HeroGrid,
  HeroPanel,
  HeroPanelFooter,
  HeroPanelHeader,
  HeroPanelMetric,
  HeroPanelMetricGrid,
  HeroPanelSubtitle,
  HeroPanelTitle,
  HeroSubtitle,
  HeroTitle,
  InfoBox,
  InfoGrid,
  InfoLabel,
  InfoValue,
  ItemMuted,
  ItemTitle,
  ItemTop,
  List,
  MainColumn,
  MetricCard,
  MetricGrid,
  MetricHint,
  MetricLabel,
  MetricValue,
  PageContainer,
  PageShell,
  PanelCard,
  PanelHeader,
  PanelSubtitle,
  PanelTitle,
  PrimaryLink,
  RecentAddress,
  RecentContent,
  RecentDate,
  RecentItem,
  RecentList,
  SecondaryLink,
  SideColumn,
  TaskLink,
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

function formatNumber(value: number | undefined | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
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

  const indicadores = dashboard?.indicadores;

  const tarefasEmAndamento =
    (indicadores?.tarefasPendentes ?? 0) +
    (indicadores?.tarefasProcessando ?? 0);

  const taxaConclusao = useMemo(() => {
    if (!indicadores || indicadores.tarefasTotal <= 0) {
      return 0;
    }

    return Math.round(
      (indicadores.tarefasConcluidas / indicadores.tarefasTotal) * 100
    );
  }, [indicadores]);

  const distribuicaoTarefas = [
    {
      label: "Concluídas",
      value: indicadores?.tarefasConcluidas ?? 0,
    },
    {
      label: "Pendentes",
      value: indicadores?.tarefasPendentes ?? 0,
    },
    {
      label: "Processando",
      value: indicadores?.tarefasProcessando ?? 0,
    },
    {
      label: "Com erro",
      value: indicadores?.tarefasComErro ?? 0,
    },
  ];

  const maiorValorGrafico = Math.max(
    1,
    ...distribuicaoTarefas.map(item => item.value)
  );

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageShell>
        <PageContainer>
          <HeroGrid>
            <HeroCard>
              <HeroContent>
                <HeroEyebrow>Painel administrativo</HeroEyebrow>

                <HeroTitle>Gestão executiva do Imóvel Prático.</HeroTitle>

                <HeroSubtitle>
                  Acompanhe clientes, consumo, tarefas, resultados encontrados e
                  saúde operacional do SaaS em uma visão centralizada.
                </HeroSubtitle>

                <HeaderActions>
                  <PrimaryLink href="/clientes">Gerenciar clientes</PrimaryLink>
                  <SecondaryLink href="/planos">Ver planos</SecondaryLink>
                </HeaderActions>
              </HeroContent>
            </HeroCard>

            <HeroPanel>
              <HeroPanelHeader>
                <div>
                  <HeroPanelTitle>Operação geral</HeroPanelTitle>
                  <HeroPanelSubtitle>
                    Resumo dos principais indicadores administrativos.
                  </HeroPanelSubtitle>
                </div>
              </HeroPanelHeader>

              <HeroPanelMetricGrid>
                <HeroPanelMetric>
                  <span>Resultados</span>
                  <strong>{formatNumber(indicadores?.resultadosTotal ?? 0)}</strong>
                </HeroPanelMetric>

                <HeroPanelMetric>
                  <span>Clientes ativos</span>
                  <strong>{formatNumber(indicadores?.clientesAtivos ?? 0)}</strong>
                </HeroPanelMetric>

                <HeroPanelMetric>
                  <span>Conclusão</span>
                  <strong>{taxaConclusao}%</strong>
                </HeroPanelMetric>
              </HeroPanelMetricGrid>

              <HeroPanelFooter>
                {formatNumber(indicadores?.tarefasUltimos30Dias ?? 0)} tarefa(s)
                nos últimos 30 dias.
              </HeroPanelFooter>
            </HeroPanel>
          </HeroGrid>

          {erro && <ErrorBox>{erro}</ErrorBox>}

          {isLoading && (
            <EmptyState>
              <EmptyStateTitle>Carregando dashboard...</EmptyStateTitle>
              Estamos buscando os indicadores mais recentes da operação.
            </EmptyState>
          )}

          {!isLoading && dashboard && (
            <>
              <MetricGrid>
                <MetricCard>
                  <MetricLabel>Total de clientes</MetricLabel>
                  <MetricValue>
                    {formatNumber(dashboard.indicadores.totalClientes)}
                  </MetricValue>
                  <MetricHint>Base total cadastrada no SaaS.</MetricHint>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>Clientes ativos</MetricLabel>
                  <MetricValue>
                    {formatNumber(dashboard.indicadores.clientesAtivos)}
                  </MetricValue>
                  <MetricHint>Clientes liberados para operação.</MetricHint>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>Tarefas totais</MetricLabel>
                  <MetricValue>
                    {formatNumber(dashboard.indicadores.tarefasTotal)}
                  </MetricValue>
                  <MetricHint>Volume histórico processado.</MetricHint>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>Em andamento</MetricLabel>
                  <MetricValue>{formatNumber(tarefasEmAndamento)}</MetricValue>
                  <MetricHint>Pendentes ou processando agora.</MetricHint>
                </MetricCard>
              </MetricGrid>

              <DashboardGrid>
                <MainColumn>
                  <PanelCard>
                    <PanelHeader>
                      <div>
                        <PanelTitle>Distribuição das tarefas</PanelTitle>
                        <PanelSubtitle>
                          Leitura rápida do volume por status operacional.
                        </PanelSubtitle>
                      </div>
                    </PanelHeader>

                    <BarList>
                      {distribuicaoTarefas.map(item => (
                        <BarRow key={item.label}>
                          <BarInfo>
                            <BarLabel>{item.label}</BarLabel>
                            <strong>{formatNumber(item.value)}</strong>
                          </BarInfo>

                          <BarTrack>
                            <BarFill
                              $percentage={(item.value / maiorValorGrafico) * 100}
                            />
                          </BarTrack>
                        </BarRow>
                      ))}
                    </BarList>
                  </PanelCard>

                  <PanelCard>
                    <PanelHeader>
                      <div>
                        <PanelTitle>Clientes por uso</PanelTitle>
                        <PanelSubtitle>
                          Clientes com maior atividade operacional na plataforma.
                        </PanelSubtitle>
                      </div>

                      <ClientLink href="/clientes">Ver clientes</ClientLink>
                    </PanelHeader>

                    {dashboard.clientesPorUso.length === 0 && (
                      <EmptyState>
                        <EmptyStateTitle>Nenhum cliente encontrado.</EmptyStateTitle>
                        Quando houver clientes cadastrados, eles aparecerão aqui.
                      </EmptyState>
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

                            <InfoGrid>
                              <InfoBox>
                                <InfoLabel>Usuários</InfoLabel>
                                <InfoValue>
                                  {formatNumber(cliente.totalUsuarios)}
                                </InfoValue>
                              </InfoBox>

                              <InfoBox>
                                <InfoLabel>Tarefas</InfoLabel>
                                <InfoValue>
                                  {formatNumber(cliente.totalTarefas)}
                                </InfoValue>
                              </InfoBox>

                              <InfoBox>
                                <InfoLabel>Ação</InfoLabel>
                                <TaskLink href={`/clientes/${cliente.id}/tarefas`}>
                                  Ver tarefas
                                </TaskLink>
                              </InfoBox>
                            </InfoGrid>
                          </ClientItem>
                        ))}
                      </List>
                    )}
                  </PanelCard>
                </MainColumn>

                <SideColumn>
                  <ActionCard>
                    <ActionTitle>Ações administrativas</ActionTitle>
                    <ActionDescription>
                      Acesse rapidamente as áreas principais da operação.
                    </ActionDescription>

                    <ActionGrid>
                      <PrimaryLink href="/clientes">Clientes</PrimaryLink>
                      <SecondaryLink href="/planos">Planos</SecondaryLink>
                    </ActionGrid>
                  </ActionCard>

                  <PanelCard>
                    <PanelHeader>
                      <div>
                        <PanelTitle>Últimas tarefas</PanelTitle>
                        <PanelSubtitle>
                          Atividades recentes executadas pelos clientes.
                        </PanelSubtitle>
                      </div>
                    </PanelHeader>

                    {dashboard.ultimasTarefas.length === 0 && (
                      <EmptyState>
                        <EmptyStateTitle>Nenhuma tarefa encontrada.</EmptyStateTitle>
                        As tarefas recentes aparecerão aqui.
                      </EmptyState>
                    )}

                    {dashboard.ultimasTarefas.length > 0 && (
                      <RecentList>
                        {dashboard.ultimasTarefas.map(tarefa => (
                          <RecentItem key={tarefa.id}>
                            <RecentContent>
                              <ItemTop>
                                <div>
                                  <RecentAddress>
                                    {tarefa.endereco.logradouro},{" "}
                                    {tarefa.endereco.numero}
                                  </RecentAddress>

                                  <RecentDate>
                                    {tarefa.cliente.nome} · {formatDate(tarefa.createdAt)}
                                  </RecentDate>
                                </div>

                                <StatusBadge status={tarefa.status} />
                              </ItemTop>

                              <InfoGrid>
                                <InfoBox>
                                  <InfoLabel>Progresso</InfoLabel>
                                  <InfoValue>
                                    {tarefa.progress.current}/{tarefa.progress.total} ·{" "}
                                    {tarefa.progress.percentage}%
                                  </InfoValue>
                                </InfoBox>

                                <InfoBox>
                                  <InfoLabel>Resultados</InfoLabel>
                                  <InfoValue>
                                    {formatNumber(tarefa.totalResultados)}
                                  </InfoValue>
                                </InfoBox>
                              </InfoGrid>

                              <TaskLink href={`/tarefas/${tarefa.id}`}>
                                Ver detalhes
                              </TaskLink>
                            </RecentContent>
                          </RecentItem>
                        ))}
                      </RecentList>
                    )}
                  </PanelCard>
                </SideColumn>
              </DashboardGrid>
            </>
          )}
        </PageContainer>
      </PageShell>
    </>
  );
}
