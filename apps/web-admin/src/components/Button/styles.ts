"use client";

import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";

type StyledButtonProps = {
  $variant: ButtonVariant;
  $fullWidth?: boolean;
};

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.button};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
      border-color: ${({ theme }) => theme.colors.primaryHover};
      transform: translateY(-1px);
      box-shadow: 0 16px 32px rgba(11, 31, 51, 0.2);
    }
  `,

  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: ${({ theme }) => theme.colors.secondary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.secondaryHover};
      border-color: ${({ theme }) => theme.colors.secondaryHover};
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(31, 111, 91, 0.18);
    }
  `,

  accent: css`
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.accent};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentHover};
      border-color: ${({ theme }) => theme.colors.accentHover};
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(200, 164, 93, 0.2);
    }
  `,

  ghost: css`
    background: rgba(255, 255, 255, 0.72);
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.border};
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface};
      border-color: ${({ theme }) => theme.colors.borderStrong};
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.07);
    }
  `,

  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: ${({ theme }) => theme.colors.danger};

    &:hover:not(:disabled) {
      filter: brightness(0.95);
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(180, 35, 24, 0.18);
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "fit-content")};
  min-width: ${({ $fullWidth }) => ($fullWidth ? "0" : "112px")};
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  font-size: 14px;
  font-weight: 950;
  letter-spacing: -0.01em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  outline: none;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease,
    filter 0.18s ease;

  ${({ $variant }) => variants[$variant]}

  &:focus-visible {
    box-shadow:
      0 0 0 4px ${({ theme }) => theme.colors.accentSoft},
      ${({ theme }) => theme.shadows.button};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: none;
  }
`;