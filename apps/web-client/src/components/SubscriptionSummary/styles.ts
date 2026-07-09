"use client";

import styled from "styled-components";

export const Wrapper = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
`;

export const Badge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12px;
  font-weight: 900;
  background: ${({ theme, $status }) =>
    $status === "PAGO" ? theme.colors.successBg : theme.colors.dangerBg};
  color: ${({ theme, $status }) =>
    $status === "PAGO" ? theme.colors.success : theme.colors.danger};
  border: 1px solid
    ${({ theme, $status }) =>
      $status === "PAGO" ? theme.colors.successBorder : theme.colors.dangerBorder};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

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
  font-size: 18px;
  font-weight: 900;
`;
