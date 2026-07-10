"use client";

import styled from "styled-components";

export const ProgressWrapper = styled.div`
  margin-top: 0;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 900;

  span:last-child {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 720px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.accent}
  );
  transition: width 0.3s ease;
`;