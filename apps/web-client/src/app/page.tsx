"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "../components/AppHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { buscarMinhaAssinatura, listarTarefas } from "../features/busca/api";
import type {
  MinhaAssinaturaResponse,
  TarefaResumo,
} from "../features/busca/types";
import { formatarReferenciaTarefa } from "../features/busca/apresentacao-tarefa";
import { getAuthUser } from "../lib/auth-storage";
import {
  ActionCard,
  ActionDescription,
  ActionGrid,
  ActionLink,
  ActionTitle,
  BarFill,
  BarInfo,
  BarLabel,
  BarRow,
  BarTrack,
  ChartCard,
  ChartList,
  DashboardGrid,
  EmptyState,
  ErrorBox,
  HeaderActions,
  HeroCard,
  HeroContent,
  HeroEyebrow,
  HeroGrid,
  HeroSubtitle,
  HeroTitle,
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
  PlanCard,
  PlanGrid,
  PlanLabel,
  PlanValue,
  PrimaryLink,
  RecentAddress,
  RecentContent,
  RecentDate,
  RecentItem,
  RecentList,
  SecondaryLink,
  SideColumn,
  StatusPill,
  UsageBar,
  UsageBarFill,
  UsageCard,
  UsageFooter,
  UsageMetric,
  UsageMetricGrid,
} from "./page.styles";

type PlanoInfo = {
  nome?: string;
  status?: string;
  intervaloSegundos?: number;
  limiteMensalConsultas?: number;
};

type UsoInfo = {
  consultasUsadas?: number;
  limiteMensal?: number;
  consultasRestantes?: number;
  percentualUsado?: number;
};

function getSaudacao() {
  const hora = new Date().getHours();

  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";

  return "Boa noite";
}

function formatNumber(value: number | undefined | null) {
  if (typeof value !== "number") return "-";

  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const { isCheckingAuth } = useRequireAuth();
  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState("sua equipe");
  const [assinatura, setAssinatura] = useState<MinhaAssinaturaResponse | null>(
    null,
  );
  const [tarefas, setTarefas] = useState<TarefaResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const plano = assinatura?.plano as PlanoInfo | undefined;
  const uso = assinatura?.uso as UsoInfo | undefined;

  const consultasUsadas = uso?.consultasUsadas ?? 0;
  const consultasRestantes = uso?.consultasRestantes ?? 0;
  const limiteMensal =
    uso?.limiteMensal ?? plano?.limiteMensalConsultas ?? consultasRestantes;
  const percentualUsado = uso?.percentualUsado ?? 0;

  const resumo = useMemo(() => {
    const finalizadas = tarefas.filter(
      (tarefa) => tarefa.status === "COMPLETED",
    ).length;

    const emAndamento = tarefas.filter(
      (tarefa) => tarefa.status === "PENDING" || tarefa.status === "PROCESSING",
    ).length;

    const comErro = tarefas.filter(
      (tarefa) => tarefa.status === "ERROR" || tarefa.status === "CANCELED",
    ).length;

    const resultados = tarefas.reduce((total, tarefa) => {
      return total + tarefa.totalResultados;
    }, 0);

    return {
      finalizadas,
      emAndamento,
      comErro,
      resultados,
    };
  }, [tarefas]);

  const distribuicao = [
    {
      label: "Finalizadas",
      value: resumo.finalizadas,
      status: "COMPLETED",
    },
    {
      label: "Em andamento",
      value: resumo.emAndamento,
      status: "PROCESSING",
    },
    {
      label: "Com erro/canceladas",
      value: resumo.comErro,
      status: "ERROR",
    },
  ];

  const maiorValorGrafico = Math.max(
    1,
    ...distribuicao.map((item) => item.value),
  );

  const tarefasRecentes = tarefas.slice(0, 5);

  const operacaoAtiva =
    Boolean(assinatura) &&
    assinatura?.cliente.status === "ATIVO" &&
    assinatura?.cliente.pagamentoStatus === "PAGO" &&
    assinatura?.plano.status === "ATIVO";

  const estaEmExcedente =
    operacaoAtiva && consultasRestantes <= 0 && consultasUsadas >= limiteMensal;

  const statusOperacao = !operacaoAtiva
    ? "Bloqueado"
    : estaEmExcedente
      ? "Excedente ativo"
      : "Ativo";

  async function carregarDashboard() {
    try {
      setErro(null);

      const [assinaturaData, tarefasData] = await Promise.all([
        buscarMinhaAssinatura(),
        listarTarefas(),
      ]);

      setAssinatura(assinaturaData);
      setTarefas(tarefasData.tarefas);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar dashboard",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      const user = getAuthUser();

      setNomeUsuario(user?.nome ?? "sua equipe");
      carregarDashboard();
    }
  }, [isCheckingAuth]);

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
                <HeroEyebrow>
                  {operacaoAtiva ? "Operação ativa" : "Atenção operacional"}
                </HeroEyebrow>

                <HeroTitle>
                  {getSaudacao()}, {nomeUsuario}.
                </HeroTitle>

                <HeroSubtitle>
                  Acompanhe consumo, tarefas, resultados e status da sua
                  operação de captação em uma visão executiva simples e
                  objetiva.
                </HeroSubtitle>

                <HeaderActions>
                  <Link href="/nova-busca" passHref legacyBehavior>
                    <PrimaryLink>Iniciar nova busca</PrimaryLink>
                  </Link>

                  <Link href="/historico" passHref legacyBehavior>
                    <SecondaryLink>Ver histórico</SecondaryLink>
                  </Link>
                </HeaderActions>
              </HeroContent>
            </HeroCard>

            <UsageCard>
              <PanelHeader>
                <div>
                  <PanelTitle>{plano?.nome ?? "Plano"}</PanelTitle>
                  <PanelSubtitle>Resumo do consumo mensal</PanelSubtitle>
                </div>

                <StatusPill $active={operacaoAtiva}>
                  {statusOperacao}
                </StatusPill>
              </PanelHeader>

              <UsageMetricGrid>
                <UsageMetric>
                  <span>Inclusas restantes</span>
                  <strong>{formatNumber(consultasRestantes)}</strong>
                </UsageMetric>

                <UsageMetric>
                  <span>Usadas</span>
                  <strong>{formatNumber(consultasUsadas)}</strong>
                </UsageMetric>

                <UsageMetric>
                  <span>Uso</span>
                  <strong>{Math.round(percentualUsado)}%</strong>
                </UsageMetric>
              </UsageMetricGrid>

              <UsageBar>
                <UsageBarFill $percentage={Math.min(percentualUsado, 100)} />
              </UsageBar>

              <UsageFooter>
                {formatNumber(consultasUsadas)} de {formatNumber(limiteMensal)}{" "}
                consultas inclusas · intervalo{" "}
                {plano?.intervaloSegundos ? `${plano.intervaloSegundos}s` : "-"}
              </UsageFooter>
            </UsageCard>
          </HeroGrid>

          <MetricGrid>
            <MetricCard>
              <MetricLabel>Buscas totais</MetricLabel>
              <MetricValue>{formatNumber(tarefas.length)}</MetricValue>
              <MetricHint>Histórico operacional da conta</MetricHint>
            </MetricCard>

            <MetricCard>
              <MetricLabel>Finalizadas</MetricLabel>
              <MetricValue>{formatNumber(resumo.finalizadas)}</MetricValue>
              <MetricHint>
                Tarefas concluídas com processamento finalizado
              </MetricHint>
            </MetricCard>

            <MetricCard>
              <MetricLabel>Em andamento</MetricLabel>
              <MetricValue>{formatNumber(resumo.emAndamento)}</MetricValue>
              <MetricHint>Fila pendente ou processando agora</MetricHint>
            </MetricCard>

            <MetricCard>
              <MetricLabel>Resultados</MetricLabel>
              <MetricValue>{formatNumber(resumo.resultados)}</MetricValue>
              <MetricHint>Registros encontrados nas buscas</MetricHint>
            </MetricCard>
          </MetricGrid>

          {erro && <ErrorBox>{erro}</ErrorBox>}

          {isLoading && (
            <EmptyState>Carregando visão executiva da sua operação.</EmptyState>
          )}

          {!isLoading && (
            <DashboardGrid>
              <ChartCard>
                <PanelHeader>
                  <div>
                    <PanelTitle>Performance operacional</PanelTitle>
                    <PanelSubtitle>
                      Distribuição das buscas por status no histórico.
                    </PanelSubtitle>
                  </div>
                </PanelHeader>

                <ChartList>
                  {distribuicao.map((item) => (
                    <BarRow key={item.label}>
                      <BarInfo>
                        <BarLabel>{item.label}</BarLabel>
                        <strong>{item.value}</strong>
                      </BarInfo>

                      <BarTrack>
                        <BarFill
                          $percentage={(item.value / maiorValorGrafico) * 100}
                        />
                      </BarTrack>
                    </BarRow>
                  ))}
                </ChartList>
              </ChartCard>

              <PanelCard>
                <PanelHeader>
                  <div>
                    <PanelTitle>Últimas atividades</PanelTitle>
                    <PanelSubtitle>
                      Buscas recentes executadas pela sua equipe.
                    </PanelSubtitle>
                  </div>
                </PanelHeader>

                {tarefasRecentes.length === 0 && (
                  <EmptyState>
                    Nenhuma busca registrada ainda. Inicie uma nova busca para
                    visualizar as atividades aqui.
                  </EmptyState>
                )}

                {tarefasRecentes.length > 0 && (
                  <RecentList>
                    {tarefasRecentes.map((tarefa) => (
                      <RecentItem key={tarefa.id}>
                        <RecentContent>
                          <RecentAddress>
                            {formatarReferenciaTarefa(tarefa)}
                          </RecentAddress>

                          <RecentDate>
                            {formatDate(tarefa.createdAt)} ·{" "}
                            {tarefa.totalResultados} resultado(s)
                          </RecentDate>
                        </RecentContent>

                        <StatusBadge status={tarefa.status} />
                      </RecentItem>
                    ))}
                  </RecentList>
                )}
              </PanelCard>

              <SideColumn>
                <PlanCard>
                  <PanelHeader>
                    <div>
                      <PanelTitle>Plano e acesso</PanelTitle>
                      <PanelSubtitle>Condição atual da operação.</PanelSubtitle>
                    </div>
                  </PanelHeader>

                  <PlanGrid>
                    <div>
                      <PlanLabel>Plano</PlanLabel>
                      <PlanValue>{plano?.nome ?? "-"}</PlanValue>
                    </div>

                    <div>
                      <PlanLabel>Status financeiro</PlanLabel>
                      <PlanValue>
                        {assinatura?.cliente.pagamentoStatus ?? "-"}
                      </PlanValue>
                    </div>

                    <div>
                      <PlanLabel>Status da conta</PlanLabel>
                      <PlanValue>{assinatura?.cliente.status ?? "-"}</PlanValue>
                    </div>

                    <div>
                      <PlanLabel>Intervalo</PlanLabel>
                      <PlanValue>
                        {plano?.intervaloSegundos
                          ? `${plano.intervaloSegundos}s`
                          : "-"}
                      </PlanValue>
                    </div>
                  </PlanGrid>
                </PlanCard>

                <ActionCard>
                  <ActionTitle>Atalhos operacionais</ActionTitle>
                  <ActionDescription>
                    Acesse rapidamente as principais ações da plataforma.
                  </ActionDescription>

                  <ActionGrid>
                    <Link href="/nova-busca" passHref legacyBehavior>
                      <ActionLink>Nova busca</ActionLink>
                    </Link>

                    <Link href="/historico" passHref legacyBehavior>
                      <ActionLink>Histórico</ActionLink>
                    </Link>

                    <Link href="/trocar-senha" passHref legacyBehavior>
                      <ActionLink>Perfil e senha</ActionLink>
                    </Link>
                  </ActionGrid>
                </ActionCard>
              </SideColumn>
            </DashboardGrid>
          )}
        </PageContainer>
      </PageShell>
    </>
  );
}
