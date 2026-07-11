"use client";

import styled from "styled-components";

export const ResultItem = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(15, 76, 92, 0.08), transparent 30%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: 0 18px 48px rgba(11, 31, 51, 0.08);
`;

export const ResultTop = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.12), transparent 32%),
    ${({ theme }) => theme.colors.backgroundSoft};

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
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const ResultTitle = styled.strong`
  display: block;
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  line-height: 1.15;
  letter-spacing: -0.05em;
  overflow-wrap: anywhere;
`;

export const ResultMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: 0;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ResultMetaItem = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.primarySoft};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    margin-bottom: 5px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    font-weight: 700;
  }

  span {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 15px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div<{ $wide?: boolean; $highlight?: boolean }>`
  min-width: 0;
  grid-column: ${({ $wide }) => ($wide ? "1 / -1" : "auto")};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.secondarySoft : theme.colors.surfaceMuted};
  border: 1px solid
    ${({ theme, $highlight }) =>
      $highlight ? theme.colors.successBorder : theme.colors.border};
`;

export const DetailLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
`;

export const DetailValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.45;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const ErrorText = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;
`;
