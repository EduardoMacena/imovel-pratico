"use client";

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

export const Header = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContent = styled.div`
  min-width: 0;
  min-height: 280px;
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

export const Subtitle = styled.p`
  max-width: 680px;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.68;
  position: relative;
  z-index: 1;
`;

export const HeaderActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 1;
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

export const HeaderPanel = styled.aside`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(46px, 6vw, 78px);
  line-height: 1;
  letter-spacing: -0.08em;
`;

export const HeaderPanelGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
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

export const StatGrid = styled.section`
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

export const StatCard = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 48px rgba(11, 31, 51, 0.08);
`;

export const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const StatValue = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 32px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.06em;
`;

export const StatHint = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.45;
`;

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Item = styled.article`
  min-width: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: ${({ theme }) => theme.spacing.lg};
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

export const ItemTop = styled.div`
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

export const ItemMeta = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const Address = styled.strong`
  display: block;
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  line-height: 1.22;
  letter-spacing: -0.05em;
  overflow-wrap: anywhere;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.8fr 0.7fr 1fr;
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
  margin-bottom: 6px;
  font-weight: 900;
`;

export const InfoValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.35;
  font-weight: 950;
  overflow-wrap: anywhere;
`;

export const ItemFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 560px) {
    justify-content: stretch;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const DetailsLink = styled.a`
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.button};

  @media (max-width: 560px) {
    width: 100%;
  }
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
