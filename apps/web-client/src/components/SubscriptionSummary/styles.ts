"use client";

import styled from "styled-components";

export const Wrapper = styled.section`
  min-width: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.14), transparent 30%),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow:
    0 18px 48px rgba(11, 31, 51, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.80);
`;

export const Header = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h2`
  max-width: 250px;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  line-height: 1.12;
  letter-spacing: -0.05em;
  overflow-wrap: anywhere;

  @media (max-width: 1120px) {
    max-width: none;
  }
`;

export const PlanName = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 900;
`;

export const Badge = styled.span<{ $status: string }>`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 34px;
  width: fit-content;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${({ theme, $status }) =>
    $status === "PAGO" ? theme.colors.successBg : theme.colors.dangerBg};
  color: ${({ theme, $status }) =>
    $status === "PAGO" ? theme.colors.success : theme.colors.danger};
  border: 1px solid
    ${({ theme, $status }) =>
      $status === "PAGO"
        ? theme.colors.successBorder
        : theme.colors.dangerBorder};

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: ${({ theme, $status }) =>
      $status === "PAGO" ? theme.colors.success : theme.colors.danger};
  }
`;

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ProgressValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 950;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  padding: 2px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.div<{ $wide?: boolean }>`
  min-width: 0;
  grid-column: ${({ $wide }) => ($wide ? "1 / -1" : "auto")};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.68)),
    ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  margin-bottom: 6px;
  font-weight: 900;
`;

export const Value = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  line-height: 1.1;
  font-weight: 950;
  letter-spacing: -0.05em;
  overflow-wrap: anywhere;
`;
