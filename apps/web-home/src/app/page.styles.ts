"use client";

import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -14px, 0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.62;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
`;

const scan = keyframes`
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(120%);
  }
`;

export const PageShell = styled.main`
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 0%, rgba(200, 164, 93, 0.20), transparent 30%),
    radial-gradient(circle at 92% 12%, rgba(15, 76, 92, 0.18), transparent 34%),
    ${({ theme }) => theme.colors.background};
`;

export const ProgressBar = styled.div`
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: 3px;
  background: transparent;
`;

export const ProgressFill = styled(motion.div)`
  width: 100%;
  height: 100%;
  transform-origin: 0%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.secondary}
  );
`;

export const FloatingNav = styled.header`
  position: fixed;
  top: 18px;
  left: 0;
  right: 0;
  z-index: 90;
  padding: 0 22px;
  pointer-events: none;
`;

export const NavInner = styled.nav`
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.50);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 60px rgba(11, 31, 51, 0.10);
  backdrop-filter: blur(18px);
  pointer-events: auto;

  @media (max-width: 820px) {
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`;

export const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: max-content;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 950;
  text-decoration: none;
  letter-spacing: -0.04em;
`;

export const BrandMark = styled.span`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background:
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 14px 32px rgba(11, 31, 51, 0.18);
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 850;

  a {
    text-decoration: none;
    transition:
      color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      transform: translateY(-1px);
    }
  }

  @media (max-width: 940px) {
    display: none;
  }
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const NavGhost = styled.a`
  min-width: max-content;
  padding: 11px 16px;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 950;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 620px) {
    display: none;
  }
`;

export const NavPrimary = styled.a`
  min-width: max-content;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 13px;
  font-weight: 950;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.button};
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const Section = styled.section`
  width: min(1180px, calc(100% - 44px));
  margin: 0 auto;
`;

export const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 148px 0 92px;
  display: grid;
  align-items: center;

  @media (max-width: 920px) {
    padding-top: 132px;
  }
`;

export const HeroGrid = styled(Section)`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 0.9fr);
  gap: 64px;
  align-items: center;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroContent = styled.div`
  max-width: 740px;
`;

export const Overline = styled(motion.div)`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: 9px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(200, 164, 93, 0.34);
  box-shadow: 0 18px 42px rgba(11, 31, 51, 0.08);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.success};
    box-shadow: 0 0 0 6px rgba(35, 122, 87, 0.12);
  }
`;

export const HeroTitle = styled(motion.h1)`
  max-width: 780px;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: clamp(48px, 7vw, 92px);
  line-height: 0.91;
  letter-spacing: -0.085em;
`;

export const GradientText = styled.span`
  display: inline-block;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.accent}
  );
  background-clip: text;
  color: transparent;
`;

export const HeroDescription = styled(motion.p)`
  max-width: 640px;
  margin: 28px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(17px, 2vw, 21px);
  line-height: 1.72;
`;

export const HeroActions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 22px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.button};
  font-size: 14px;
  font-weight: 950;
  text-decoration: none;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

export const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 22px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.72);
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  font-weight: 950;
  text-decoration: none;
  transition:
    transform 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const HeroStats = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const StatPill = styled.div`
  padding: 18px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 45px rgba(11, 31, 51, 0.08);
`;

export const StatValue = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 26px;
  line-height: 1;
  letter-spacing: -0.06em;
`;

export const StatLabel = styled.span`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.45;
`;

export const HeroVisual = styled(motion.div)`
  position: relative;
  min-height: 620px;

  @media (max-width: 1040px) {
    min-height: auto;
  }
`;

export const VisualGlow = styled.div`
  position: absolute;
  inset: 5% -12% auto auto;
  width: 430px;
  height: 430px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.glowGold};
  filter: blur(58px);
  animation: ${pulseGlow} 6s ease-in-out infinite;

  @media (max-width: 1040px) {
    display: none;
  }
`;

export const DashboardShell = styled(motion.div)`
  position: relative;
  z-index: 2;
  overflow: hidden;
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.04)),
    ${({ theme }) => theme.colors.surfaceDark};
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: ${({ theme }) => theme.shadows.dark};
  color: ${({ theme }) => theme.colors.textInverted};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 24% 10%, rgba(200, 164, 93, 0.28), transparent 24%),
      radial-gradient(circle at 88% 22%, rgba(15, 76, 92, 0.40), transparent 28%);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 32%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.08),
      transparent
    );
    animation: ${scan} 5.5s ease-in-out infinite;
    pointer-events: none;
  }
`;

export const DashboardChrome = styled.div`
  position: relative;
  z-index: 2;
  padding: 18px 18px 0;
`;

export const WindowDots = styled.div`
  display: flex;
  gap: 7px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.22);

    &:first-child {
      background: #ef6b5f;
    }

    &:nth-child(2) {
      background: #eab74d;
    }

    &:nth-child(3) {
      background: #4ac27a;
    }
  }
`;

export const DashboardBody = styled.div`
  position: relative;
  z-index: 2;
  padding: 26px;
`;

export const DashboardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const DashboardTitle = styled.div`
  strong {
    display: block;
    font-size: 25px;
    letter-spacing: -0.05em;
  }

  span {
    display: block;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.58);
    font-size: 13px;
  }
`;

export const LiveBadge = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(35, 122, 87, 0.16);
  color: #9de8c3;
  font-size: 12px;
  font-weight: 900;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #50d691;
    box-shadow: 0 0 0 7px rgba(80, 214, 145, 0.10);
  }
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const KpiCard = styled.div`
  min-height: 112px;
  padding: 16px;
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
    margin-top: 16px;
    font-size: 28px;
    letter-spacing: -0.06em;
  }
`;

export const DashboardPanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartPanel = styled.div`
  min-height: 270px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.10);
`;

export const ChartTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  strong {
    font-size: 14px;
  }

  span {
    color: ${({ theme }) => theme.colors.accent};
    font-size: 12px;
    font-weight: 900;
  }
`;

export const Bars = styled.div`
  height: 178px;
  display: flex;
  align-items: end;
  gap: 10px;
`;

export const Bar = styled.span<{ $height: number; $accent?: boolean }>`
  flex: 1;
  min-width: 14px;
  height: ${({ $height }) => $height}%;
  border-radius: 999px 999px 8px 8px;
  background: ${({ theme, $accent }) =>
    $accent
      ? `linear-gradient(180deg, ${theme.colors.accent}, rgba(200,164,93,0.28))`
      : "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.14))"};
`;

export const TaskPanel = styled.div`
  min-height: 270px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.10);
`;

export const TaskItem = styled.div`
  padding: 13px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:last-child {
    border-bottom: none;
  }

  strong {
    display: block;
    font-size: 13px;
  }

  span {
    display: block;
    margin-top: 6px;
    color: rgba(255, 255, 255, 0.56);
    font-size: 12px;
  }
`;

export const FloatingCard = styled(motion.div)<{ $position: "left" | "right" }>`
  position: absolute;
  z-index: 3;
  ${({ $position }) =>
    $position === "left"
      ? `
        left: -42px;
        bottom: 86px;
      `
      : `
        right: -34px;
        top: 90px;
      `}
  width: 210px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.70);
  box-shadow: ${({ theme }) => theme.shadows.card};
  color: ${({ theme }) => theme.colors.primary};
  animation: ${float} 5s ease-in-out infinite;

  strong {
    display: block;
    font-size: 21px;
    letter-spacing: -0.05em;
  }

  span {
    display: block;
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    line-height: 1.45;
  }

  @media (max-width: 1040px) {
    display: none;
  }
`;

export const TrustStrip = styled(Section)`
  display: grid;
  grid-template-columns: 1.1fr 2fr;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  padding: 22px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.70);
  box-shadow: 0 18px 60px rgba(11, 31, 51, 0.08);

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const TrustTitle = styled.div`
  strong {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
    letter-spacing: -0.03em;
  }

  span {
    display: block;
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
  }
`;

export const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const TrustItem = styled.div`
  padding: 14px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
  }

  span {
    display: block;
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
  }
`;

export const SectionBlock = styled(Section)`
  padding: ${({ theme }) => theme.spacing["3xl"]} 0;
`;

export const SectionHeader = styled.div`
  max-width: 780px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 780px) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const SectionEyebrow = styled.span`
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: clamp(36px, 5vw, 64px);
  line-height: 0.96;
  letter-spacing: -0.07em;
`;

export const SectionDescription = styled.p`
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 17px;
  line-height: 1.75;
`;

export const PainGrid = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const DarkPanel = styled(motion.div)`
  position: relative;
  overflow: hidden;
  min-height: 520px;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.24), transparent 34%),
    ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};

  h3 {
    max-width: 420px;
    margin: 0;
    font-size: clamp(30px, 4vw, 52px);
    line-height: 0.98;
    letter-spacing: -0.06em;
  }

  p {
    max-width: 420px;
    margin: ${({ theme }) => theme.spacing.md} 0 0;
    color: rgba(255, 255, 255, 0.70);
    line-height: 1.75;
  }
`;

export const TimelineGlow = styled.div`
  position: absolute;
  right: -80px;
  bottom: -80px;
  width: 280px;
  height: 280px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.glowGold};
  filter: blur(44px);
`;

export const PainCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const PainCard = styled(motion.article)`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.80);
  box-shadow: 0 18px 55px rgba(11, 31, 51, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }

  span {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    border-radius: 16px;
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
    font-weight: 950;
  }

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 20px;
    letter-spacing: -0.04em;
  }

  p {
    margin: 12px 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.65;
  }
`;

export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const ProcessCard = styled(motion.article)`
  position: relative;
  overflow: hidden;
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};

  &::after {
    content: "";
    position: absolute;
    right: -50px;
    bottom: -50px;
    width: 150px;
    height: 150px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

export const StepNumber = styled.strong`
  position: relative;
  z-index: 2;
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 44px;
  line-height: 1;
  letter-spacing: -0.08em;
`;

export const ProcessTitle = styled.h3`
  position: relative;
  z-index: 2;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  letter-spacing: -0.05em;
`;

export const ProcessText = styled.p`
  position: relative;
  z-index: 2;
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.65;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 940px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled(motion.article)`
  min-height: 260px;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 60px rgba(11, 31, 51, 0.08);
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-8px);
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

export const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.secondarySoft};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 22px;
`;

export const FeatureTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  letter-spacing: -0.05em;
`;

export const FeatureText = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
`;

export const RoiSection = styled.section`
  padding: ${({ theme }) => theme.spacing["3xl"]} 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(200, 164, 93, 0.22), transparent 28%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  color: ${({ theme }) => theme.colors.textInverted};
`;

export const RoiInner = styled(Section)`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const RoiContent = styled.div`
  h2 {
    margin: 0;
    font-size: clamp(38px, 5vw, 68px);
    line-height: 0.96;
    letter-spacing: -0.07em;
  }

  p {
    margin: ${({ theme }) => theme.spacing.md} 0 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 17px;
    line-height: 1.75;
  }
`;

export const RoiCards = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const RoiCard = styled(motion.article)`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.12);

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.accent};
    font-size: 25px;
    letter-spacing: -0.05em;
  }

  span {
    display: block;
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.6;
  }
`;

export const AudienceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const AudienceCard = styled(motion.article)`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};

  strong {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 22px;
    letter-spacing: -0.05em;
  }

  p {
    margin: 8px 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.65;
  }
`;

export const FaqGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const FaqItem = styled(motion.details)`
  padding: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 42px rgba(11, 31, 51, 0.06);
  overflow: hidden;

  summary {
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 950;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  p {
    margin: 0;
    padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.7;
  }
`;

export const FinalCta = styled(Section)`
  position: relative;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
  padding: clamp(36px, 7vw, 78px);
  border-radius: 42px;
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.32), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.dark};

  h2 {
    max-width: 760px;
    margin: 0;
    font-size: clamp(38px, 6vw, 74px);
    line-height: 0.94;
    letter-spacing: -0.08em;
  }

  p {
    max-width: 620px;
    margin: ${({ theme }) => theme.spacing.md} 0 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 17px;
    line-height: 1.75;
  }
`;

export const CtaActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};

  ${PrimaryButton} {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background: ${({ theme }) => theme.colors.accentHover};
    }
  }

  ${SecondaryButton} {
    background: rgba(255, 255, 255, 0.10);
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: rgba(255, 255, 255, 0.20);
  }
`;

export const Footer = styled.footer`
  width: min(1180px, calc(100% - 44px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing["2xl"]};
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 900;
    text-decoration: none;
  }

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;
