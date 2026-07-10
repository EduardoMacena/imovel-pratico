"use client";

import type { ResultadoBusca } from "../../features/busca/types";
import { OwnerDetails } from "../OwnerDetails";
import { StatusBadge } from "../StatusBadge";
import {
	ContactGrid,
	DetailItem,
	DetailLabel,
	DetailValue,
	ErrorText,
	ResultEyebrow,
	ResultItem,
	ResultMeta,
	ResultMetaItem,
	ResultTitle,
	ResultTitleGroup,
	ResultTop,
} from "./styles";

type ResultCardProps = {
	resultado: ResultadoBusca;
};

export function ResultCard({ resultado }: ResultCardProps) {
	return (
		<ResultItem>
			<ResultTop>
				<ResultTitleGroup>
					<ResultEyebrow>Imóvel encontrado</ResultEyebrow>

					<ResultTitle>
						{resultado.complemento || "Imóvel sem complemento"}
					</ResultTitle>
				</ResultTitleGroup>

				<StatusBadge status={resultado.status} />
			</ResultTop>

			<ResultMeta>
				<ResultMetaItem>
					<strong>Índice cadastral</strong>
					<span>{resultado.indiceCadastral}</span>
				</ResultMetaItem>

				{resultado.fonteContato && (
					<ResultMetaItem>
						<strong>Fonte do contato</strong>
						<span>{resultado.fonteContato}</span>
					</ResultMetaItem>
				)}
			</ResultMeta>

			<ContactGrid>
				{resultado.proprietario.nome && (
					<DetailItem $highlight>
						<DetailLabel>Proprietário</DetailLabel>
						<DetailValue>{resultado.proprietario.nome}</DetailValue>
					</DetailItem>
				)}

				{resultado.proprietario.cpf && (
					<DetailItem>
						<DetailLabel>CPF</DetailLabel>
						<DetailValue>{resultado.proprietario.cpf}</DetailValue>
					</DetailItem>
				)}

				{resultado.proprietario.telefone && (
					<DetailItem>
						<DetailLabel>Telefone</DetailLabel>
						<DetailValue>{resultado.proprietario.telefone}</DetailValue>
					</DetailItem>
				)}

				{resultado.proprietario.email && (
					<DetailItem>
						<DetailLabel>E-mail</DetailLabel>
						<DetailValue>{resultado.proprietario.email}</DetailValue>
					</DetailItem>
				)}

				{resultado.proprietario.endereco && (
					<DetailItem $wide>
						<DetailLabel>Endereço do proprietário</DetailLabel>
						<DetailValue>{resultado.proprietario.endereco}</DetailValue>
					</DetailItem>
				)}
			</ContactGrid>

			<OwnerDetails
				fonteContato={resultado.fonteContato}
				dadosContato={resultado.dadosContato}
			/>

			{resultado.erro && (
				<ErrorText>
					<strong>Erro:</strong> {resultado.erro}
				</ErrorText>
			)}
		</ResultItem>
	);
}