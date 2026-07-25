"use client";

import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";

type StyledButtonProps = {
  $variant: ButtonVariant;
  $fullWidth?: boolean;
};

const variants = {
  primary: css`
    background:
      linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      ${({ theme }) => theme.shadows.button},
      inset 0 1px 0 rgba(255, 255, 255, 0.08);

    &:hover:not(:disabled) {
      background:
        linear-gradient(135deg, ${({ theme }) => theme.colors.primaryHover}, #061521);
      transform: translateY(-2px);
      box-shadow:
        0 18px 38px rgba(11, 31, 51, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.10);
    }
  `,

  secondary: css`
    background:
      linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.secondary},
        ${({ theme }) => theme.colors.secondaryHover}
      );
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: rgba(255, 255, 255, 0.10);
    box-shadow: 0 14px 30px rgba(31, 111, 91, 0.18);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 18px 38px rgba(31, 111, 91, 0.24);
    }
  `,

  accent: css`
    background:
      linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.accent},
        ${({ theme }) => theme.colors.accentHover}
      );
    color: ${({ theme }) => theme.colors.primary};
    border-color: rgba(200, 164, 93, 0.62);
    box-shadow: 0 14px 30px rgba(200, 164, 93, 0.20);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 18px 38px rgba(200, 164, 93, 0.26);
    }
  `,

  ghost: css`
    background: rgba(255, 255, 255, 0.72);
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.border};
    box-shadow:
      0 10px 24px rgba(15, 23, 42, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface};
      border-color: ${({ theme }) => theme.colors.borderStrong};
      transform: translateY(-2px);
      box-shadow:
        0 14px 30px rgba(15, 23, 42, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.82);
    }
  `,

  danger: css`
    background:
      linear-gradient(135deg, ${({ theme }) => theme.colors.danger}, #8f1e17);
    color: ${({ theme }) => theme.colors.textInverted};
    border-color: ${({ theme }) => theme.colors.danger};
    box-shadow: 0 14px 30px rgba(180, 35, 24, 0.18);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      filter: brightness(0.96);
      box-shadow: 0 18px 38px rgba(180, 35, 24, 0.24);
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "fit-content")};
  min-width: ${({ $fullWidth }) => ($fullWidth ? "0" : "116px")};
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  font-family: inherit;
  font-size: 14px;
  font-weight: 950;
  letter-spacing: -0.01em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  outline: none;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease,
    filter 0.18s ease;

  ${({ $variant }) => variants[$variant]}

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      transparent 0%,
      rgba(255, 255, 255, 0.16) 42%,
      transparent 64%
    );
    transform: translateX(-130%);
    transition: transform 0.55s ease;
    pointer-events: none;
  }

  &:hover:not(:disabled)::after {
    transform: translateX(130%);
  }

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
    opacity: 0.54;
    box-shadow: none;
  }
`;
