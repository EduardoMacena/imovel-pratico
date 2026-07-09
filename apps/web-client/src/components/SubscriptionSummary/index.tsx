"use client";

import type { MinhaAssinaturaResponse } from "../../features/busca/types";
import {
	Badge,
	Grid,
	Header,
	Item,
	Label,
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

export function SubscriptionSummary({ assinatura }: SubscriptionSummaryProps) {
	return (
		<Wrapper>
			<Header>
				<div>
					<Title>
						{assinatura.cliente.nome} — Plano {assinatura.plano.nome}
					</Title>
				</div>

				<Badge $status={assinatura.cliente.pagamentoStatus}>
					{assinatura.cliente.pagamentoStatus}
				</Badge>
			</Header>

			<Grid>
				<Item>
					<Label>Plano mensal</Label>
					<Value>{assinatura.uso.limiteMensal}</Value>
				</Item>

				<Item>
					<Label>Intervalo do plano</Label>
					<Value>{assinatura.plano.intervaloSegundos}s</Value>
				</Item>

				<Item>
					<Label>Consultas usadas</Label>
					<Value>{assinatura.uso.consultasUsadas}</Value>
				</Item>

				<Item>
					<Label>Consultas restantes</Label>
					<Value>{assinatura.uso.consultasRestantes}</Value>
				</Item>

				<Item>
					<Label>Vencimento</Label>
					<Value>{formatDate(assinatura.cliente.pagamentoVenceEm)}</Value>
				</Item>
			</Grid>
		</Wrapper>
	);
}
