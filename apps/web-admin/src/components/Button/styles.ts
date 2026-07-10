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
    }
  `,

  ghost: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceMuted};
      border-color: ${({ theme }) => theme.colors.borderStrong};
      transform: translateY(-1px);
    }
  `,

  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: ${({ theme }) => theme.colors.danger};

    &:hover:not(:disabled) {
      filter: brightness(0.95);
      transform: translateY(-1px);
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "fit-content")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 44px;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;

  ${({ $variant }) => variants[$variant]}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: none;
  }
`;
