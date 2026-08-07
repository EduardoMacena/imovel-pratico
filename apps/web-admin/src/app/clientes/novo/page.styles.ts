"use client";

import Link from "next/link";
import styled, { css } from "styled-components";

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
  min-height: 40px;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 850;
  text-decoration: none;
`;

export const Hero = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroMain = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 4vw, 56px);
  border-radius: 32px;
  background:
    radial-gradient(
      circle at 16% 12%,
      rgba(200, 164, 93, 0.24),
      transparent 30%
    ),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};
`;

export const Eyebrow = styled.div`
  width: fit-content;
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
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(38px, 4.7vw, 64px);
  line-height: 0.98;
  letter-spacing: -0.075em;
`;

export const Subtitle = styled.p`
  max-width: 760px;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: 15px;
  line-height: 1.7;
`;

export const HeroSide = styled.aside`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 32px;
  background: ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};
`;

export const SideItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SideLabel = styled.div`
  color: rgba(255, 255, 255, 0.56);
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 7px;
`;

export const SideValue = styled.strong`
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 15px;
  line-height: 1.4;
`;

export const Progress = styled.div`
  height: 7px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(11, 31, 51, 0.1);
`;

export const ProgressValue = styled.div<{ $value: number }>`
  width: ${({ $value }) => `${$value}%`};
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
`;

export const Layout = styled.section`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Steps = styled.nav`
  position: sticky;
  top: 96px;
  display: grid;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 26px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: 980px) {
    position: static;
    grid-template-columns: repeat(5, minmax(145px, 1fr));
    overflow-x: auto;
  }
`;

export const StepButton = styled.button<{
  $active: boolean;
  $complete: boolean;
}>`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 11px;
  border-radius: 17px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.borderStrong : "transparent"};
  background: ${({ theme, $active, $complete }) =>
    $active
      ? theme.colors.primarySoft
      : $complete
        ? theme.colors.successBg
        : "transparent"};
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.64;
  }
`;

export const StepNumber = styled.span<{ $complete: boolean }>`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: ${({ theme, $complete }) =>
    $complete ? theme.colors.success : theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 12px;
  font-weight: 950;
`;

export const StepText = styled.span`
  display: grid;
  gap: 2px;

  strong {
    font-size: 13px;
  }

  small {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 11px;
  }
`;

export const Panel = styled.div`
  min-width: 0;
  padding: clamp(24px, 4vw, 42px);
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const PanelHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  span {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 12px;
    font-weight: 950;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  h2 {
    margin: 7px 0 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: clamp(28px, 4vw, 42px);
    line-height: 1.04;
    letter-spacing: -0.06em;
  }

  p {
    max-width: 780px;
    margin: 10px 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    line-height: 1.7;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Full = styled.div`
  grid-column: 1 / -1;
`;

export const FormSectionTitle = styled.h3`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.035em;
`;

export const FormSectionHint = styled.p`
  max-width: 760px;
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.6;
`;

export const Hint = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.55;
`;

export const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const SelectionCard = styled.button<{ $selected: boolean }>`
  display: grid;
  gap: 9px;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 21px;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primarySoft : theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
  cursor: pointer;

  strong {
    font-size: 17px;
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
    line-height: 1.55;
  }
`;

export const Notice = styled.div<{ $warning?: boolean; $success?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 17px;
  color: ${({ theme, $warning, $success }) =>
    $warning
      ? "#92400e"
      : $success
        ? theme.colors.success
        : theme.colors.primary};
  background: ${({ theme, $warning, $success }) =>
    $warning
      ? "rgba(245, 158, 11, 0.11)"
      : $success
        ? theme.colors.successBg
        : theme.colors.primarySoft};
  border: 1px solid
    ${({ theme, $warning, $success }) =>
      $warning
        ? "rgba(245, 158, 11, 0.28)"
        : $success
          ? theme.colors.successBorder
          : theme.colors.border};
  font-size: 13px;
  line-height: 1.65;
`;

export const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 18px;
  }

  dl {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr);
    gap: 8px 12px;
    margin: 0;
  }

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    font-weight: 800;
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 13px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
`;

export const ErrorBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.65;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 26px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  line-height: 1.65;

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 18px;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 560px) {
    button,
    a {
      width: 100%;
    }
  }
`;

export const Success = styled.section`
  padding: clamp(30px, 5vw, 54px);
  border-radius: 32px;
  background:
    radial-gradient(
      circle at top right,
      rgba(200, 164, 93, 0.2),
      transparent 30%
    ),
    linear-gradient(145deg, ${({ theme }) => theme.colors.primary}, #071927);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};

  h2 {
    max-width: 800px;
    margin: ${({ theme }) => theme.spacing.md} 0 0;
    color: ${({ theme }) => theme.colors.textInverted};
    font-size: clamp(34px, 5vw, 56px);
    line-height: 1;
    letter-spacing: -0.07em;
  }

  > p {
    max-width: 760px;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.7;
  }
`;

export const SuccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const SuccessItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.11);

  small {
    display: block;
    margin-bottom: 7px;
    color: rgba(255, 255, 255, 0.55);
  }

  strong {
    color: ${({ theme }) => theme.colors.textInverted};
    line-height: 1.45;
  }
`;

export const SuccessActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const ActionLink = styled(Link)<{ $primary?: boolean }>`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;

  ${({ theme, $primary }) =>
    $primary
      ? css`
          color: ${theme.colors.primary};
          background: ${theme.colors.accent};
          border: 1px solid ${theme.colors.accent};
        `
      : css`
          color: ${theme.colors.textInverted};
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
        `}
`;
