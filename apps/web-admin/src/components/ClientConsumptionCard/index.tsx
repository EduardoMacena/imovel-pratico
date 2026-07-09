"use client";

import type { ConsumoClienteResumo } from "../../features/admin/types";
import {
  Badge,
  Grid,
  Header,
  Item,
  Label,
  ProgressBar,
  ProgressTrack,
  Subtitle,
  TasksGrid,
  Title,
  Value,
  Wrapper,
} from "./styles";

type ClientConsumptionCardProps = {
  consumo: ConsumoClienteResumo;
  compact?: boolean;
};

function formatCurrencyFromCents(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

function getPagamentoVariant(consumo: ConsumoClienteResumo) {
  if (
    consumo.cliente.pagamentoStatus === "PAGO" &&
    !consumo.cliente.pagamentoVencido
  ) {
    return "success";
  }

  if (
    consumo.cliente.pagamentoStatus === "PENDENTE" ||
    consumo.cliente.pagamentoStatus === "VENCIDO"
  ) {
    return "warning";
  }

  return "danger";
}

export function ClientConsumptionCard({
  consumo,
  compact,
}: ClientConsumptionCardProps) {
  const pagamentoLabel = consumo.cliente.pagamentoVencido
    ? "VENCIDO"
    : consumo.cliente.pagamentoStatus;

  return (
    <Wrapper>
      <Header>
        <div>
          <Title>{consumo.cliente.nome}</Title>
          <Subtitle>
            Plano: {consumo.plano?.nome ?? "Sem plano"} · Intervalo:{" "}
            {consumo.plano?.intervaloSegundos ?? "-"}s
          </Subtitle>
        </div>

        <Badge $variant={getPagamentoVariant(consumo)}>
          {pagamentoLabel}
        </Badge>
      </Header>

      <Grid $compact={compact}>
        <Item>
          <Label>Limite mensal</Label>
          <Value>{consumo.uso.limiteMensal}</Value>
        </Item>

        <Item>
          <Label>Consultas usadas</Label>
          <Value>{consumo.uso.consultasUsadas}</Value>
        </Item>

        <Item>
          <Label>Consultas restantes</Label>
          <Value>{consumo.uso.consultasRestantes}</Value>
        </Item>

        {!compact && (
          <Item>
            <Label>Preço do plano</Label>
            <Value>{formatCurrencyFromCents(consumo.plano?.precoCentavos)}</Value>
          </Item>
        )}

        {!compact && (
          <Item>
            <Label>Vencimento</Label>
            <Value>{formatDate(consumo.cliente.pagamentoVenceEm)}</Value>
          </Item>
        )}

        {!compact && (
          <Item>
            <Label>Status cliente</Label>
            <Value>{consumo.cliente.status}</Value>
          </Item>
        )}

        {!compact && (
          <Item>
            <Label>Status plano</Label>
            <Value>{consumo.plano?.status ?? "-"}</Value>
          </Item>
        )}

        {!compact && (
          <Item>
            <Label>Uso do plano</Label>
            <Value>{consumo.uso.percentualUsado}%</Value>
          </Item>
        )}
      </Grid>

      <ProgressTrack>
        <ProgressBar $percent={consumo.uso.percentualUsado} />
      </ProgressTrack>

      {!compact && (
        <TasksGrid>
          <Item>
            <Label>Pendentes</Label>
            <Value>{consumo.tarefas.pending}</Value>
          </Item>

          <Item>
            <Label>Processando</Label>
            <Value>{consumo.tarefas.processing}</Value>
          </Item>

          <Item>
            <Label>Concluídas</Label>
            <Value>{consumo.tarefas.completed}</Value>
          </Item>

          <Item>
            <Label>Erro</Label>
            <Value>{consumo.tarefas.error}</Value>
          </Item>

          <Item>
            <Label>Canceladas</Label>
            <Value>{consumo.tarefas.canceled}</Value>
          </Item>
        </TasksGrid>
      )}
    </Wrapper>
  );
}
