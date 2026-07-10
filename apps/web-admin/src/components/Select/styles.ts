"use client";

import styled from "styled-components";

export const Field = styled.label`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 850;
`;

export const SelectElement = styled.select`
  width: 100%;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.backgroundSoft};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 ${({ theme }) => theme.spacing.md};
  outline: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;

  &:focus {
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.accentSoft};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;