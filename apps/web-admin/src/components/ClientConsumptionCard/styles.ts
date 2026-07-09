"use client";

import styled from "styled-components";

export const Wrapper = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

export const Badge = styled.span<{ $variant: "success" | "danger" | "warning" }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 900;
  background: ${({ theme, $variant }) => {
    if ($variant === "success") return theme.colors.successBg;
    if ($variant === "danger") return theme.colors.dangerBg;
    return theme.colors.warningBg ?? theme.colors.surfaceMuted;
  }};
  color: ${({ theme, $variant }) => {
    if ($variant === "success") return theme.colors.success;
    if ($variant === "danger") return theme.colors.danger;
    return theme.colors.warning ?? theme.colors.text;
  }};
  border: 1px solid
    ${({ theme, $variant }) => {
      if ($variant === "success") return theme.colors.successBorder;
      if ($variant === "danger") return theme.colors.dangerBorder;
      return theme.colors.warningBorder ?? theme.colors.border;
    }};
`;

export const Grid = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $compact }) =>
    $compact
      ? "repeat(3, minmax(0, 1fr))"
      : "repeat(4, minmax(0, 1fr))"};
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  margin-bottom: 4px;
`;

export const Value = styled.div`
  font-weight: 900;
  font-size: 16px;
  word-break: break-word;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  overflow: hidden;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const ProgressBar = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
`;

export const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
