"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1320px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1320px);
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.accentSoft};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContent = styled.div`
  min-height: 330px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 4vw, 58px);
  border-radius: 32px;
  background:
    radial-gradient(circle at 14% 12%, rgba(200, 164, 93, 0.25), transparent 29%),
    radial-gradient(circle at 87% 16%, rgba(31, 111, 91, 0.28), transparent 35%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};

  &::after {
    content: "";
    position: absolute;
    right: -88px;
    bottom: -122px;
    width: 290px;
    height: 290px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.065);
  }
`;

export const HeaderEyebrow = styled.div`
  width: fit-content;
  position: relative;
  z-index: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 8px 13px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(38px, 4.6vw, 64px);
  line-height: 0.98;
  letter-spacing: -0.07em;
  overflow-wrap: anywhere;
`;

export const Subtitle = styled.p`
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.68;
`;

export const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 560px) {
    a {
      width: 100%;
    }
  }
`;

export const ActionLink = styled(Link)`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 13px;
  font-weight: 850;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.17);
    border-color: rgba(255, 255, 255, 0.34);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const HeaderPanel = styled.aside`
  display: grid;
  align-content: end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 32px;
  background:
    radial-gradient(circle at 18% 12%, rgba(200, 164, 93, 0.18), transparent 32%),
    ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const HeaderPanelItem = styled.div`
  min-width: 0;
  display: grid;
  gap: 6px;
`;

export const HeaderPanelLabel = styled.span`
  color: rgba(255, 255, 255, 0.56);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const HeaderPanelValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 17px;
  line-height: 1.35;
  font-weight: 850;
  overflow-wrap: anywhere;
`;

export const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const MetricLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const MetricValue = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 32px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.05em;
`;

export const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const SectionIntro = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  line-height: 1.08;
  letter-spacing: -0.05em;
`;

export const SectionSubtitle = styled.p`
  max-width: 760px;
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.55;
`;

export const DetailSectionShell = styled.article`
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const DetailSectionButton = styled.button`
  width: 100%;
  display: block;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -3px;
  }
`;

export const DetailSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  > span {
    flex: 0 0 auto;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 12px;
    font-weight: 900;
  }

  @media (max-width: 620px) {
    align-items: flex-start;
  }
`;

export const DetailSectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: -0.035em;
`;

export const DetailSectionContent = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.lg};
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div<{ $wide?: boolean }>`
  min-width: 0;
  grid-column: ${({ $wide }) => ($wide ? "span 2" : "auto")};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 560px) {
    grid-column: auto;
  }
`;

export const DetailLabel = styled.div`
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  line-height: 1.25;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const DetailValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  line-height: 1.5;
  font-weight: 650;
  overflow-wrap: anywhere;
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

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  line-height: 1.65;
`;

export const EmptyStateTitle = styled.strong`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
`;
