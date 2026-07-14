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
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCard = styled.header`
  min-height: 270px;
  overflow: hidden;
  position: relative;
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 12%, rgba(200, 164, 93, 0.22), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.28), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  box-shadow: ${({ theme }) => theme.shadows.card};
  color: ${({ theme }) => theme.colors.textInverted};
`;

export const HeroContent = styled.div`
  max-width: 760px;
  padding: clamp(30px, 4vw, 54px);
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
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const HeroTitle = styled.h1`
  max-width: 720px;
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

export const HeaderLink = styled.a`
  display: inline-flex;
  min-height: 42px;
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
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const HeroPanelGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const HeroPanelItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.10);
`;

export const HeroPanelLabel = styled.span`
  display: block;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  font-weight: 700;
`;

export const HeroPanelValue = styled.strong`
  display: block;
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 22px;
  letter-spacing: -0.05em;
`;

export const MainGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 96px;

  @media (max-width: 1080px) {
    position: static;
  }
`;

export const OperationCard = styled.section`
  overflow: hidden;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const OperationCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.12), transparent 32%),
    ${({ theme }) => theme.colors.backgroundSoft};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const OperationEyebrow = styled.div`
  width: fit-content;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const OperationTitle = styled.h2`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1;
  letter-spacing: -0.06em;
`;

export const OperationDescription = styled.p`
  max-width: 660px;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
`;

export const OperationCardBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const OperationForm = styled.form`
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
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
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
  padding: 9px 13px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 700;
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

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  line-height: 1.65;
`;

export const ProgressWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundSoft};
`;

export const ResultsSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 30px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const ResultsHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundSoft};
`;

export const ResultsTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
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

export const SidebarCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 26px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 50px rgba(11, 31, 51, 0.08);
`;

export const SidebarTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  letter-spacing: -0.04em;
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

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(7, 25, 39, 0.62);
  backdrop-filter: blur(8px);
`;

export const ModalCard = styled.div`
  width: min(560px, 100%);
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const ModalEyebrow = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 7px 11px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.warningBg};
  color: ${({ theme }) => theme.colors.warning};
  border: 1px solid ${({ theme }) => theme.colors.warningBorder};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.05em;
`;

export const ModalText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.65;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.lg} 0;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const ModalInfo = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    margin-bottom: 5px;
  }

  span {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 17px;
    font-weight: 750;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 520px) {
    button {
      width: 100%;
    }
  }
`;

export const PreviewCard = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.10), transparent 32%),
    ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const PreviewTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: -0.04em;
`;

export const PreviewSubtitle = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.55;
  font-size: 14px;
`;

export const PreviewBadge = styled.div`
  width: fit-content;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
  font-size: 12px;
  font-weight: 900;
`;

export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const PreviewInfo = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    margin-bottom: 5px;
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
    font-weight: 800;
    overflow-wrap: anywhere;
  }
`;

export const PreviewList = styled.div`
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow: auto;
  padding-right: 4px;
`;

export const PreviewListItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 520px) {
    flex-direction: column;
    gap: 4px;
  }
`;

export const ModalCancelButton = styled.button`
  min-height: 46px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.textInverted};
    box-shadow: 0 14px 28px rgba(180, 35, 24, 0.18);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.58;
    transform: none;
    box-shadow: none;
  }
`;

export const ModalConfirmButton = styled.button`
  min-height: 46px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textInverted};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  box-shadow: ${({ theme }) => theme.shadows.button};
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.secondaryHover};
    border-color: ${({ theme }) => theme.colors.secondaryHover};
    box-shadow: 0 16px 32px rgba(31, 111, 91, 0.22);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.58;
    transform: none;
    box-shadow: none;
  }
`;


export const PreviewStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.md};
`;


export const PreviewStatusBadge = styled.div<{ $variant?: "success" | "warning" | "danger" | "info" }>`
  width: fit-content;
  padding: 7px 11px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12px;
  font-weight: 950;
  border: 1px solid ${({ theme, $variant }) => {
    if ($variant === "success") return theme.colors.successBorder;
    if ($variant === "warning") return theme.colors.warningBorder;
    if ($variant === "danger") return theme.colors.dangerBorder;
    return theme.colors.infoBorder;
  }};
  color: ${({ theme, $variant }) => {
    if ($variant === "success") return theme.colors.success;
    if ($variant === "warning") return theme.colors.warning;
    if ($variant === "danger") return theme.colors.danger;
    return theme.colors.info;
  }};
  background: ${({ theme, $variant }) => {
    if ($variant === "success") return theme.colors.successBg;
    if ($variant === "warning") return theme.colors.warningBg;
    if ($variant === "danger") return theme.colors.dangerBg;
    return theme.colors.infoBg;
  }};
`;


export const PreviewActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.md};
`;


export const PendingPreviewList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;


export const PendingPreviewItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1.35;
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
    line-height: 1.45;
  }
`;


export const PendingPreviewActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;


export const SmallActionButton = styled.button`
  min-height: 34px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textInverted};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 950;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;


export const SmallDangerButton = styled.button`
  min-height: 34px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  font-size: 12px;
  font-weight: 950;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
