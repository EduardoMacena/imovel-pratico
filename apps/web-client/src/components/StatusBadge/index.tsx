"use client";

import { Badge } from "./styles";

type StatusBadgeProps = {
  status: string;
};

function getVariant(status: string) {
  if (status === "SUCCESS" || status === "COMPLETED") {
    return "success";
  }

  if (status === "ERROR" || status === "CANCELED") {
    return "error";
  }

  if (status === "PROCESSING") {
    return "info";
  }

  if (status === "PENDING") {
    return "warning";
  }

  return "neutral";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge $variant={getVariant(status)}>{status}</Badge>;
}
