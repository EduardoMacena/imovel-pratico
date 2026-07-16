"use client";

import styled from "styled-components";

export const Shell = styled.main`
  width: min(1320px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1320px);
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 30px;
  background:
    radial-gradient(circle at 16% 12%, rgba(200, 164, 93, 0.16), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.14), transparent 34%),
    rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 48px rgba(11, 31, 51, 0.08);
  backdrop-filter: blur(12px);

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

export const Eyebrow = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1;
  letter-spacing: -0.06em;
`;

export const Subtitle = styled.p`
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;
