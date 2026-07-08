"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]} 20px;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  font-weight: 700;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
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
  margin: 0;
  font-size: 34px;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.danger};

  &:hover:not(:disabled) {
    background: #7f1d1d;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

export const SummaryLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const SummaryValue = styled.div`
  font-size: 18px;
  font-weight: 900;
  word-break: break-word;
`;

export const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: 22px;
`;

export const ResultList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ResultItem = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const ResultTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const ResultTitle = styled.strong`
  font-size: 16px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export const InfoValue = styled.div`
  font-weight: 800;
  margin-top: 2px;
  word-break: break-word;
`;

export const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SuccessBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
`;
