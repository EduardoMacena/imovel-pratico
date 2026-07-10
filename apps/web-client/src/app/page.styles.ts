"use client";

import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1280px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1280px);
  }
`;

export const HeroGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(380px, 0.85fr);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroContent = styled.header`
  min-height: 315px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.2), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #102b45);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 230px;
    height: 230px;
    right: -96px;
    bottom: -110px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 720px) {
    min-height: auto;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const ProductBadge = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 720px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(36px, 4.1vw, 58px);
  line-height: 0.98;
  letter-spacing: -0.06em;
  position: relative;
  z-index: 1;

  @media (max-width: 720px) {
    font-size: 38px;
  }
`;

export const Subtitle = styled.p`
  max-width: 680px;
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 16px;
  line-height: 1.7;
  position: relative;
  z-index: 1;
`;

export const HeaderActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

export const HeaderLink = styled.a`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textInverted};
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 900;
  font-size: 14px;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.34);
  }
`;

export const HeroPanel = styled.aside`
  min-height: 315px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.9)),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at top right, rgba(31, 111, 91, 0.13), transparent 34%),
      radial-gradient(circle at bottom left, rgba(200, 164, 93, 0.14), transparent 34%);
    pointer-events: none;
  }

  @media (max-width: 1040px) {
    min-height: auto;
  }
`;

export const HeroPanelContent = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 1;
`;

export const HeroPanelEyebrow = styled.div`
  width: fit-content;
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.secondarySoft};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const HeroPanelText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  line-height: 1.38;
  letter-spacing: -0.04em;
  font-weight: 900;
`;

export const HeroPanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const HeroPanelItem = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: 13px ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(255, 255, 255, 0.66);
`;

export const HeroPanelLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 800;
`;

export const HeroPanelValue = styled.strong`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 950;
  text-align: right;
  overflow-wrap: anywhere;
`;

export const MainGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  min-width: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 96px;

  @media (max-width: 1120px) {
    position: static;
  }
`;

export const SearchCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const SearchTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 27px;
  line-height: 1.1;
  letter-spacing: -0.04em;
`;

export const SearchDescription = styled.p`
  max-width: 620px;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
`;

export const SearchCardBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const SearchForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

export const InlineHint = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.5;
`;

export const TaskId = styled.span`
  width: fit-content;
  max-width: 100%;
  display: inline-flex;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  word-break: break-all;
`;

export const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  font-size: 14px;
  line-height: 1.6;
`;

export const ProgressWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundSoft};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  background:
    radial-gradient(circle at top, rgba(200, 164, 93, 0.1), transparent 34%),
    ${({ theme }) => theme.colors.surfaceMuted};
  line-height: 1.65;
`;

export const ResultsSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
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
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  letter-spacing: -0.04em;
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
`;

export const SidebarCard = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const SidebarTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  letter-spacing: -0.03em;
`;

export const SidebarDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.65;
`;

export const SidebarList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  padding: 0;
  list-style: none;
`;

export const SidebarListItem = styled.li`
  position: relative;
  padding-left: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.55;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    position: absolute;
    left: 0;
    top: 7px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.accentSoft};
  }
`;