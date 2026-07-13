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

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContent = styled.div`
  min-height: 300px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 4vw, 58px);
  border-radius: 32px;
  background:
    radial-gradient(circle at 16% 12%, rgba(200, 164, 93, 0.24), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.32), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};

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

export const HeaderEyebrow = styled.div`
  width: fit-content;
  position: relative;
  z-index: 1;
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

export const Title = styled.h1`
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(38px, 4.6vw, 64px);
  line-height: 0.97;
  letter-spacing: -0.08em;
`;

export const Subtitle = styled.p`
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.68;
`;

export const HeaderPanel = styled.aside`
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 32px;
  background:
    radial-gradient(circle at 16% 14%, rgba(200, 164, 93, 0.18), transparent 30%),
    ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const HeaderPanelLabel = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const HeaderPanelValue = styled.strong`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 62px;
  line-height: 1;
  letter-spacing: -0.08em;
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
  line-height: 1.35;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const StatValue = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 34px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 390px minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  position: sticky;
  top: 96px;

  @media (max-width: 1120px) {
    position: static;
  }
`;

export const FormHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const FormTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  line-height: 1.08;
  letter-spacing: -0.05em;
`;

export const FormSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const ListTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  line-height: 1.08;
  letter-spacing: -0.05em;
`;

export const ListSubtitle = styled.p`
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ClientItem = styled.article`
  min-width: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.08), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.88)),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow:
    ${({ theme }) => theme.shadows.card},
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
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

export const ClientTop = styled.div`
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

export const ClientName = styled.strong`
  display: block;
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  line-height: 1.18;
  font-weight: 760;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
`;

export const ClientMeta = styled.div`
  min-width: 0;
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 1180px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 6px;
`;

export const InfoValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.45;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 560px) {
    a,
    button {
      width: 100%;
    }
  }
`;

export const DetailsLink = styled(Link)`
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  font-size: 13px;
  font-weight: 850;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textInverted};
    box-shadow: ${({ theme }) => theme.shadows.button};
  }
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
