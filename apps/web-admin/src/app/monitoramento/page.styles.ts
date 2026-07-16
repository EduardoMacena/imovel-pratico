"use client";

import Link from "next/link";
import styled, { css } from "styled-components";

export const PageShell = styled.main`
  min-height: calc(100vh - 76px);
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
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCard = styled.header`
  min-height: 260px;
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
  max-width: 780px;
  padding: clamp(30px, 4vw, 50px);
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
  font-size: clamp(34px, 4.2vw, 58px);
  line-height: 0.98;
  letter-spacing: -0.08em;
`;

export const HeroSubtitle = styled.p`
  max-width: 680px;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.68;
`;

export const HeroPanel = styled.aside`
  min-height: 260px;
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

export const HealthStatus = styled.div<{ $status: string }>`
  width: fit-content;
  padding: 9px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  ${({ $status }) =>
    $status === "OPERACIONAL"
      ? css`
          color: #dcfce7;
          background: rgba(34, 197, 94, 0.16);
          border: 1px solid rgba(34, 197, 94, 0.28);
        `
      : css`
          color: #fef3c7;
          background: rgba(245, 158, 11, 0.16);
          border: 1px solid rgba(245, 158, 11, 0.28);
        `}
`;

export const HeroPanelTitle = styled.h2`
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.07em;
`;

export const HeroPanelSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  line-height: 1.55;
`;

export const UpdatedAt = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: rgba(255, 255, 255, 0.56);
  font-size: 12px;
`;

export const FilterCard = styled.section`
  display: grid;
  grid-template-columns: minmax(220px, 1.2fr) minmax(160px, 0.7fr) minmax(180px, 0.8fr) minmax(220px, 1fr) auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: grid;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 900;
`;

export const Select = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.82);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 750;
  outline: none;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.82);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 650;
  outline: none;
`;

export const RefreshButton = styled.button`
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;

  &:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }
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

export const MetricCard = styled.article`
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

export const ContentGrid = styled.section`
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

export const Badge = styled.span<{ $variant?: "success" | "warning" | "error" | "neutral" }>`
  width: fit-content;
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  ${({ $variant }) => {
    if ($variant === "success") {
      return css`
        color: #166534;
        background: rgba(34, 197, 94, 0.14);
        border: 1px solid rgba(34, 197, 94, 0.22);
      `;
    }

    if ($variant === "warning") {
      return css`
        color: #92400e;
        background: rgba(245, 158, 11, 0.14);
        border: 1px solid rgba(245, 158, 11, 0.22);
      `;
    }

    if ($variant === "error") {
      return css`
        color: #991b1b;
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.20);
      `;
    }

    return css`
      color: #334155;
      background: rgba(148, 163, 184, 0.14);
      border: 1px solid rgba(148, 163, 184, 0.22);
    `;
  }}
`;

export const WorkerList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const WorkerItem = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`;

export const ItemTitle = styled.h3`
  min-width: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.2;
  overflow-wrap: anywhere;
`;

export const ItemMuted = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

export const QueueGroup = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const QueueGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const QueueCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  background: rgba(244, 241, 234, 0.72);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const QueueCounts = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const CountBox = styled.div`
  padding: 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.78);

  span {
    display: block;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 18px;
    line-height: 1;
  }
`;

export const EventList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const EventItem = styled.article<{ $level: string }>`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid ${({ theme }) => theme.colors.border};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 18px;
    bottom: 18px;
    width: 4px;
    border-radius: 999px;
    background: ${({ $level, theme }) =>
      $level === "ERROR"
        ? "#ef4444"
        : $level === "WARN"
          ? "#f59e0b"
          : theme.colors.secondary};
  }
`;

export const EventMessage = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  font-weight: 850;
  line-height: 1.35;
`;

export const EventMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.4;
`;

export const EventDetails = styled.pre`
  max-height: 180px;
  overflow: auto;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 16px;
  background: rgba(11, 31, 51, 0.06);
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const EmptyTitle = styled.h3`
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  letter-spacing: -0.03em;
`;

export const ErrorBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: rgba(239, 68, 68, 0.10);
  border: 1px solid rgba(239, 68, 68, 0.18);
  color: #991b1b;
  font-size: 14px;
  font-weight: 750;
`;

export const TaskLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 900;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
