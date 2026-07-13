"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { listarPlanos } from "../../features/admin/api";
import type { PlanoResumo } from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import {
  Actions,
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
  PlanDescription,
  PlanItem,
  PlanMeta,
  PlanName,
  PlanTop,
  PrimaryLink,
  NewPlanLink,
  StatCard,
  StatGrid,
  StatLabel,
  StatValue,
  Subtitle,
  Title,
} from "./page.styles";

function formatCurrencyFromCents(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function PlanosPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [planos, setPlanos] = useState<PlanoResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const ativos = planos.filter(plano => plano.status === "ATIVO").length;
    const inativos = planos.filter(plano => plano.status !== "ATIVO").length;

    const maiorLimite = planos.reduce((max, plano) => {
      return Math.max(max, plano.limiteMensalConsultas);
    }, 0);

    const receitaPotencial = planos
      .filter(plano => plano.status === "ATIVO")
      .reduce((total, plano) => total + plano.precoCentavos, 0);

    return {
      ativos,
      inativos,
      maiorLimite,
      receitaPotencial,
    };
  }, [planos]);

  async function carregarPlanos() {
    try {
      setErro(null);

      const data = await listarPlanos();

      setPlanos(data.planos);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar planos"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      carregarPlanos();
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
          <HeaderGrid>
            <HeaderContent>
              <HeaderEyebrow>Estratégia comercial</HeaderEyebrow>

              <Title>Planos comerciais</Title>

              <Subtitle>
                Gerencie os planos disponíveis, limites mensais, valores fixos,
                consulta adicional e quantidade de corretores recomendada.
              </Subtitle>
            </HeaderContent>

            <HeaderPanel>
              <HeaderPanelLabel>Receita potencial dos planos ativos</HeaderPanelLabel>
              <HeaderPanelValue>
                {formatCurrencyFromCents(resumo.receitaPotencial)}
              </HeaderPanelValue>

              <Actions>
                <NewPlanLink href="/planos/novo">+ Cadastrar novo plano</NewPlanLink>
              </Actions>
            </HeaderPanel>
          </HeaderGrid>
        </Header>

        {erro && <ErrorBox>{erro}</ErrorBox>}

        <StatGrid>
          <StatCard>
            <StatLabel>Planos ativos</StatLabel>
            <StatValue>{formatNumber(resumo.ativos)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Planos inativos</StatLabel>
            <StatValue>{formatNumber(resumo.inativos)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Maior limite mensal</StatLabel>
            <StatValue>{formatNumber(resumo.maiorLimite)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Total de planos</StatLabel>
            <StatValue>{formatNumber(planos.length)}</StatValue>
          </StatCard>
        </StatGrid>

        <ListHeader>
          <div>
            <ListTitle>Planos cadastrados</ListTitle>
            <ListSubtitle>
              Lista limpa para análise comercial. Use a edição para ajustar
              preço, limite, excedente e status.
            </ListSubtitle>
          </div>

          <NewPlanLink href="/planos/novo">+ Novo plano</NewPlanLink>
        </ListHeader>

        {isLoading && (
          <EmptyState>
            <EmptyStateTitle>Carregando planos...</EmptyStateTitle>
            Estamos buscando os planos comerciais cadastrados.
          </EmptyState>
        )}

        {!isLoading && planos.length === 0 && (
          <EmptyState>
            <EmptyStateTitle>Nenhum plano cadastrado.</EmptyStateTitle>
            Cadastre o primeiro plano comercial para vincular clientes.
          </EmptyState>
        )}

        {!isLoading && planos.length > 0 && (
          <List>
            {planos.map(plano => (
              <PlanItem key={plano.id}>
                <PlanTop>
                  <div>
                    <PlanName>{plano.nome}</PlanName>
                    <PlanMeta>{plano.slug}</PlanMeta>
                  </div>

                  <StatusBadge status={plano.status} />
                </PlanTop>

                {plano.descricao && (
                  <PlanDescription>{plano.descricao}</PlanDescription>
                )}

                <InfoGrid>
                  <InfoBox>
                    <InfoLabel>Preço mensal</InfoLabel>
                    <InfoValue>
                      {formatCurrencyFromCents(plano.precoCentavos)}
                    </InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Consultas inclusas</InfoLabel>
                    <InfoValue>
                      {formatNumber(plano.limiteMensalConsultas)}
                    </InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Consulta adicional</InfoLabel>
                    <InfoValue>
                      {formatCurrencyFromCents(
                        plano.valorConsultaAdicionalCentavos
                      )}
                    </InfoValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoLabel>Corretores</InfoLabel>
                    <InfoValue>{plano.limiteCorretores ?? "-"}</InfoValue>
                  </InfoBox>
                </InfoGrid>

                <Actions>
                  <PrimaryLink href={`/planos/${plano.id}/editar`}>
                    Editar plano
                  </PrimaryLink>
                </Actions>
              </PlanItem>
            ))}
          </List>
        )}
      </PageContainer>
    </>
  );
}
