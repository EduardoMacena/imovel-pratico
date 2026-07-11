"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageShell = styled.main`
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 10% 0%, rgba(200, 164, 93, 0.14), transparent 28%),
    radial-gradient(circle at 88% 10%, rgba(15, 76, 92, 0.14), transparent 30%),
    linear-gradient(180deg, #f5f1e8 0%, #f9f6ef 100%);
`;

export const PageContainer = styled.main`
  width: min(1320px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1320px);
  }
`;

export const TopBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const BackLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 950;
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContent = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(32px, 4vw, 54px);
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 12%, rgba(200, 164, 93, 0.22), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.28), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: -90px;
    bottom: -120px;
    width: 260px;
    height: 260px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
  }
`;

export const HeaderEyebrow = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 8px 13px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.10);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
`;

export const Title = styled.h1`
  max-width: 720px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(34px, 4vw, 54px);
  line-height: 1;
  letter-spacing: -0.07em;
  position: relative;
  z-index: 1;
`;

export const TaskId = styled.div`
  width: fit-content;
  max-width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textInverted};
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 850;
  word-break: break-all;
  position: relative;
  z-index: 1;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

export const HeaderPanel = styled.aside`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 14%, rgba(200, 164, 93, 0.18), transparent 30%),
    ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const HeaderPanelLabel = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const HeaderPanelValue = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 28px;
  line-height: 1;
`;

export const StatusPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const HeaderPanelGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderPanelItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.10);

  span {
    display: block;
    color: rgba(255, 255, 255, 0.56);
    font-size: 12px;
    font-weight: 900;
  }

  strong {
    display: block;
    margin-top: 7px;
    color: ${({ theme }) => theme.colors.textInverted};
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.06em;
  }
`;

export const IntelligenceGrid = styled.section`
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 0.95fr 0.95fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

export const IntelligenceCard = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 48px rgba(11, 31, 51, 0.08);
`;

export const IntelligenceLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const IntelligenceValue = styled.strong`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 17px;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

export const SectionCard = styled.section`
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.12), transparent 32%),
    ${({ theme }) => theme.colors.backgroundSoft};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  line-height: 1.08;
  letter-spacing: -0.05em;
`;

export const SectionSubtitle = styled.p`
  max-width: 680px;
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryBox = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const SummaryLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  margin-bottom: 6px;
  font-weight: 900;
`;

export const SummaryValue = styled.div`
  min-width: 0;
  font-size: 16px;
  line-height: 1.35;
  font-weight: 950;
  color: ${({ theme }) => theme.colors.primary};
  overflow-wrap: anywhere;
`;

export const ProgressPanel = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.10), transparent 32%),
    ${({ theme }) => theme.colors.backgroundSoft};
`;

export const ExportActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ErrorBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;

  ${SectionCard} & {
    margin: 0 ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  }
`;

export const ResultsSection = styled.section`
  overflow: hidden;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top left, rgba(15, 76, 92, 0.10), transparent 36%),
    ${({ theme }) => theme.colors.backgroundSoft};

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ResultsTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  line-height: 1.1;
  letter-spacing: -0.05em;
`;

export const ResultsCount = styled.span`
  display: block;
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export const ResultsList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 28px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  line-height: 1.6;

  ${ResultsSection} & {
    margin: ${({ theme }) => theme.spacing.xl};
  }
`;
