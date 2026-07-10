"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1220px, calc(100% - 32px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1220px);
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

export const HeaderPanel = styled.aside`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top right, rgba(31, 111, 91, 0.13), transparent 34%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const HeaderPanelLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 850;
`;

export const HeaderPanelValue = styled.strong`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 56px;
  line-height: 1;
  letter-spacing: -0.08em;
`;

export const IndicatorGrid = styled.div`
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

export const IndicatorCard = styled.div`
  min-width: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.9)),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const IndicatorLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.35;
  font-weight: 850;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const IndicatorValue = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 34px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.06em;
`;

export const QuickActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const QuickAction = styled(Link)`
  min-width: 0;
  display: block;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.12), transparent 34%),
    ${({ theme }) => theme.colors.surface};
  color: inherit;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

export const QuickActionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

export const QuickActionDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.section`
  min-width: 0;
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

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.04em;
`;

export const SectionSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const SectionLink = styled(Link)`
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

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ClientItem = styled.article`
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

export const TaskItem = styled.article`
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

export const ItemTop = styled.div`
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 560px) {
    flex-direction: column;
  }
`;

export const ItemTitle = styled.strong`
  display: block;
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  line-height: 1.25;
  overflow-wrap: anywhere;
`;

export const ItemMuted = styled.div`
  min-width: 0;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.4;
  overflow-wrap: anywhere;
`;

export const TaskInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 850;
`;

export const InfoValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  line-height: 1.35;
  font-weight: 900;
  margin-top: 4px;
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
  border-radius: ${({ theme }) => theme.radii.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background:
    radial-gradient(circle at top, rgba(200, 164, 93, 0.1), transparent 34%),
    ${({ theme }) => theme.colors.surface};
  line-height: 1.6;
`;

export const EmptyStateTitle = styled.strong`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
`;

export const TaskLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;