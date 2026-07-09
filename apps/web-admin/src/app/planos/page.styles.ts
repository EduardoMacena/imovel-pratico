"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 28px;
`;

export const Subtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

export const PlanosGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const PlanoCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const PlanoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const PlanoTitle = styled.h3`
  margin: 0;
  font-size: 20px;
`;

export const PlanoDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Badge = styled.span<{ $status: string }>`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 900;
  background: ${({ theme, $status }) =>
    $status === "ATIVO" ? theme.colors.successBg : theme.colors.dangerBg};
  color: ${({ theme, $status }) =>
    $status === "ATIVO" ? theme.colors.success : theme.colors.danger};
  border: 1px solid
    ${({ theme, $status }) =>
      $status === "ATIVO" ? theme.colors.successBorder : theme.colors.dangerBorder};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  margin-bottom: 4px;
`;

export const InfoValue = styled.div`
  font-weight: 900;
  word-break: break-word;
`;

export const EditLink = styled(Link)`
  display: inline-flex;
  width: fit-content;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 900;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ErrorBox = styled.div`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
`;

export const SuccessBox = styled.div`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
`;
