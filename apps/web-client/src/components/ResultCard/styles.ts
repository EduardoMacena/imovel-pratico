"use client";

import styled from "styled-components";

export const ResultItem = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

export const ResultTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const ResultTitle = styled.strong`
  color: ${({ theme }) => theme.colors.text};
`;

export const ResultText = styled.p`
  margin: 8px 0;
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.5;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ErrorText = styled(ResultText)`
  color: ${({ theme }) => theme.colors.danger};
`;
