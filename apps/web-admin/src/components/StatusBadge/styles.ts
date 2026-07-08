"use client";

import styled, { css } from "styled-components";

type Variant = "success" | "error" | "warning" | "info" | "neutral";

const variants = {
  success: css`
    background: ${({ theme }) => theme.colors.successBg};
    color: ${({ theme }) => theme.colors.success};
    border-color: ${({ theme }) => theme.colors.successBorder};
  `,
  error: css`
    background: ${({ theme }) => theme.colors.dangerBg};
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.dangerBorder};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningBg};
    color: ${({ theme }) => theme.colors.warning};
    border-color: ${({ theme }) => theme.colors.warningBorder};
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoBg};
    color: ${({ theme }) => theme.colors.info};
    border-color: ${({ theme }) => theme.colors.infoBorder};
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textMuted};
    border-color: ${({ theme }) => theme.colors.border};
  `,
};

export const Badge = styled.span<{ $variant: Variant }>`
  display: inline-flex;
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid;
  font-size: 12px;
  font-weight: 900;

  ${({ $variant }) => variants[$variant]}
`;
