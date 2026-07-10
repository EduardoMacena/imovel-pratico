"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1220px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1220px);
  }
`;

export const BackLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.surfaceMuted};
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContent = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.2), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #102b45);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const HeaderEyebrow = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 760px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(38px, 5vw, 60px);
  line-height: 0.98;
  letter-spacing: -0.06em;
`;

export const Subtitle = styled.p`
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 16px;
  line-height: 1.7;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const ActionButton = styled.button`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    opacity 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.34);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const DangerButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.danger};
  border-color: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.textInverted};

  &:hover:not(:disabled) {
    background: #7f1d1d;
    border-color: #7f1d1d;
  }
`;

export const HeaderPanel = styled.aside`
  min-width: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top right, rgba(31, 111, 91, 0.13), transparent 34%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const HeaderPanelItem = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const HeaderPanelLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 850;
  margin-bottom: 8px;
`;

export const HeaderPanelValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 26px;
  line-height: 1.1;
  font-weight: 950;
  letter-spacing: -0.05em;
  overflow-wrap: anywhere;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryBox = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const SummaryLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 850;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SummaryValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  line-height: 1.25;
  font-weight: 950;
  overflow-wrap: anywhere;
`;

export const ProgressPanel = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.1), transparent 32%),
    ${({ theme }) => theme.colors.backgroundSoft};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 900;

  span {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.accent}
  );
  transition: width 0.3s ease;
`;

export const Section = styled.section`
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.9)),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  line-height: 1.1;
  letter-spacing: -0.04em;
`;

export const SectionSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const ResultList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ResultItem = styled.article`
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(circle at top right, rgba(31, 111, 91, 0.08), transparent 28%),
    ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
`;

export const ResultTop = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    flex-direction: column;
  }
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
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const ResultMetaItem = styled.span`
  display: inline-flex;
  max-width: 100%;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;
  font-weight: 850;
  overflow-wrap: anywhere;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 0.8fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 850;
  margin-bottom: 6px;
`;

export const InfoValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.35;
  font-weight: 900;
  overflow-wrap: anywhere;
`;

export const ErrorBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;
`;

export const SuccessBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
  line-height: 1.6;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background:
    radial-gradient(circle at top, rgba(200, 164, 93, 0.1), transparent 34%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  line-height: 1.6;
`;

export const EmptyStateTitle = styled.strong`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
`;