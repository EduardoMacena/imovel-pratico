"use client";

import styled from "styled-components";

export const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 800;
`;

export const StyledInput = styled.input`
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
