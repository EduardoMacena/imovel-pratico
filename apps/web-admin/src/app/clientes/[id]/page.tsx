"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "../../../components/AppHeader";
import { ClientConsumptionCard } from "../../../components/ClientConsumptionCard";
import { StatusBadge } from "../../../components/StatusBadge";
import {
  buscarCliente,
  buscarConsumoCliente,
  listarWorkerAgentsCliente,
} from "../../../features/admin/api";
import {
  formatarCep,
  formatarCnpj,
  formatarTelefone,
} from "../../../features/admin/clientes-formatters";
import type {
  ClienteDetalheResumo,
  ConsumoClienteResumo,
  WorkerAgentResumo,
} from "../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../hooks/useRequireSuperAdmin";
import {
  ActionLink,
  Actions,
  BackLink,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailSectionButton,
  DetailSectionContent,
  DetailSectionHeader,
  DetailSectionShell,
  DetailSectionTitle,
  DetailValue,
  EmptyState,
  EmptyStateTitle,
  ErrorBox,
  Header,
  HeaderContent,
  HeaderEyebrow,
  HeaderGrid,
  HeaderPanel,
  HeaderPanelItem,
  HeaderPanelLabel,
  HeaderPanelValue,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue,
  PageContainer,
  Section,
  SectionIntro,
  SectionSubtitle,
  SectionTitle,
  Subtitle,
  Title,
} from "./page.styles";

type DetailSectionProps = {
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function valueOrDash(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDateOnly(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00.000Z`));
}

function DetailSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <DetailSectionShell>
      <DetailSectionButton
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <DetailSectionHeader>
          <div>
            <DetailSectionTitle>{title}</DetailSectionTitle>
            <SectionSubtitle>{subtitle}</SectionSubtitle>
          </div>

          <span>{isOpen ? "− Recolher" : "+ Expandir"}</span>
        </DetailSectionHeader>
      </DetailSectionButton>

      {isOpen && (
        <DetailSectionContent>{children}</DetailSectionContent>
      )}
    </DetailSectionShell>
  );
}

export default function DetalheClientePage() {
  const { isCheckingAuth } = useRequireSuperAdmin();
  const params = useParams<{ id: string }>();
  const clienteId = params.id;

  const [cliente, setCliente] = useState<ClienteDetalheResumo | null>(null);
  const [consumo, setConsumo] = useState<ConsumoClienteResumo | null>(null);
  const [agents, setAgents] = useState<WorkerAgentResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const agentsOnline = useMemo(
    () => agents.filter((agent) => agent.statusOperacional === "ONLINE").length,
    [agents],
  );

  async function carregarDetalhe() {
    try {
      setErro(null);
      setIsLoading(true);

      const [clienteData, consumoData, agentsData] = await Promise.all([
        buscarCliente(clienteId),
        buscarConsumoCliente(clienteId),
        listarWorkerAgentsCliente(clienteId),
      ]);

      setCliente(clienteData.cliente);
      setConsumo(consumoData.consumo);
      setAgents(agentsData.agents);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar o cliente",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      void carregarDetalhe();
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

        {erro && <ErrorBox role="alert">{erro}</ErrorBox>}

        {isLoading && (
          <EmptyState>
            <EmptyStateTitle>Carregando visão do cliente...</EmptyStateTitle>
            Estamos reunindo cadastro, plano, consumo e operação.
          </EmptyState>
        )}

        {!isLoading && !erro && !cliente && (
          <EmptyState>
            <EmptyStateTitle>Cliente indisponível.</EmptyStateTitle>
            Não foi possível localizar os dados deste cliente.
          </EmptyState>
        )}

        {!isLoading && cliente && (
          <>
            <Header>
              <HeaderGrid>
                <HeaderContent>
                  <HeaderEyebrow>Visão 360º do cliente</HeaderEyebrow>
                  <Title>{cliente.nome}</Title>
                  <Subtitle>
                    {cliente.nomeFantasia ||
                      cliente.razaoSocial ||
                      `Cliente ${cliente.slug}`}
                  </Subtitle>

                  <Actions>
                    <ActionLink href={`/clientes/${cliente.id}/editar`}>
                      Editar cadastro
                    </ActionLink>
                    <ActionLink href={`/clientes/${cliente.id}/usuarios`}>
                      Usuários
                    </ActionLink>
                    <ActionLink href={`/clientes/${cliente.id}/tarefas`}>
                      Tarefas
                    </ActionLink>
                    <ActionLink href={`/clientes/${cliente.id}/instalador`}>
                      Instalador
                    </ActionLink>
                    <ActionLink href="/financeiro">Financeiro</ActionLink>
                  </Actions>
                </HeaderContent>

                <HeaderPanel>
                  <HeaderPanelItem>
                    <HeaderPanelLabel>Status</HeaderPanelLabel>
                    <HeaderPanelValue>
                      <StatusBadge status={cliente.status} />
                    </HeaderPanelValue>
                  </HeaderPanelItem>

                  <HeaderPanelItem>
                    <HeaderPanelLabel>Plano</HeaderPanelLabel>
                    <HeaderPanelValue>
                      {cliente.plano?.nome ?? "Sem plano"}
                    </HeaderPanelValue>
                  </HeaderPanelItem>

                  <HeaderPanelItem>
                    <HeaderPanelLabel>Município principal</HeaderPanelLabel>
                    <HeaderPanelValue>
                      {cliente.municipioPrincipal
                        ? `${cliente.municipioPrincipal.nome} — ${cliente.municipioPrincipal.uf}`
                        : "Não configurado"}
                    </HeaderPanelValue>
                  </HeaderPanelItem>

                  <HeaderPanelItem>
                    <HeaderPanelLabel>Processamento</HeaderPanelLabel>
                    <HeaderPanelValue>
                      {cliente.modoProcessamento}
                    </HeaderPanelValue>
                  </HeaderPanelItem>
                </HeaderPanel>
              </HeaderGrid>
            </Header>

            <MetricGrid>
              <MetricCard>
                <MetricLabel>Usuários</MetricLabel>
                <MetricValue>{cliente.totalUsuarios}</MetricValue>
              </MetricCard>

              <MetricCard>
                <MetricLabel>Tarefas</MetricLabel>
                <MetricValue>{cliente.totalTarefas}</MetricValue>
              </MetricCard>

              <MetricCard>
                <MetricLabel>Agents online</MetricLabel>
                <MetricValue>
                  {agentsOnline}/{agents.length}
                </MetricValue>
              </MetricCard>

              <MetricCard>
                <MetricLabel>Uso mensal</MetricLabel>
                <MetricValue>
                  {consumo ? `${consumo.uso.percentualUsado}%` : "-"}
                </MetricValue>
              </MetricCard>
            </MetricGrid>

            <Section>
              <SectionIntro>
                <div>
                  <SectionTitle>Consumo e plano</SectionTitle>
                  <SectionSubtitle>
                    Acompanhe o limite fixo contratado e a utilização no mês
                    atual.
                  </SectionSubtitle>
                </div>
              </SectionIntro>

              {consumo ? (
                <ClientConsumptionCard consumo={consumo} />
              ) : (
                <EmptyState>
                  <EmptyStateTitle>Consumo indisponível.</EmptyStateTitle>
                  O resumo de consumo não foi retornado para este cliente.
                </EmptyState>
              )}
            </Section>

            <Section>
              <SectionIntro>
                <div>
                  <SectionTitle>Cadastro e operação</SectionTitle>
                  <SectionSubtitle>
                    Informações extensas ficam recolhidas para manter a página
                    objetiva e produtiva.
                  </SectionSubtitle>
                </div>
              </SectionIntro>

              <DetailSection
                title="Identidade empresarial"
                subtitle="Documento, razão social, nome fantasia e canais comerciais."
                defaultOpen
              >
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>CNPJ</DetailLabel>
                    <DetailValue>
                      {cliente.cnpj ? formatarCnpj(cliente.cnpj) : "-"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Razão social</DetailLabel>
                    <DetailValue>{valueOrDash(cliente.razaoSocial)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Nome fantasia</DetailLabel>
                    <DetailValue>{valueOrDash(cliente.nomeFantasia)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>E-mail comercial</DetailLabel>
                    <DetailValue>{valueOrDash(cliente.emailComercial)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Telefone comercial</DetailLabel>
                    <DetailValue>
                      {cliente.telefoneComercial
                        ? formatarTelefone(cliente.telefoneComercial)
                        : "-"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Slug</DetailLabel>
                    <DetailValue>{cliente.slug}</DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection
                title="Endereço comercial"
                subtitle="Localização empresarial cadastrada para a imobiliária."
              >
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>CEP</DetailLabel>
                    <DetailValue>
                      {cliente.enderecoCep ? formatarCep(cliente.enderecoCep) : "-"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem $wide>
                    <DetailLabel>Logradouro</DetailLabel>
                    <DetailValue>
                      {valueOrDash(cliente.enderecoLogradouro)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Número</DetailLabel>
                    <DetailValue>{valueOrDash(cliente.enderecoNumero)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Complemento</DetailLabel>
                    <DetailValue>
                      {valueOrDash(cliente.enderecoComplemento)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Bairro</DetailLabel>
                    <DetailValue>{valueOrDash(cliente.enderecoBairro)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Cidade / UF</DetailLabel>
                    <DetailValue>
                      {cliente.enderecoCidade || cliente.enderecoUf
                        ? `${cliente.enderecoCidade ?? "-"} / ${cliente.enderecoUf ?? "-"}`
                        : "-"}
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection
                title="Operação e processamento"
                subtitle="Configuração operacional efetiva deste cliente."
              >
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Modo de processamento</DetailLabel>
                    <DetailValue>{cliente.modoProcessamento}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Intervalo do plano</DetailLabel>
                    <DetailValue>{cliente.intervaloSegundos}s</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Limite diário</DetailLabel>
                    <DetailValue>{cliente.limiteDiario}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Limite mensal</DetailLabel>
                    <DetailValue>{cliente.limiteMensalConsultas}</DetailValue>
                  </DetailItem>
                  <DetailItem $wide>
                    <DetailLabel>Worker URL</DetailLabel>
                    <DetailValue>{valueOrDash(cliente.workerUrl)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Pagamento</DetailLabel>
                    <DetailValue>{cliente.pagamentoStatus}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Vencimento</DetailLabel>
                    <DetailValue>
                      {formatDateOnly(cliente.pagamentoVenceEm)}
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection
                title="Datas e controle"
                subtitle="Referências administrativas do registro."
              >
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Criado em</DetailLabel>
                    <DetailValue>{formatDate(cliente.createdAt)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Atualizado em</DetailLabel>
                    <DetailValue>{formatDate(cliente.updatedAt)}</DetailValue>
                  </DetailItem>
                  <DetailItem $wide>
                    <DetailLabel>ID do cliente</DetailLabel>
                    <DetailValue>{cliente.id}</DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>
            </Section>
          </>
        )}
      </PageContainer>
    </>
  );
}
