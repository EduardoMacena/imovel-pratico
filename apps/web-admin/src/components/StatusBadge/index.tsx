"use client";

import { Badge } from "./styles";

type StatusBadgeProps = {
  status: string;
};

function getVariant(status: string) {
  if (
    status === "ATIVO" ||
    status === "SUPER_ADMIN" ||
    status === "ADMIN" ||
    status === "COMPLETED" ||
    status === "SUCCESS" ||
    status === "PAGO"
  ) {
    return "success";
  }

  if (
    status === "INATIVO" ||
    status === "SUSPENSO" ||
    status === "ERROR" ||
    status === "CANCELED" ||
    status === "VENCIDO" ||
    status === "CANCELADO"
  ) {
    return "error";
  }

  if (status === "GERENTE" || status === "PROCESSING") {
    return "info";
  }

  if (
    status === "OPERADOR" ||
    status === "PENDING" ||
    status === "PENDENTE"
  ) {
    return "warning";
  }

  return "neutral";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge $variant={getVariant(status)}>{status}</Badge>;
}