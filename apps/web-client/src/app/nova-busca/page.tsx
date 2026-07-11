"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { ProgressBar } from "../../components/ProgressBar";
import { ResultCard } from "../../components/ResultCard";
import { StatusBadge } from "../../components/StatusBadge";
import { SubscriptionSummary } from "../../components/SubscriptionSummary";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import {
  buscarMinhaAssinatura,
  buscarProgressoTarefa,
  criarTarefaBusca,
} from "../../features/busca/api";
import type {
  MinhaAssinaturaResponse,
  ProgressoTarefaResponse,
} from "../../features/busca/types";
import {
  Actions,
  EmptyState,
  ErrorBox,
  FormGrid,
  HeaderActions,
  HeaderLink,
  HeroCard,
  HeroContent,
  HeroEyebrow,
  HeroGrid,
  HeroPanel,
  HeroPanelGrid,
  HeroPanelItem,
  HeroPanelLabel,
  HeroPanelValue,
  HeroSubtitle,
  HeroTitle,
  InlineHint,
  MainGrid,
  OperationCard,
  OperationCardBody,
  OperationCardHeader,
  OperationDescription,
  OperationEyebrow,
  OperationForm,
  OperationTitle,
  PageContainer,
  PageShell,
  ProgressWrapper,
  ResultsCount,
  ResultsHeader,
  ResultsList,
  ResultsSection,
  ResultsTitle,
  Sidebar,
  SidebarCard,
  SidebarDescription,
  SidebarList,
  SidebarListItem,
  SidebarTitle,
  TaskId,
} from "./page.styles";

export default function NovaBuscaPage() {
  const { isCheckingAuth } = useRequireAuth();

  const [logradouro, setLogradouro] = useState(
    "RUA DESEMBARGADOR JORGE FONTANA"
  );
  const [numero, setNumero] = useState("200");

  const [assinatura, setAssinatura] = useState<MinhaAssinaturaResponse | null>(
    null
  );

  const [jobId, setJobId] = useState<string | null>(null);
  const [progresso, setProgresso] = useState<ProgressoTarefaResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const isFinalizado = useMemo(() => {
    return (
      progresso?.status === "COMPLETED" ||
      progresso?.status === "ERROR" ||
      progresso?.status === "CANCELED"
    );
  }, [progresso?.status]);

  const buscaBloqueada =
    !assinatura ||
    assinatura.cliente.pagamentoStatus !== "PAGO" ||
    assinatura.cliente.status !== "ATIVO" ||
    assinatura.plano.status !== "ATIVO" ||
    assinatura.uso.consultasRestantes === 0;

  async function carregarAssinatura() {
    try {
      const data = await buscarMinhaAssinatura();

      setAssinatura(data);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar assinatura"
      );
    }
  }

  async function criarTarefa(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setProgresso(null);
    setJobId(null);
    setIsLoading(true);

    try {
      const data = await criarTarefaBusca({
        logradouro,
        numero,
      });

      setJobId(data.jobId);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao criar tarefa"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarAssinatura();
    }
  }, [isCheckingAuth]);

  useEffect(() => {
    if (isCheckingAuth || !jobId || isFinalizado) {
      return;
    }

    let isMounted = true;

    async function carregarProgresso() {
      if (!jobId) {
        return;
      }

      try {
        const data = await buscarProgressoTarefa(jobId);

        if (isMounted) {
          setProgresso(data);
        }
      } catch (error) {
        if (isMounted) {
          setErro(
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao buscar progresso"
          );
        }
      }
    }

    carregarProgresso();

    const interval = window.setInterval(carregarProgresso, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [jobId, isFinalizado, isCheckingAuth]);

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
                <HeroEyebrow>Nova busca inteligente</HeroEyebrow>

                <HeroTitle>Localize proprietários com um fluxo simples e controlado.</HeroTitle>

                <HeroSubtitle>
                  Informe o endereço, acompanhe o processamento em tempo real e
                  visualize os resultados da captação assim que a tarefa avançar.
                </HeroSubtitle>

                <HeaderActions>
                  <Link href="/" passHref legacyBehavior>
                    <HeaderLink>Voltar ao dashboard</HeaderLink>
                  </Link>

                  <Link href="/historico" passHref legacyBehavior>
                    <HeaderLink>Ver histórico</HeaderLink>
                  </Link>
                </HeaderActions>
              </HeroContent>
            </HeroCard>

            <HeroPanel>
              <HeroPanelGrid>
                <HeroPanelItem>
                  <HeroPanelLabel>Plano</HeroPanelLabel>
                  <HeroPanelValue>{assinatura?.plano.nome ?? "-"}</HeroPanelValue>
                </HeroPanelItem>

                <HeroPanelItem>
                  <HeroPanelLabel>Consultas restantes</HeroPanelLabel>
                  <HeroPanelValue>
                    {assinatura?.uso.consultasRestantes ?? "-"}
                  </HeroPanelValue>
                </HeroPanelItem>

                <HeroPanelItem>
                  <HeroPanelLabel>Status financeiro</HeroPanelLabel>
                  <HeroPanelValue>
                    {assinatura?.cliente.pagamentoStatus ?? "-"}
                  </HeroPanelValue>
                </HeroPanelItem>
              </HeroPanelGrid>
            </HeroPanel>
          </HeroGrid>

          <MainGrid>
            <div>
              <OperationCard>
                <OperationCardHeader>
                  <div>
                    <OperationEyebrow>Execução operacional</OperationEyebrow>
                    <OperationTitle>Dados do imóvel</OperationTitle>
                    <OperationDescription>
                      Use endereço completo e número correto para aumentar a
                      precisão da busca.
                    </OperationDescription>
                  </div>

                  {progresso?.status && <StatusBadge status={progresso.status} />}
                </OperationCardHeader>

                <OperationCardBody>
                  {buscaBloqueada && assinatura && (
                    <ErrorBox>
                      {assinatura.cliente.pagamentoStatus !== "PAGO"
                        ? "Seu plano está pendente ou vencido. Regularize o pagamento para iniciar novas buscas."
                        : "Você atingiu o limite mensal de consultas do seu plano."}
                    </ErrorBox>
                  )}

                  {!assinatura && (
                    <EmptyState>
                      Carregando dados da assinatura antes de liberar novas
                      buscas.
                    </EmptyState>
                  )}

                  <OperationForm onSubmit={criarTarefa}>
                    <FormGrid>
                      <Input
                        label="Logradouro"
                        value={logradouro}
                        onChange={event => setLogradouro(event.target.value)}
                        placeholder="Ex: Rua Desembargador Jorge Fontana"
                        required
                      />

                      <Input
                        label="Número"
                        value={numero}
                        onChange={event => setNumero(event.target.value)}
                        placeholder="Ex: 200"
                        required
                      />
                    </FormGrid>

                    <Actions>
                      <Button type="submit" disabled={isLoading || buscaBloqueada}>
                        {isLoading ? "Criando tarefa..." : "Iniciar busca"}
                      </Button>

                      <InlineHint>
                        A busca respeita o limite mensal e o intervalo
                        operacional do seu plano.
                      </InlineHint>
                    </Actions>
                  </OperationForm>

                  {jobId && <TaskId>Tarefa ativa: {jobId}</TaskId>}

                  {erro && <ErrorBox>{erro}</ErrorBox>}

                  {progresso && (
                    <ProgressWrapper>
                      <ProgressBar
                        status={progresso.status}
                        total={progresso.progress.total}
                        current={progresso.progress.current}
                        percentage={progresso.progress.percentage}
                      />
                    </ProgressWrapper>
                  )}

                  {jobId && !progresso && !erro && (
                    <EmptyState>
                      Carregando progresso da tarefa. Assim que o processamento
                      iniciar, os resultados aparecerão aqui.
                    </EmptyState>
                  )}
                </OperationCardBody>
              </OperationCard>

              {progresso?.resultados && progresso.resultados.length > 0 && (
                <ResultsSection>
                  <ResultsHeader>
                    <div>
                      <ResultsTitle>Resultados encontrados</ResultsTitle>
                      <ResultsCount>
                        {progresso.resultados.length} resultado(s) localizado(s)
                      </ResultsCount>
                    </div>
                  </ResultsHeader>

                  <ResultsList>
                    {progresso.resultados.map(resultado => (
                      <ResultCard key={resultado.id} resultado={resultado} />
                    ))}
                  </ResultsList>
                </ResultsSection>
              )}
            </div>

            <Sidebar>
              {assinatura && <SubscriptionSummary assinatura={assinatura} />}

              <SidebarCard>
                <SidebarTitle>Boas práticas</SidebarTitle>

                <SidebarDescription>
                  Pequenos cuidados antes de iniciar a tarefa ajudam a reduzir
                  tentativas inválidas.
                </SidebarDescription>

                <SidebarList>
                  <SidebarListItem>
                    Evite abreviações excessivas no logradouro.
                  </SidebarListItem>

                  <SidebarListItem>
                    Confirme o número antes de iniciar a busca.
                  </SidebarListItem>

                  <SidebarListItem>
                    Consulte o histórico antes de repetir uma busca.
                  </SidebarListItem>
                </SidebarList>
              </SidebarCard>
            </Sidebar>
          </MainGrid>
        </PageContainer>
      </PageShell>
    </>
  );
}
