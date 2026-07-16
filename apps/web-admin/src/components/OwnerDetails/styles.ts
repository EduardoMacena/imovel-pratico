"use client";

import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.lg};
`;

export const Section = styled.div`
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.07), transparent 30%),
    ${({ theme }) => theme.colors.backgroundSoft};
`;

export const SectionButton = styled.button`
  width: 100%;
  min-height: 64px;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
  cursor: pointer;

  > span {
    flex: 0 0 auto;
    color: ${({ theme }) => theme.colors.accent};
    font-size: 12px;
    font-weight: 850;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.42);
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 17px;
  line-height: 1.2;
  font-weight: 760;
  letter-spacing: -0.04em;
`;

export const SectionCount = styled.span`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 500;
`;

export const SectionContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 700;
`;

export const Value = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  line-height: 1.45;
  font-weight: 400;
  margin-top: 4px;
  overflow-wrap: anywhere;
`;

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ListItem = styled.div`
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;
