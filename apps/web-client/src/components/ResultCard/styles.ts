"use client";

import styled from "styled-components";

export const ResultItem = styled.article`
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background:
    radial-gradient(circle at top right, rgba(31, 111, 91, 0.08), transparent 28%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
`;

export const ResultTop = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const ResultTitleGroup = styled.div`
  min-width: 0;
`;

export const ResultEyebrow = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const ResultTitle = styled.strong`
  display: block;
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
`;

export const ResultMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ResultMetaItem = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.primarySoft};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    margin-bottom: 5px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    font-weight: 850;
  }

  span {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 15px;
    font-weight: 950;
    overflow-wrap: anywhere;
  }
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div<{ $wide?: boolean; $highlight?: boolean }>`
  min-width: 0;
  grid-column: ${({ $wide }) => ($wide ? "1 / -1" : "auto")};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.secondarySoft : theme.colors.surfaceMuted};
  border: 1px solid
    ${({ theme, $highlight }) =>
      $highlight ? theme.colors.successBorder : theme.colors.border};
`;

export const DetailLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 850;
  margin-bottom: 6px;
`;

export const DetailValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  line-height: 1.35;
  font-weight: 950;
  overflow-wrap: anywhere;
`;

export const ErrorText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;
`;