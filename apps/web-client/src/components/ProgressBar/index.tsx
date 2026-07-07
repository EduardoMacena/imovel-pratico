"use client";

import {
  ProgressFill,
  ProgressHeader,
  ProgressTrack,
  ProgressWrapper,
} from "./styles";

type ProgressBarProps = {
  status: string;
  total: number;
  current: number;
  percentage: number;
};

export function ProgressBar({
  status,
  total,
  current,
  percentage,
}: ProgressBarProps) {
  return (
    <ProgressWrapper>
      <ProgressHeader>
        <span>Status: {status}</span>
        <span>
          {current}/{total} — {percentage}%
        </span>
      </ProgressHeader>

      <ProgressTrack>
        <ProgressFill $percentage={percentage} />
      </ProgressTrack>
    </ProgressWrapper>
  );
}
