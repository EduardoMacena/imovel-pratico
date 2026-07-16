"use client";

import styled from "styled-components";

export const Field = styled.label`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 800;
`;

export const SelectElement = styled.select`
  width: 100%;
  height: 46px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.backgroundSoft};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 ${({ theme }) => theme.spacing.md};
  outline: none;
  cursor: pointer;
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
