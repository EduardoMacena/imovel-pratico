"use client";

import styled from "styled-components";

export const StyledButton = styled.button`
  height: 46px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0 20px;
  cursor: pointer;
  font-weight: 700;
  transition:
    background 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
