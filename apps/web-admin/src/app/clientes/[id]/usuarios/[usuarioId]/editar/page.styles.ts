"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]} 20px;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  font-weight: 700;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 34px;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.6;
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
`;

export const SuccessBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
`;
