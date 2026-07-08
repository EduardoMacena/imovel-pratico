"use client";

import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const Section = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 15px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export const Value = styled.div`
  font-weight: 800;
  margin-top: 2px;
  word-break: break-word;
`;

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ListItem = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;
