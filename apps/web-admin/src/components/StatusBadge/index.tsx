"use client";

import { Badge } from "./styles";

type StatusBadgeProps = {
  status: string;
};

function getStatusConfig(status: string) {
  const normalized = status.toUpperCase();

  if (
    normalized === "ATIVO" ||
    normalized === "SUPER_ADMIN" ||
    normalized === "ADMIN" ||
    normalized === "COMPLETED" ||
    normalized === "SUCCESS" ||
    normalized === "PAGO"
  ) {
    return {
      variant: "success" as const,
      label:
        normalized === "COMPLETED"
          ? "Concluída"
          : normalized === "SUCCESS"
            ? "Sucesso"
            : normalized === "PAGO"
              ? "Pago"
              : normalized === "ATIVO"
                ? "Ativo"
                : status,
    };
  }

  if (
    normalized === "INATIVO" ||
    normalized === "SUSPENSO" ||
    normalized === "ERROR" ||
    normalized === "CANCELED" ||
    normalized === "VENCIDO" ||
    normalized === "CANCELADO"
  ) {
    return {
      variant: "error" as const,
      label:
        normalized === "ERROR"
          ? "Erro"
          : normalized === "CANCELED"
            ? "Cancelada"
            : status,
    };
  }

  if (normalized === "GERENTE" || normalized === "PROCESSING") {
    return {
      variant: "info" as const,
      label: normalized === "PROCESSING" ? "Processando" : status,
    };
  }

  if (
    normalized === "OPERADOR" ||
    normalized === "PENDING" ||
    normalized === "PENDENTE"
  ) {
    return {
      variant: "warning" as const,
      label: normalized === "PENDING" ? "Pendente" : status,
    };
  }

  return {
    variant: "neutral" as const,
    label: status,
  };
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return <Badge $variant={config.variant}>{config.label}</Badge>;
}
