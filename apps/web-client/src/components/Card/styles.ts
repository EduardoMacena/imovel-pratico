"use client";

import styled from "styled-components";

export const CardContainer = styled.div`
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.08), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.88)),
    ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow:
    ${({ theme }) => theme.shadows.card},
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;
