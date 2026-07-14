"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "../../../components/AppHeader";
import { Button } from "../../../components/Button";
import { ProgressBar } from "../../../components/ProgressBar";
import { ResultCard } from "../../../components/ResultCard";
import { StatusBadge } from "../../../components/StatusBadge";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import {
  buscarProgressoTarefa,
  exportarResultadosTarefa,
  exportarResultadosTarefaExcel,
  exportarResultadosTarefaPdf,
} from "../../../features/busca/api";
import type { ProgressoTarefaResponse } from "../../../features/busca/types";
import {
  BackLink,
  EmptyState,
  ErrorBox,
  ExportActions,
  Header,
  HeaderContent,
  HeaderEyebrow,
  HeaderGrid,
  HeaderPanel,
  HeaderPanelGrid,
  HeaderPanelItem,
  HeaderPanelLabel,
  HeaderPanelValue,
  HeroActions,
  IntelligenceCard,
  IntelligenceGrid,
  IntelligenceLabel,
  IntelligenceValue,
  PageContainer,
  PageShell,
  ProgressPanel,
  ResultsCount,
  ResultsHeader,
  ResultsList,
  ResultsSection,
  ResultsTitle,
  SectionCard,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  StatusPanel,
  SummaryBox,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  TaskId,
  Title,
  TopBar,
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

function isFinalStatus(status?: string) {
  return status === "COMPLETED" || status === "ERROR" || status === "CANCELED";
}

function getStatusLabel(status?: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PROCESSING: "Processando",
    COMPLETED: "Concluída",
    ERROR: "Com erro",
    CANCELED: "Cancelada",
  };

  if (!status) {
    return "-";
  }

  return labels[status] ?? status;
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function DetalheHistoricoPage() {
  const { isCheckingAuth } = useRequireAuth();
  const params = useParams<{ id: string }>();

  const tarefaId = params.id;

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [tarefa, setTarefa] = useState<ProgressoTarefaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const isFinalizado = useMemo(() => {
    return isFinalStatus(tarefa?.status);
  }, [tarefa?.status]);

  const resultados = tarefa?.resultados ?? [];
  const totalResultados = resultados.length;
  const percentual = tarefa?.progress.percentage ?? 0;

  async function handleExportarCsv() {
    if (!tarefaId) {
      return;
    }

    setIsExporting(true);
    setErro(null);

    try {
      await exportarResultadosTarefa(tarefaId);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao exportar CSV"
      );
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportarExcel() {
    if (!tarefaId) {
      return;
    }

    setIsExportingExcel(true);
    setErro(null);

    try {
      await exportarResultadosTarefaExcel(tarefaId);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao exportar Excel"
      );
    } finally {
      setIsExportingExcel(false);
    }
  }

  async function handleExportarPdf() {
    if (!tarefaId) {
      return;
    }

    setIsExportingPdf(true);
    setErro(null);

    try {
      await exportarResultadosTarefaPdf(tarefaId);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao exportar PDF"
      );
    } finally {
      setIsExportingPdf(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function carregarTarefa() {
      try {
        setErro(null);

        const data = await buscarProgressoTarefa(tarefaId);

        if (isMounted) {
          setTarefa(data);
        }
      } catch (error) {
        if (isMounted) {
          setErro(
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao carregar detalhes da busca"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    carregarTarefa();

    if (isFinalizado) {
      return () => {
        isMounted = false;
      };
    }

    const interval = window.setInterval(carregarTarefa, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [tarefaId, isFinalizado]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageShell>
        <PageContainer>
          <TopBar>
            <BackLink href="/historico">← Voltar para o histórico</BackLink>
          </TopBar>

          <Header>
            <HeaderGrid>
              <HeaderContent>
                <HeaderEyebrow>Inteligência da busca</HeaderEyebrow>

                <Title>Detalhes da captação</Title>

                <TaskId>Tarefa: {tarefaId}</TaskId>

                <HeroActions>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isExporting}
                    onClick={handleExportarCsv}
                  >
                    {isExporting ? "Exportando..." : "Exportar CSV"}
                  </Button>

                  <Button
                    type="button"
                    variant="accent"
                    disabled={isExportingExcel}
                    onClick={handleExportarExcel}
                  >
                    {isExportingExcel ? "Exportando..." : "Exportar Excel"}
                  </Button>
                </HeroActions>
              </HeaderContent>

              <HeaderPanel>
                <HeaderPanelLabel>Status da tarefa</HeaderPanelLabel>

                <StatusPanel>
                  {tarefa?.status ? (
                    <StatusBadge status={tarefa.status} />
                  ) : (
                    <HeaderPanelValue>-</HeaderPanelValue>
                  )}
                </StatusPanel>

                <HeaderPanelGrid>
                  <HeaderPanelItem>
                    <span>Progresso</span>
                    <strong>{percentual}%</strong>
                  </HeaderPanelItem>

                  <HeaderPanelItem>
                    <span>Resultados</span>
                    <strong>{formatNumber(totalResultados)}</strong>
                  </HeaderPanelItem>

                  <HeaderPanelItem>
                    <span>Status</span>
                    <strong>{getStatusLabel(tarefa?.status)}</strong>
                  </HeaderPanelItem>
                </HeaderPanelGrid>
              </HeaderPanel>
            </HeaderGrid>
          </Header>

          {erro && <ErrorBox>{erro}</ErrorBox>}

          {isLoading && (
            <EmptyState>Carregando detalhes da busca...</EmptyState>
          )}

          {!isLoading && !erro && tarefa && (
            <>
              <IntelligenceGrid>
                <IntelligenceCard>
                  <IntelligenceLabel>Endereço pesquisado</IntelligenceLabel>
                  <IntelligenceValue>
                    {tarefa.endereco?.logradouro}, {tarefa.endereco?.numero}
                  </IntelligenceValue>
                </IntelligenceCard>

                <IntelligenceCard>
                  <IntelligenceLabel>Período</IntelligenceLabel>
                  <IntelligenceValue>
                    {tarefa.periodo?.mesAnoInicio} até{" "}
                    {tarefa.periodo?.mesAnoFinal}
                  </IntelligenceValue>
                </IntelligenceCard>

                <IntelligenceCard>
                  <IntelligenceLabel>Criado em</IntelligenceLabel>
                  <IntelligenceValue>{formatDate(tarefa.createdAt)}</IntelligenceValue>
                </IntelligenceCard>

                <IntelligenceCard>
                  <IntelligenceLabel>Concluído em</IntelligenceLabel>
                  <IntelligenceValue>
                    {formatDate(tarefa.completedAt)}
                  </IntelligenceValue>
                </IntelligenceCard>
              </IntelligenceGrid>

              <SectionCard>
                <SectionHeader>
                  <div>
                    <SectionTitle>Resumo operacional</SectionTitle>
                    <SectionSubtitle>
                      Acompanhe a execução da tarefa, o progresso atual e os
                      dados principais da busca.
                    </SectionSubtitle>
                  </div>
                </SectionHeader>

                <SummaryGrid>
                  <SummaryBox>
                    <SummaryLabel>Status</SummaryLabel>
                    <SummaryValue>{getStatusLabel(tarefa.status)}</SummaryValue>
                  </SummaryBox>

                  <SummaryBox>
                    <SummaryLabel>Processados</SummaryLabel>
                    <SummaryValue>
                      {tarefa.progress.current}/{tarefa.progress.total}
                    </SummaryValue>
                  </SummaryBox>

                  <SummaryBox>
                    <SummaryLabel>Percentual</SummaryLabel>
                    <SummaryValue>{tarefa.progress.percentage}%</SummaryValue>
                  </SummaryBox>

                  <SummaryBox>
                    <SummaryLabel>Resultados</SummaryLabel>
                    <SummaryValue>{totalResultados}</SummaryValue>
                  </SummaryBox>
                </SummaryGrid>

                <ProgressPanel>
                  <ProgressBar
                    status={tarefa.status}
                    total={tarefa.progress.total}
                    current={tarefa.progress.current}
                    percentage={tarefa.progress.percentage}
                  />
                </ProgressPanel>

                {tarefa.erro && <ErrorBox>{tarefa.erro}</ErrorBox>}
              </SectionCard>

              <ResultsSection>
                <ResultsHeader>
                  <div>
                    <ResultsTitle>Resultados da busca</ResultsTitle>

                    <ResultsCount>
                      {totalResultados} resultado(s) encontrado(s)
                    </ResultsCount>
                  </div>

                  <ExportActions>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isExporting}
                      onClick={handleExportarCsv}
                    >
                      CSV
                    </Button>

                    <Button
                      type="button"
                      variant="accent"
                      disabled={isExportingExcel}
                      onClick={handleExportarExcel}
                    >
                      Excel
                    </Button>
                  </ExportActions>
                </ResultsHeader>

                {totalResultados === 0 && (
                  <EmptyState>
                    Nenhum resultado salvo ainda. Se a tarefa estiver em
                    processamento, os resultados aparecerão aqui automaticamente.
                  </EmptyState>
                )}

                {totalResultados > 0 && (
                  <ResultsList>
                    {resultados.map(resultado => (
                      <ResultCard key={resultado.id} resultado={resultado} />
                    ))}
                  </ResultsList>
                )}
              </ResultsSection>
            </>
          )}
        </PageContainer>
      </PageShell>
    </>
  );
}
