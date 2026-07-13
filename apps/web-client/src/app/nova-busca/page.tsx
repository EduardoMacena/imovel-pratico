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
  preverBusca,
} from "../../features/busca/api";
import type {
  MinhaAssinaturaResponse,
  PreverBuscaResponse,
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
  ModalActions,
  ModalCancelButton,
  ModalCard,
  ModalConfirmButton,
  ModalEyebrow,
  ModalGrid,
  ModalInfo,
  ModalOverlay,
  ModalText,
  ModalTitle,
  OperationCard,
  OperationCardBody,
  OperationCardHeader,
  OperationDescription,
  OperationEyebrow,
  OperationForm,
  OperationTitle,
  PageContainer,
  PageShell,
  PreviewBadge,
  PreviewCard,
  PreviewGrid,
  PreviewHeader,
  PreviewInfo,
  PreviewList,
  PreviewListItem,
  PreviewSubtitle,
  PreviewTitle,
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

function formatCurrencyFromCents(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

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

  const [previaBusca, setPreviaBusca] = useState<PreverBuscaResponse | null>(
    null
  );
  const [avisoExcedente, setAvisoExcedente] =
    useState<PreverBuscaResponse | null>(null);

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
    assinatura.plano.status !== "ATIVO";

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

  async function criarTarefaComPrevia(
    previaId: string,
    confirmarExcedente: boolean
  ) {
    const data = await criarTarefaBusca({
      previaId,
      confirmarExcedente,
    });

    if (data.precisaConfirmarExcedente && data.previa && data.excedente) {
      setAvisoExcedente({
        previa: data.previa,
        precisaConfirmarExcedente: true,
        excedente: data.excedente,
        uso: data.uso,
      });

      return;
    }

    setAvisoExcedente(null);

    if (!data.jobId) {
      throw new Error("Tarefa criada, mas o ID do job não foi retornado");
    }

    setJobId(data.jobId);

    await carregarAssinatura();
  }

  async function iniciarFluxoBusca(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setProgresso(null);
    setJobId(null);
    setPreviaBusca(null);
    setAvisoExcedente(null);
    setIsLoading(true);

    try {
      const previa = await preverBusca({
        logradouro,
        numero,
      });

      setPreviaBusca(previa);

      if (previa.previa.quantidadeRegistros <= 0) {
        setErro("Nenhum registro foi encontrado para este endereço.");
        return;
      }

      if (previa.precisaConfirmarExcedente) {
        setAvisoExcedente(previa);
        return;
      }

      await criarTarefaComPrevia(previa.previa.id, false);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao iniciar busca"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmarBuscaComExcedente() {
    if (!avisoExcedente?.previa.id) {
      return;
    }

    setErro(null);
    setIsLoading(true);

    try {
      await criarTarefaComPrevia(avisoExcedente.previa.id, true);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao confirmar excedente"
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

      {avisoExcedente?.excedente && (
        <ModalOverlay>
          <ModalCard>
            <ModalEyebrow>Atenção: excedente</ModalEyebrow>

            <ModalTitle>Esta busca pode gerar cobrança adicional</ModalTitle>

            <ModalText>
              O 1RIBH encontrou {avisoExcedente.previa.quantidadeRegistros}{" "}
              registro(s) para este endereço. Seu plano ainda possui{" "}
              {
                avisoExcedente.excedente.consultasDisponiveisNoMomento
              }{" "}
              consulta(s) inclusas disponíveis neste mês.
            </ModalText>

            <ModalGrid>
              <ModalInfo>
                <strong>Registros encontrados</strong>
                <span>
                  {formatNumber(avisoExcedente.previa.quantidadeRegistros)}
                </span>
              </ModalInfo>

              <ModalInfo>
                <strong>Consultas disponíveis</strong>
                <span>
                  {formatNumber(
                    avisoExcedente.excedente.consultasDisponiveisNoMomento
                  )}
                </span>
              </ModalInfo>

              <ModalInfo>
                <strong>Consultas excedentes</strong>
                <span>
                  {formatNumber(
                    avisoExcedente.excedente.consultasExcedentesEstimadas
                  )}
                </span>
              </ModalInfo>

              <ModalInfo>
                <strong>Valor adicional estimado</strong>
                <span>
                  {formatCurrencyFromCents(
                    avisoExcedente.excedente
                      .valorExcedenteEstimadoCentavos
                  )}
                </span>
              </ModalInfo>
            </ModalGrid>

            <ModalText>
              Ao continuar, você confirma que está ciente da cobrança adicional
              conforme o plano contratado.
            </ModalText>

            <ModalActions>
              <ModalCancelButton
                type="button"
                onClick={() => setAvisoExcedente(null)}
              >
                Cancelar busca
              </ModalCancelButton>

              <ModalConfirmButton
                type="button"
                disabled={isLoading}
                onClick={confirmarBuscaComExcedente}
              >
                {isLoading
                  ? "Confirmando..."
                  : "Continuar e autorizar excedente"}
              </ModalConfirmButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      <PageShell>
        <PageContainer>
          <HeroGrid>
            <HeroCard>
              <HeroContent>
                <HeroEyebrow>Nova busca inteligente</HeroEyebrow>

                <HeroTitle>
                  Consulte a prévia antes de iniciar o processamento.
                </HeroTitle>

                <HeroSubtitle>
                  O sistema consulta o 1RIBH primeiro, mostra a quantidade real
                  de registros encontrados e só depois cria a tarefa de CPF e
                  contato.
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
                  <HeroPanelLabel>Consulta adicional</HeroPanelLabel>
                  <HeroPanelValue>
                    {assinatura
                      ? formatCurrencyFromCents(
                          assinatura.plano.valorConsultaAdicionalCentavos
                        )
                      : "-"}
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
                    <OperationEyebrow>Prévia operacional</OperationEyebrow>
                    <OperationTitle>Dados do imóvel</OperationTitle>
                    <OperationDescription>
                      Primeiro vamos consultar os registros do endereço no
                      1RIBH. Depois você confirma o processamento.
                    </OperationDescription>
                  </div>

                  {progresso?.status && <StatusBadge status={progresso.status} />}
                </OperationCardHeader>

                <OperationCardBody>
                  {buscaBloqueada && assinatura && (
                    <ErrorBox>
                      Seu plano está pendente, vencido, inativo ou
                      indisponível. Regularize a situação para iniciar novas
                      buscas.
                    </ErrorBox>
                  )}

                  {!assinatura && (
                    <EmptyState>
                      Carregando dados da assinatura antes de liberar novas
                      buscas.
                    </EmptyState>
                  )}

                  <OperationForm onSubmit={iniciarFluxoBusca}>
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
                        {isLoading
                          ? "Consultando prévia..."
                          : "Consultar prévia da busca"}
                      </Button>

                      <InlineHint>
                        A busca só será criada depois da prévia do 1RIBH e, se
                        necessário, da autorização de excedente.
                      </InlineHint>
                    </Actions>
                  </OperationForm>

                  {previaBusca && (
                    <PreviewCard>
                      <PreviewHeader>
                        <div>
                          <PreviewTitle>Prévia encontrada</PreviewTitle>
                          <PreviewSubtitle>
                            Esta é a lista retornada pelo 1RIBH. O worker-cnd
                            usará estes registros salvos, sem consultar o 1RIBH
                            novamente.
                          </PreviewSubtitle>
                        </div>

                        <PreviewBadge>
                          {formatNumber(previaBusca.previa.quantidadeRegistros)}{" "}
                          registro(s)
                        </PreviewBadge>
                      </PreviewHeader>

                      <PreviewGrid>
                        <PreviewInfo>
                          <strong>Logradouro</strong>
                          <span>{previaBusca.previa.logradouro}</span>
                        </PreviewInfo>

                        <PreviewInfo>
                          <strong>Número</strong>
                          <span>{previaBusca.previa.numero}</span>
                        </PreviewInfo>

                        <PreviewInfo>
                          <strong>Excedente estimado</strong>
                          <span>
                            {formatCurrencyFromCents(
                              previaBusca.excedente
                                .valorExcedenteEstimadoCentavos
                            )}
                          </span>
                        </PreviewInfo>
                      </PreviewGrid>

                      <PreviewList>
                        {previaBusca.previa.registros.map((registro, index) => (
                          <PreviewListItem
                            key={`${registro.indiceCadastral}-${index}`}
                          >
                            <strong>{registro.indiceCadastral}</strong>
                            <span>{registro.complemento ?? "Sem complemento"}</span>
                          </PreviewListItem>
                        ))}
                      </PreviewList>
                    </PreviewCard>
                  )}

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
                <SidebarTitle>Fluxo protegido</SidebarTitle>

                <SidebarDescription>
                  A prévia evita cobrança surpresa e também evita consultar o
                  1RIBH duas vezes para o mesmo endereço.
                </SidebarDescription>

                <SidebarList>
                  <SidebarListItem>
                    Primeiro o sistema busca os registros no 1RIBH.
                  </SidebarListItem>

                  <SidebarListItem>
                    Depois calcula se haverá consulta excedente.
                  </SidebarListItem>

                  <SidebarListItem>
                    Ao confirmar, o worker-cnd usa a prévia já salva.
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
