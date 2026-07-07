"use client";

import styled from "styled-components";

export const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]} 20px;
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const BackLink = styled.a`
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export const Title = styled.h1`
  font-size: 34px;
  margin: 0;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.6;
`;

export const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Item = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

export const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const Address = styled.strong`
  font-size: 16px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  margin-bottom: 4px;
`;

export const InfoValue = styled.div`
  font-weight: 700;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
`;

export const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
`;
