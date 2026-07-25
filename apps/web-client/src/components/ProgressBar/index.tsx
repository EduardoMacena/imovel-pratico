"use client";

import {
  ProgressFill,
  ProgressHeader,
  ProgressMeta,
  ProgressStatus,
  ProgressTrack,
  ProgressWrapper,
} from "./styles";

type ProgressBarProps = {
  status: string;
  total: number;
  current: number;
  percentage: number;
};

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PROCESSING: "Processando",
    COMPLETED: "Concluída",
    ERROR: "Erro",
    CANCELED: "Cancelada",
  };

  return labels[status] ?? status;
}

export function ProgressBar({
  status,
  total,
  current,
  percentage,
}: ProgressBarProps) {
  return (
    <ProgressWrapper>
      <ProgressHeader>
        <ProgressStatus>{getStatusLabel(status)}</ProgressStatus>

        <ProgressMeta>
          {current}/{total} · {percentage}%
        </ProgressMeta>
      </ProgressHeader>

      <ProgressTrack>
        <ProgressFill $percentage={percentage} />
      </ProgressTrack>
    </ProgressWrapper>
  );
}
