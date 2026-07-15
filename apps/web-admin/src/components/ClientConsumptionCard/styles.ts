"use client";

import styled from "styled-components";

export const Wrapper = styled.section`
  min-width: 0;
  margin-top: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.10), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.82)),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow:
    0 14px 34px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
`;

export const Header = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const Title = styled.h3`
  min-width: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  line-height: 1.2;
  font-weight: 760;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
`;

export const Subtitle = styled.p`
  margin: 5px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.45;
  font-weight: 400;
`;

export const Badge = styled.span<{ $variant: "success" | "danger" | "warning" }>`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 32px;
  width: fit-content;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 12px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${({ theme, $variant }) => {
    if ($variant === "success") return theme.colors.successBg;
    if ($variant === "danger") return theme.colors.dangerBg;
    return theme.colors.warningBg;
  }};
  color: ${({ theme, $variant }) => {
    if ($variant === "success") return theme.colors.success;
    if ($variant === "danger") return theme.colors.danger;
    return theme.colors.warning;
  }};
  border: 1px solid
    ${({ theme, $variant }) => {
      if ($variant === "success") return theme.colors.successBorder;
      if ($variant === "danger") return theme.colors.dangerBorder;
      return theme.colors.warningBorder;
    }};

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: currentColor;
  }
`;

export const Grid = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $compact }) =>
    $compact
      ? "repeat(3, minmax(0, 1fr))"
      : "repeat(4, minmax(0, 1fr))"};
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 980px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 6px;
`;

export const Value = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.45;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  padding: 2px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${Math.max(0, Math.min($percent, 100))}%`};
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.accent}
  );
  transition: width 0.25s ease;
`;
