"use client";

import { Badge } from "./styles";

type StatusBadgeProps = {
  status: string;
};

function getStatusConfig(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "SUCCESS" || normalized === "COMPLETED") {
    return {
      variant: "success" as const,
      label: "Concluída",
    };
  }

  if (normalized === "ERROR") {
    return {
      variant: "error" as const,
      label: "Erro",
    };
  }

  if (normalized === "CANCELED") {
    return {
      variant: "error" as const,
      label: "Cancelada",
    };
  }

  if (normalized === "PROCESSING") {
    return {
      variant: "info" as const,
      label: "Processando",
    };
  }

  if (normalized === "PENDING") {
    return {
      variant: "warning" as const,
      label: "Pendente",
    };
  }

  if (normalized === "PAGO") {
    return {
      variant: "success" as const,
      label: "Pago",
    };
  }

  if (normalized === "ATIVO") {
    return {
      variant: "success" as const,
      label: "Ativo",
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
