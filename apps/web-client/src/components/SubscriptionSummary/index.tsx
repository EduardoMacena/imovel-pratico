"use client";

import type { MinhaAssinaturaResponse } from "../../features/busca/types";
import {
  formatCurrencyFromCents,
  formatDateOnlyBR,
  formatNumberBR,
} from "../../lib/formatters";
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

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return formatDateOnlyBR(value);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function calcularPercentualUsado(usadas: number, limite: number) {
  if (limite <= 0) {
    return 0;
  }

  return Math.min(Math.round((usadas / limite) * 100), 100);
}

function getPagamentoLabel(status: string) {
  return status === "PAGO" ? "Pago" : status;
}

export function SubscriptionSummary({ assinatura }: SubscriptionSummaryProps) {
  const percentualUsado = calcularPercentualUsado(
    assinatura.uso.consultasUsadas,
    assinatura.uso.limiteMensal,
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
          <Value>{formatNumberBR(assinatura.uso.limiteMensal)}</Value>
        </Item>

        <Item>
          <Label>Usadas</Label>
          <Value>{formatNumberBR(assinatura.uso.consultasUsadas)}</Value>
        </Item>

        <Item>
          <Label>Restantes</Label>
          <Value>{formatNumberBR(assinatura.uso.consultasRestantes)}</Value>
        </Item>

        <Item>
          <Label>Intervalo</Label>
          <Value>{assinatura.plano.intervaloSegundos}s</Value>
        </Item>

        <Item>
          <Label>Mensalidade fixa</Label>
          <Value>
            {formatCurrencyFromCents(assinatura.plano.precoCentavos)}
          </Value>
        </Item>

        <Item>
          <Label>Corretores</Label>
          <Value>{assinatura.plano.limiteCorretores ?? "-"}</Value>
        </Item>

        <Item>
          <Label>Renovação do período</Label>
          <Value>{formatDate(assinatura.uso.fimMes)}</Value>
        </Item>

        <Item>
          <Label>Vencimento</Label>
          <Value>{formatDate(assinatura.cliente.pagamentoVenceEm)}</Value>
        </Item>
      </Grid>
    </Wrapper>
  );
}
