"use client";

import styled from "styled-components";

export const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]} 20px;
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const ProductBadge = styled.div`
  display: inline-flex;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 700;
`;

export const Title = styled.h1`
  font-size: 38px;
  line-height: 1.1;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 720px) {
    font-size: 30px;
  }
`;

export const Subtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 16px;
  line-height: 1.6;
  max-width: 720px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Actions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

export const TaskId = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  word-break: break-all;
`;

export const ErrorBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
`;

export const ResultsSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ResultsTitle = styled.h2`
  margin: 0;
  font-size: 22px;
`;

export const ResultsCount = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export const ResultsList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const EmptyState = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;
