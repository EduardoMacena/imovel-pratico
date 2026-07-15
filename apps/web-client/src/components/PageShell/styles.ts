"use client";

import styled from "styled-components";

export const Shell = styled.main`
  width: min(1220px, calc(100% - 32px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing["3xl"]};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

export const Eyebrow = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.04em;
`;

export const Subtitle = styled.p`
  max-width: 680px;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 16px;
  line-height: 1.65;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;
