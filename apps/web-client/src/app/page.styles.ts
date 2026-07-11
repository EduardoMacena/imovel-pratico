"use client";

import styled from "styled-components";

export const PageShell = styled.main`
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 10% 0%, rgba(200, 164, 93, 0.14), transparent 28%),
    radial-gradient(circle at 88% 10%, rgba(15, 76, 92, 0.14), transparent 30%),
    linear-gradient(180deg, #f5f1e8 0%, #f9f6ef 100%);
`;

export const PageContainer = styled.div`
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
  grid-template-columns: minmax(0, 0.9fr) minmax(380px, 0.72fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCard = styled.header`
  min-height: 300px;
  overflow: hidden;
  position: relative;
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 12%, rgba(200, 164, 93, 0.22), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.28), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  box-shadow: ${({ theme }) => theme.shadows.card};
  color: ${({ theme }) => theme.colors.textInverted};

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

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 720px;
  padding: clamp(32px, 4vw, 54px);
`;

export const HeroEyebrow = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: 8px 13px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.10);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.success};
  }
`;

export const HeroTitle = styled.h1`
  max-width: 680px;
  margin: 0;
  font-size: clamp(34px, 4vw, 52px);
  line-height: 1;
  letter-spacing: -0.07em;
`;

export const HeroSubtitle = styled.p`
  max-width: 660px;
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

export const PrimaryLink = styled.a`
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

export const SecondaryLink = styled.a`
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

export const UsageCard = styled.aside`
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 14%, rgba(200, 164, 93, 0.18), transparent 30%),
    ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: inherit;
  font-size: 24px;
  line-height: 1.08;
  letter-spacing: -0.05em;
`;

export const PanelSubtitle = styled.p`
  margin: 7px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.5;

  ${UsageCard} & {
    color: rgba(255, 255, 255, 0.56);
  }
`;

export const StatusPill = styled.div<{ $active: boolean }>`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 11px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $active }) =>
    $active ? "rgba(35, 122, 87, 0.16)" : "rgba(164, 107, 0, 0.16)"};
  color: ${({ $active }) => ($active ? "#9de8c3" : "#f0c36a")};
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(80, 214, 145, 0.18)" : "rgba(200, 164, 93, 0.28)"};
  font-size: 12px;
  font-weight: 700;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${({ $active }) => ($active ? "#50d691" : "#c8a45d")};
  }
`;

export const UsageMetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const UsageMetric = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.10);

  span {
    color: rgba(255, 255, 255, 0.58);
    display: block;
    font-size: 12px;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textInverted};
    font-size: 29px;
    line-height: 1;
    letter-spacing: -0.06em;
  }
`;

export const UsageBar = styled.div`
  height: 10px;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.12);
`;

export const UsageBarFill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => $percentage}%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.secondary}
  );
`;

export const UsageFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
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
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 48px rgba(11, 31, 51, 0.08);
`;

export const MetricLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const MetricValue = styled.strong`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 32px;
  line-height: 1;
  letter-spacing: -0.06em;
`;

export const MetricHint = styled.span`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.45;
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 360px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.section`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const PanelCard = styled.section`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const ChartList = styled.div`
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
    font-size: 16px;
  }
`;

export const BarLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 700;
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

export const RecentList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const RecentItem = styled.article`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const RecentContent = styled.div`
  min-width: 0;
`;

export const RecentAddress = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

export const RecentDate = styled.span`
  display: block;
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export const SideColumn = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const PlanCard = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.12), transparent 32%),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const PlanGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PlanLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 700;
`;

export const PlanValue = styled.strong`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.45;
  font-weight: 500;
`;

export const ActionCard = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};
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
`;

export const ActionLink = styled.a`
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.accent};
  font-size: 14px;
  font-weight: 950;
  text-decoration: none;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  line-height: 1.65;
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
