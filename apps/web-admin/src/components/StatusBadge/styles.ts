"use client";

import styled, { css } from "styled-components";

type Variant = "success" | "error" | "warning" | "info" | "neutral";

const variants = {
  success: css`
    background: ${({ theme }) => theme.colors.successBg};
    color: ${({ theme }) => theme.colors.success};
    border-color: ${({ theme }) => theme.colors.successBorder};

    &::before {
      background: ${({ theme }) => theme.colors.success};
    }
  `,
  error: css`
    background: ${({ theme }) => theme.colors.dangerBg};
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.dangerBorder};

    &::before {
      background: ${({ theme }) => theme.colors.danger};
    }
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningBg};
    color: ${({ theme }) => theme.colors.warning};
    border-color: ${({ theme }) => theme.colors.warningBorder};

    &::before {
      background: ${({ theme }) => theme.colors.warning};
    }
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoBg};
    color: ${({ theme }) => theme.colors.info};
    border-color: ${({ theme }) => theme.colors.infoBorder};

    &::before {
      background: ${({ theme }) => theme.colors.info};
    }
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textMuted};
    border-color: ${({ theme }) => theme.colors.border};

    &::before {
      background: ${({ theme }) => theme.colors.textSoft};
    }
  `,
};

export const Badge = styled.span<{ $variant: Variant }>`
  flex: 0 0 auto;
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.05em;
  white-space: nowrap;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
  }

  ${({ $variant }) => variants[$variant]}
`;
