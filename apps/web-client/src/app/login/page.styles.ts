"use client";

import styled from "styled-components";

export const PageContainer = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(17, 24, 39, 0.12), transparent 32%),
    ${({ theme }) => theme.colors.background};
`;

export const LoginCard = styled.section`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const Badge = styled.div`
  display: inline-flex;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  font-weight: 800;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.6;
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
`;

export const Hint = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.5;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;
