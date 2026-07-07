"use client";

import type { ResultadoBusca } from "../../features/busca/types";
import { StatusBadge } from "../StatusBadge";
import {
  ErrorText,
  ResultItem,
  ResultText,
  ResultTitle,
  ResultTop,
} from "./styles";

type ResultCardProps = {
  resultado: ResultadoBusca;
};

export function ResultCard({ resultado }: ResultCardProps) {
  return (
    <ResultItem>
      <ResultTop>
        <ResultTitle>
          {resultado.complemento || "Imóvel sem complemento"}
        </ResultTitle>

        <StatusBadge status={resultado.status} />
      </ResultTop>

      <ResultText>
        <strong>Índice cadastral:</strong> {resultado.indiceCadastral}
      </ResultText>

      {resultado.proprietario.nome && (
        <ResultText>
          <strong>Proprietário:</strong> {resultado.proprietario.nome}
        </ResultText>
      )}

      {resultado.proprietario.cpf && (
        <ResultText>
          <strong>CPF:</strong> {resultado.proprietario.cpf}
        </ResultText>
      )}

      {resultado.proprietario.endereco && (
        <ResultText>
          <strong>Endereço:</strong> {resultado.proprietario.endereco}
        </ResultText>
      )}

      {resultado.proprietario.telefone && (
        <ResultText>
          <strong>Telefone:</strong> {resultado.proprietario.telefone}
        </ResultText>
      )}

      {resultado.proprietario.email && (
        <ResultText>
          <strong>E-mail:</strong> {resultado.proprietario.email}
        </ResultText>
      )}

      {resultado.erro && (
        <ErrorText>
          <strong>Erro:</strong> {resultado.erro}
        </ErrorText>
      )}
    </ResultItem>
  );
}
