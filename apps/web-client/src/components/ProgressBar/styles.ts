"use client";

import styled from "styled-components";

export const ProgressWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ProgressStatus = styled.span`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 700;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.success};
    box-shadow: 0 0 0 6px ${({ theme }) => theme.colors.successBg};
  }
`;

export const ProgressMeta = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 13px;
  padding: 2px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${Math.max(0, Math.min($percentage, 100))}%`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.accent}
  );
  transition: width 0.3s ease;
`;
