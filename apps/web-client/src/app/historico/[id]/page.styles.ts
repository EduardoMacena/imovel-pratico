"use client";

import Link from "next/link";
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

export const BackLink = styled(Link)`
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const TitleGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Title = styled.h1`
  font-size: 34px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.6;
  margin: 0;
`;

export const TaskId = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  word-break: break-all;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryBox = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const SummaryLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  margin-bottom: 6px;
`;

export const SummaryValue = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
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
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
`;
