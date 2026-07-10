"use client";

import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const Hero = styled.section`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.22), transparent 32%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #102b45);
  color: ${({ theme }) => theme.colors.textInverted};

  @media (max-width: 920px) {
    display: none;
  }
`;

export const HeroContent = styled.div`
  max-width: 640px;
`;

export const Badge = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(42px, 5vw, 68px);
  line-height: 0.96;
  letter-spacing: -0.06em;
`;

export const HeroText = styled.p`
  max-width: 540px;
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 18px;
  line-height: 1.7;
`;

export const LoginArea = styled.section`
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const LoginCard = styled.div`
  width: min(440px, 100%);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const LoginTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 30px;
  letter-spacing: -0.04em;
`;

export const LoginSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ErrorBox = styled.div`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  font-size: 14px;
`;

export const FooterText = styled.p`
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  text-align: center;
`;