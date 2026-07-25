"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { listarClientes, listarPlanos } from "../../features/admin/api";
import type { ClienteResumo, PlanoResumo } from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import { formatCurrencyFromCents } from "../../lib/formatters";
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

function formatNumber(value?: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function PlanosPage() {
  const { isCheckingAuth } = useRequireSuperAdmin();

  const [planos, setPlanos] = useState<PlanoResumo[]>([]);
  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const ativos = planos.filter(plano => plano.status === "ATIVO").length;
    const inativos = planos.filter(plano => plano.status === "INATIVO").length;

    const maiorLimite = planos.reduce((max, plano) => {
      return Math.max(max, plano.limiteMensalConsultas);
    }, 0);

    const clientesAtivosComPlano = clientes.filter(cliente => {
      return cliente.status === "ATIVO" && Boolean(cliente.plano);
    });

    const mrrVinculado = clientesAtivosComPlano.reduce((total, cliente) => {
      return total + (cliente.plano?.precoCentavos ?? 0);
    }, 0);

    const ticketMedioReal =
      clientesAtivosComPlano.length > 0
        ? Math.round(mrrVinculado / clientesAtivosComPlano.length)
        : 0;

    const clientesPorPlano = clientesAtivosComPlano.reduce<
      Record<string, { nome: string; total: number }>
    >((acc, cliente) => {
      if (!cliente.plano) {
        return acc;
      }

      const atual = acc[cliente.plano.id] ?? {
        nome: cliente.plano.nome,
        total: 0,
      };

      acc[cliente.plano.id] = {
        ...atual,
        total: atual.total + 1,
      };

      return acc;
    }, {});

    const planoMaisUsado =
      Object.values(clientesPorPlano).sort((a, b) => b.total - a.total)[0] ??
      null;

    const planosComCliente = new Set(
      clientesAtivosComPlano
        .map(cliente => cliente.plano?.id)
        .filter(Boolean)
    );

    const planosSemCliente = planos.filter(plano => {
      return plano.status === "ATIVO" && !planosComCliente.has(plano.id);
    }).length;

    return {
      ativos,
      inativos,
      maiorLimite,
      mrrVinculado,
      ticketMedioReal,
      clientesComPlano: clientesAtivosComPlano.length,
      planoMaisUsado,
      planosSemCliente,
    };
  }, [planos, clientes]);

  async function carregarClientes() {
    try {
      const data = await listarClientes();

      setClientes(data.clientes);
    } catch (error) {
      console.error("Erro ao carregar clientes na tela de planos:", error);
    }
  }

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
      carregarClientes();
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
              <HeaderPanelLabel>MRR vinculado aos clientes</HeaderPanelLabel>
              <HeaderPanelValue>
                {formatCurrencyFromCents(resumo.mrrVinculado)}
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
            <StatLabel>Clientes com plano</StatLabel>
            <StatValue>{formatNumber(resumo.clientesComPlano)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Plano mais usado</StatLabel>
            <StatValue>
              {resumo.planoMaisUsado
                ? `${resumo.planoMaisUsado.nome} (${resumo.planoMaisUsado.total})`
                : "-"}
            </StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Ticket médio real</StatLabel>
            <StatValue>{formatCurrencyFromCents(resumo.ticketMedioReal)}</StatValue>
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
