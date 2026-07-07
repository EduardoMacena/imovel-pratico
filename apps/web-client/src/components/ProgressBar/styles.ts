"use client";

import styled from "styled-components";

export const ProgressWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 700;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;
