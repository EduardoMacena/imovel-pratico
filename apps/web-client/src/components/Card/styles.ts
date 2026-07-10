"use client";

import styled from "styled-components";

export const CardContainer = styled.div`
  background:
    linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.9)),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  backdrop-filter: blur(10px);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;
