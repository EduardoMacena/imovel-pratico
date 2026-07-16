"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageShell = styled.main`
  min-height: calc(100vh - 76px);
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

export const HeroGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCard = styled.header`
  min-height: 320px;
  overflow: hidden;
  position: relative;
  border-radius: 32px;
  background:
    radial-gradient(circle at 16% 12%, rgba(200, 164, 93, 0.24), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.32), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  box-shadow: ${({ theme }) => theme.shadows.dark};
  color: ${({ theme }) => theme.colors.textInverted};

  &::after {
    content: "";
    position: absolute;
    right: -90px;
    bottom: -120px;
    width: 280px;
    height: 280px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding: clamp(34px, 4vw, 58px);
`;

export const HeroEyebrow = styled.div`
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
`;

export const HeroTitle = styled.h1`
  max-width: 760px;
  margin: 0;
  font-size: clamp(38px, 4.6vw, 64px);
  line-height: 0.97;
  letter-spacing: -0.08em;
`;

export const HeroSubtitle = styled.p`
  max-width: 680px;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.68;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const PrimaryLink = styled(Link)`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  box-shadow: ${({ theme }) => theme.shadows.button};
  font-size: 14px;
  font-weight: 950;
  text-decoration: none;
`;

export const SecondaryLink = styled(Link)`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textInverted};
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 14px;
  font-weight: 950;
  text-decoration: none;
`;

export const HeroPanel = styled.aside`
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 32px;
  background:
    radial-gradient(circle at 16% 14%, rgba(200, 164, 93, 0.18), transparent 30%),
    ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const HeroPanelHeader = styled.div``;

export const HeroPanelTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.06em;
`;

export const HeroPanelSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 14px;
  line-height: 1.55;
`;

export const HeroPanelMetricGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const HeroPanelMetric = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.10);

  span {
    display: block;
    color: rgba(255, 255, 255, 0.58);
    font-size: 12px;
    font-weight: 800;
  }

  strong {
    display: block;
    margin-top: 7px;
    color: ${({ theme }) => theme.colors.textInverted};
    font-size: 30px;
    line-height: 1;
    letter-spacing: -0.06em;
  }
`;

export const HeroPanelFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  line-height: 1.5;
`;

export const MetricGrid = styled.section`
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

export const MetricCard = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 48px rgba(11, 31, 51, 0.08);
`;

export const MetricLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const MetricValue = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 34px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
`;

export const MetricHint = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.45;
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const SideColumn = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const PanelCard = styled.section`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  line-height: 1.08;
  letter-spacing: -0.05em;
`;

export const PanelSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const BarList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const BarRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const BarInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 15px;
    font-weight: 700;
  }
`;

export const BarLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
`;

export const BarTrack = styled.div`
  overflow: hidden;
  height: 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
`;

export const BarFill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => $percentage}%;
  min-width: 8px;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.accent}
  );
`;

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ClientItem = styled.article`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const ItemTitle = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 17px;
  line-height: 1.25;
  font-weight: 750;
`;

export const ItemMuted = styled.span`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  margin-bottom: 6px;
  font-weight: 700;
`;

export const InfoValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.45;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const ClientLink = styled(Link)`
  flex: 0 0 auto;
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
`;

export const TaskLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const ActionCard = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.16), transparent 32%),
    ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};
`;

export const ActionTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.04em;
`;

export const ActionDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
  line-height: 1.6;
`;

export const ActionGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};

  a {
    width: 100%;
  }
`;

export const RecentList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const RecentItem = styled.article`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const RecentContent = styled.div`
  min-width: 0;
`;

export const RecentAddress = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.35;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

export const RecentDate = styled.span`
  display: block;
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  line-height: 1.65;
`;

export const EmptyStateTitle = styled.strong`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
`;

export const ErrorBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;
`;
