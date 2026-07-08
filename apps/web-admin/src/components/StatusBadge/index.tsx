"use client";

import { Badge } from "./styles";

type StatusBadgeProps = {
  status: string;
};

function getVariant(status: string) {
  if (status === "ATIVO" || status === "SUPER_ADMIN" || status === "ADMIN") {
    return "success";
  }

  if (status === "INATIVO" || status === "SUSPENSO") {
    return "error";
  }

  if (status === "GERENTE") {
    return "info";
  }

  if (status === "OPERADOR") {
    return "warning";
  }

  return "neutral";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge $variant={getVariant(status)}>{status}</Badge>;
}
