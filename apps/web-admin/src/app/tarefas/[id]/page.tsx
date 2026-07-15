"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../../components/AppHeader";
import { OwnerDetails } from "../../../components/OwnerDetails";
import { StatusBadge } from "../../../components/StatusBadge";
import {
  buscarTarefaAdmin,
  cancelarTarefaAdmin,
  exportarResultadosTarefaAdmin,
  exportarResultadosTarefaAdminExcel,
  exportarResultadosTarefaAdminPdf,
  reprocessarTarefaAdmin,
} from "../../../features/admin/api";
import type { BuscarTarefaAdminResponse } from "../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../hooks/useRequireSuperAdmin";
import {
  ActionButton,
  Actions,
  BackLink,
  ContactGrid,
  DangerButton,
  DetailItem,
  DetailLabel,
  DetailValue,
  EmptyState,
  ErrorBox,
  ErrorText,
  Header,
  HeaderContent,
  HeaderEyebrow,
  HeaderGrid,
  HeaderPanel,
  HeaderPanelFooter,
  HeaderPanelItem,
  HeaderPanelLabel,
  HeaderPanelValue,
  PageContainer,
  ProgressFill,
  ProgressTrack,
  ResultEyebrow,
  ResultItem,
  ResultList,
  ResultMeta,
  ResultMetaItem,
  ResultTitle,
  ResultTitleGroup,
  ResultTop,
  Section,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  StatusPanel,
  Subtitle,
  SuccessBox,
  SummaryBox,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  TaskId,
  Title,
} from "./page.styles";

type Tarefa = BuscarTarefaAdminResponse["tarefa"];

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

function isFinalStatus(status?: string) {
  return status === "COMPLETED" || status === "ERROR" || status === "CANCELED";
}

function getStatusLabel(status?: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PROCESSING: "Processando",
    COMPLETED: "Concluída",
    ERROR: "Erro",
    CANCELED: "Cancelada",
    SUCCESS: "Sucesso",
  };

  if (!status) {
    return "-";
  }

  return labels[status] ?? status;
}

export default function DetalheTarefaPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const tarefaId = params.id;

  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const podeCancelar = useMemo(() => {
    return tarefa?.status === "PENDING" || tarefa?.status === "PROCESSING";
  }, [tarefa?.status]);

  const podeReprocessar = useMemo(() => {
    return isFinalStatus(tarefa?.status);
  }, [tarefa?.status]);

  const resultadosEncontrados = tarefa?.resultados.length ?? 0;
  const percentual = tarefa?.progress.percentage ?? 0;

  async function handleExportarExcel() {
    setIsExportingExcel(true);
    setErro(null);
    setSucesso(null);

    try {
      await exportarResultadosTarefaAdminExcel(tarefaId);

      setSucesso("Excel exportado com sucesso.");
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
    setIsExportingPdf(true);
    setErro(null);
    setSucesso(null);

    try {
      await exportarResultadosTarefaAdminPdf(tarefaId);

      setSucesso("PDF exportado com sucesso.");
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

  async function handleExportarCsv() {
    setIsExporting(true);
    setErro(null);
    setSucesso(null);

    try {
      await exportarResultadosTarefaAdmin(tarefaId);

      setSucesso("CSV exportado com sucesso.");
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

  async function carregarTarefa() {
    try {
      setErro(null);

      const data = await buscarTarefaAdmin(tarefaId);

      setTarefa(data.tarefa);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar tarefa"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelar() {
    const confirmado = window.confirm(
      "Tem certeza que deseja cancelar esta tarefa?"
    );

    if (!confirmado) {
      return;
    }

    setIsActionLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      const data = await cancelarTarefaAdmin(tarefaId);

      setSucesso(data.message ?? "Tarefa cancelada com sucesso.");

      await carregarTarefa();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao cancelar tarefa"
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleReprocessar() {
    const confirmado = window.confirm(
      "Tem certeza que deseja reprocessar esta tarefa? Os resultados atuais serão apagados."
    );

    if (!confirmado) {
      return;
    }

    setIsActionLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      const data = await reprocessarTarefaAdmin(tarefaId);

      setSucesso(data.message ?? "Tarefa enviada para reprocessamento.");

      await carregarTarefa();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao reprocessar tarefa"
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarTarefa();
    }
  }, [isCheckingAuth]);

  useEffect(() => {
    if (!tarefa || isFinalStatus(tarefa.status)) {
      return;
    }

    const intervalId = window.setInterval(() => {
      carregarTarefa();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [tarefa?.status]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <>
      <AppHeader />

      <PageContainer>
        <BackLink href="/clientes">← Voltar para clientes</BackLink>

        {isLoading && <EmptyState>Carregando tarefa...</EmptyState>}

        {erro && <ErrorBox>{erro}</ErrorBox>}
        {sucesso && <SuccessBox>{sucesso}</SuccessBox>}

        {!isLoading && tarefa && (
          <>
            <Header>
              <HeaderGrid>
                <HeaderContent>
                  <HeaderEyebrow>Monitoramento da tarefa</HeaderEyebrow>

                  <Title>Detalhe da tarefa</Title>

                  <Subtitle>
                    {tarefa.cliente.nome} · {tarefa.endereco.logradouro},{" "}
                    {tarefa.endereco.numero}
                  </Subtitle>

                  <TaskId>Tarefa: {tarefa.id}</TaskId>

                  <Actions>
                    <ActionButton
                      type="button"
                      onClick={() =>
                        router.push(`/clientes/${tarefa.cliente.id}/tarefas`)
                      }
                    >
                      Tarefas do cliente
                    </ActionButton>

                    <ActionButton
                      type="button"
                      disabled={isExporting}
                      onClick={handleExportarCsv}
                    >
                      {isExporting ? "Exportando..." : "Exportar CSV"}
                    </ActionButton>

                    <ActionButton
                      type="button"
                      disabled={isExportingExcel}
                      onClick={handleExportarExcel}
                    >
                      {isExportingExcel ? "Exportando..." : "Exportar Excel"}
                    </ActionButton>

                    <ActionButton
                      type="button"
                      disabled={isExportingPdf}
                      onClick={handleExportarPdf}
                    >
                      {isExportingPdf ? "Exportando..." : "Exportar PDF"}
                    </ActionButton>

                    {podeCancelar && (
                      <DangerButton
                        type="button"
                        disabled={isActionLoading}
                        onClick={handleCancelar}
                      >
                        {isActionLoading ? "Aguarde..." : "Cancelar"}
                      </DangerButton>
                    )}

                    {podeReprocessar && (
                      <ActionButton
                        type="button"
                        disabled={isActionLoading}
                        onClick={handleReprocessar}
                      >
                        {isActionLoading ? "Aguarde..." : "Reprocessar"}
                      </ActionButton>
                    )}
                  </Actions>
                </HeaderContent>

                <HeaderPanel>
                  <StatusPanel>
                    <HeaderPanelLabel>Status atual</HeaderPanelLabel>
                    <StatusBadge status={tarefa.status} />
                  </StatusPanel>

                  <HeaderPanelItem>
                    <HeaderPanelLabel>Progresso</HeaderPanelLabel>
                    <HeaderPanelValue>
                      {tarefa.progress.current}/{tarefa.progress.total} ·{" "}
                      {tarefa.progress.percentage}%
                    </HeaderPanelValue>

                    <ProgressTrack>
                      <ProgressFill $percentage={percentual} />
                    </ProgressTrack>
                  </HeaderPanelItem>

                  <HeaderPanelItem>
                    <HeaderPanelLabel>Resultados encontrados</HeaderPanelLabel>
                    <HeaderPanelValue>
                      {formatNumber(resultadosEncontrados)}
                    </HeaderPanelValue>
                  </HeaderPanelItem>

                  <HeaderPanelFooter>
                    {getStatusLabel(tarefa.status)} · criada em{" "}
                    {formatDate(tarefa.createdAt)}
                  </HeaderPanelFooter>
                </HeaderPanel>
              </HeaderGrid>
            </Header>

            <SummaryGrid>
              <SummaryBox>
                <SummaryLabel>Status</SummaryLabel>
                <SummaryValue>{getStatusLabel(tarefa.status)}</SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Progresso</SummaryLabel>
                <SummaryValue>
                  {tarefa.progress.current}/{tarefa.progress.total} ·{" "}
                  {tarefa.progress.percentage}%
                </SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Resultados</SummaryLabel>
                <SummaryValue>
                  {formatNumber(tarefa.resultados.length)}
                </SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Intervalo</SummaryLabel>
                <SummaryValue>
                  {tarefa.configuracao.intervaloSegundos}s
                </SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Período</SummaryLabel>
                <SummaryValue>
                  {tarefa.periodo.mesAnoInicio} até {tarefa.periodo.mesAnoFinal}
                </SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Criada em</SummaryLabel>
                <SummaryValue>{formatDate(tarefa.createdAt)}</SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Iniciada em</SummaryLabel>
                <SummaryValue>{formatDate(tarefa.startedAt)}</SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Finalizada em</SummaryLabel>
                <SummaryValue>{formatDate(tarefa.completedAt)}</SummaryValue>
              </SummaryBox>
            </SummaryGrid>

            {tarefa.erro && <ErrorBox>{tarefa.erro}</ErrorBox>}

            <Section>
              <SectionHeader>
                <div>
                  <SectionTitle>Resultados da tarefa</SectionTitle>
                  <SectionSubtitle>
                    Visualização alinhada ao web-client: dados principais em
                    evidência e informações completas recolhidas por grupo.
                  </SectionSubtitle>
                </div>

                <StatusBadge status={tarefa.status} />
              </SectionHeader>

              {tarefa.resultados.length === 0 && (
                <EmptyState>Nenhum resultado encontrado ainda.</EmptyState>
              )}

              {tarefa.resultados.length > 0 && (
                <ResultList>
                  {tarefa.resultados.map(resultado => (
                    <ResultItem key={resultado.id}>
                      <ResultTop>
                        <ResultTitleGroup>
                          <ResultEyebrow>Resultado captado</ResultEyebrow>

                          <ResultTitle>
                            {resultado.logradouro}, {resultado.numero}
                            {resultado.complemento
                              ? ` · ${resultado.complemento}`
                              : ""}
                          </ResultTitle>
                        </ResultTitleGroup>

                        <StatusBadge status={resultado.status} />
                      </ResultTop>

                      <ResultMeta>
                        <ResultMetaItem>
                          <strong>Índice cadastral</strong>
                          <span>{resultado.indiceCadastral}</span>
                        </ResultMetaItem>

                        {resultado.fonteContato && (
                          <ResultMetaItem>
                            <strong>Fonte do contato</strong>
                            <span>{resultado.fonteContato}</span>
                          </ResultMetaItem>
                        )}

                        <ResultMetaItem>
                          <strong>Capturado em</strong>
                          <span>{formatDate(resultado.createdAt)}</span>
                        </ResultMetaItem>
                      </ResultMeta>

                      <ContactGrid>
                        <DetailItem $highlight>
                          <DetailLabel>Proprietário</DetailLabel>
                          <DetailValue>
                            {resultado.proprietario.nome ?? "-"}
                          </DetailValue>
                        </DetailItem>

                        <DetailItem>
                          <DetailLabel>CPF</DetailLabel>
                          <DetailValue>
                            {resultado.proprietario.cpf ?? "-"}
                          </DetailValue>
                        </DetailItem>

                        <DetailItem>
                          <DetailLabel>Telefone</DetailLabel>
                          <DetailValue>
                            {resultado.proprietario.telefone ?? "-"}
                          </DetailValue>
                        </DetailItem>

                        <DetailItem>
                          <DetailLabel>E-mail</DetailLabel>
                          <DetailValue>
                            {resultado.proprietario.email ?? "-"}
                          </DetailValue>
                        </DetailItem>

                        <DetailItem $wide>
                          <DetailLabel>Endereço do proprietário</DetailLabel>
                          <DetailValue>
                            {resultado.proprietario.endereco ?? "-"}
                          </DetailValue>
                        </DetailItem>
                      </ContactGrid>

                      <OwnerDetails
                        fonteContato={resultado.fonteContato}
                        dadosContato={resultado.dadosContato}
                      />

                      {resultado.erro && (
                        <ErrorText>Erro no resultado: {resultado.erro}</ErrorText>
                      )}
                    </ResultItem>
                  ))}
                </ResultList>
              )}
            </Section>
          </>
        )}
      </PageContainer>
    </>
  );
}
