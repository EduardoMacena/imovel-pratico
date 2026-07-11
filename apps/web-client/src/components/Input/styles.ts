"use client";

import styled from "styled-components";

export const Field = styled.label`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  &:focus-within span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: color 0.18s ease;
`;

export const InputElement = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.90), rgba(255, 255, 255, 0.74)),
    ${({ theme }) => theme.colors.backgroundSoft};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 ${({ theme }) => theme.spacing.md};
  outline: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.80);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
    font-weight: 700;
  }

  &:focus {
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow:
      0 0 0 4px ${({ theme }) => theme.colors.accentSoft},
      0 14px 28px rgba(15, 23, 42, 0.07);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
