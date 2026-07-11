"use client";

import type { MinhaAssinaturaResponse } from "../../features/busca/types";
import {
  Badge,
  Grid,
  Header,
  Item,
  Label,
  PlanName,
  ProgressBar,
  ProgressHeader,
  ProgressTrack,
  ProgressValue,
  Title,
  Value,
  Wrapper,
} from "./styles";

type SubscriptionSummaryProps = {
  assinatura: MinhaAssinaturaResponse;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function calcularPercentualUsado(usadas: number, limite: number) {
  if (limite <= 0) {
    return 0;
  }

  return Math.min(Math.round((usadas / limite) * 100), 100);
}

function getPagamentoLabel(status: string) {
  if (status === "PAGO") {
    return "Pago";
  }

  return status;
}

export function SubscriptionSummary({ assinatura }: SubscriptionSummaryProps) {
  const percentualUsado = calcularPercentualUsado(
    assinatura.uso.consultasUsadas,
    assinatura.uso.limiteMensal
  );

  return (
    <Wrapper>
      <Header>
        <div>
          <Title>{assinatura.cliente.nome}</Title>
          <PlanName>Plano {assinatura.plano.nome}</PlanName>
        </div>

        <Badge $status={assinatura.cliente.pagamentoStatus}>
          {getPagamentoLabel(assinatura.cliente.pagamentoStatus)}
        </Badge>
      </Header>

      <ProgressHeader>
        <Label>Uso mensal do plano</Label>
        <ProgressValue>{percentualUsado}% usado</ProgressValue>
      </ProgressHeader>

      <ProgressTrack>
        <ProgressBar $percent={percentualUsado} />
      </ProgressTrack>

      <Grid>
        <Item>
          <Label>Limite mensal</Label>
          <Value>{formatNumber(assinatura.uso.limiteMensal)}</Value>
        </Item>

        <Item>
          <Label>Intervalo</Label>
          <Value>{assinatura.plano.intervaloSegundos}s</Value>
        </Item>

        <Item>
          <Label>Usadas</Label>
          <Value>{formatNumber(assinatura.uso.consultasUsadas)}</Value>
        </Item>

        <Item>
          <Label>Restantes</Label>
          <Value>{formatNumber(assinatura.uso.consultasRestantes)}</Value>
        </Item>

        <Item $wide>
          <Label>Vencimento</Label>
          <Value>{formatDate(assinatura.cliente.pagamentoVenceEm)}</Value>
        </Item>
      </Grid>
    </Wrapper>
  );
}
