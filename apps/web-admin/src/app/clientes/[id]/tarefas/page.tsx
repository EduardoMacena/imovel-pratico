"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../../../components/AppHeader";
import { StatusBadge } from "../../../../components/StatusBadge";
import { listarTarefasDoCliente } from "../../../../features/admin/api";
import type {
  ClienteStatus,
  TarefaClienteResumo,
} from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
import {
  Address,
  BackLink,
  EmptyState,
  ErrorBox,
  Header,
  HeaderTop,
  InfoBox,
  InfoGrid,
  InfoLabel,
  InfoValue,
  List,
  PageContainer,
  Subtitle,
  SummaryBox,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  TaskId,
  TaskItem,
  TaskTop,
  Title,
  TitleGroup,
} from "./page.styles";

type Cliente = {
  id: string;
  nome: string;
  slug: string;
  status: ClienteStatus;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TarefasClientePage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const params = useParams<{ id: string }>();

  const clienteId = params.id;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [tarefas, setTarefas] = useState<TarefaClienteResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const total = tarefas.length;

    const completed = tarefas.filter(
      tarefa => tarefa.status === "COMPLETED"
    ).length;

    const processing = tarefas.filter(
      tarefa => tarefa.status === "PROCESSING" || tarefa.status === "PENDING"
    ).length;

    const error = tarefas.filter(tarefa => tarefa.status === "ERROR").length;

    const resultados = tarefas.reduce(
      (acc, tarefa) => acc + tarefa.totalResultados,
      0
    );

    return {
      total,
      completed,
      processing,
      error,
      resultados,
    };
  }, [tarefas]);

  async function carregarTarefas() {
    try {
      setErro(null);

      const data = await listarTarefasDoCliente(clienteId);

      setCliente(data.cliente);
      setTarefas(data.tarefas);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar tarefas"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarTarefas();
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
          <HeaderTop>
            <TitleGroup>
              <Title>Tarefas do cliente</Title>

              <Subtitle>
                {cliente
                  ? `${cliente.nome} • ${cliente.slug}`
                  : "Visualize as buscas executadas por este cliente."}
              </Subtitle>
            </TitleGroup>

            {cliente?.status && <StatusBadge status={cliente.status} />}
          </HeaderTop>
        </Header>

        {erro && <ErrorBox>{erro}</ErrorBox>}

        {isLoading && <EmptyState>Carregando tarefas...</EmptyState>}

        {!isLoading && !erro && (
          <>
            <SummaryGrid>
              <SummaryBox>
                <SummaryLabel>Total de tarefas</SummaryLabel>
                <SummaryValue>{resumo.total}</SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Concluídas</SummaryLabel>
                <SummaryValue>{resumo.completed}</SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Em andamento</SummaryLabel>
                <SummaryValue>{resumo.processing}</SummaryValue>
              </SummaryBox>

              <SummaryBox>
                <SummaryLabel>Resultados</SummaryLabel>
                <SummaryValue>{resumo.resultados}</SummaryValue>
              </SummaryBox>
            </SummaryGrid>

            {tarefas.length === 0 && (
              <EmptyState>Nenhuma tarefa encontrada para este cliente.</EmptyState>
            )}

            {tarefas.length > 0 && (
              <List>
                {tarefas.map(tarefa => (
                  <TaskItem key={tarefa.id}>
                    <TaskTop>
                      <div>
                        <Address>
                          {tarefa.endereco.logradouro},{" "}
                          {tarefa.endereco.numero}
                        </Address>

                        <TaskId>{tarefa.id}</TaskId>
                      </div>

                      <StatusBadge status={tarefa.status} />
                    </TaskTop>

                    <InfoGrid>
                      <InfoBox>
                        <InfoLabel>Período</InfoLabel>
                        <InfoValue>
                          {tarefa.periodo.mesAnoInicio} até{" "}
                          {tarefa.periodo.mesAnoFinal}
                        </InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Progresso</InfoLabel>
                        <InfoValue>
                          {tarefa.progress.current}/{tarefa.progress.total} —{" "}
                          {tarefa.progress.percentage}%
                        </InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Resultados</InfoLabel>
                        <InfoValue>{tarefa.totalResultados}</InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Criado em</InfoLabel>
                        <InfoValue>{formatDate(tarefa.createdAt)}</InfoValue>
                      </InfoBox>
                    </InfoGrid>

                    {tarefa.erro && <ErrorBox>{tarefa.erro}</ErrorBox>}
                  </TaskItem>
                ))}
              </List>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}
