"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1180px);
  }
`;

export const BackLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.surfaceMuted};
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContent = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top left, rgba(200, 164, 93, 0.2), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #102b45);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const HeaderEyebrow = styled.div`
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 760px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(38px, 5vw, 60px);
  line-height: 0.98;
  letter-spacing: -0.06em;
`;

export const Subtitle = styled.p`
  max-width: 720px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;

  ${HeaderContent} & {
    margin-top: ${({ theme }) => theme.spacing.lg};
    color: rgba(255, 255, 255, 0.78);
    font-size: 16px;
    line-height: 1.7;
  }
`;

export const HeaderPanel = styled.aside`
  min-width: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at top right, rgba(31, 111, 91, 0.13), transparent 34%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const HeaderPanelItem = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const HeaderPanelLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.25;
  font-weight: 850;
  margin-bottom: 8px;
`;

export const HeaderPanelValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  line-height: 1.35;
  font-weight: 950;
  overflow-wrap: anywhere;
`;

export const ConsumptionWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const FormHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const FormSection = styled.section`
  min-width: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FormSectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: -0.04em;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 560px) {
    justify-content: stretch;

    button {
      width: 100%;
    }
  }
`;

export const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;
`;

export const SuccessBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
  line-height: 1.6;
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background:
    radial-gradient(circle at top, rgba(200, 164, 93, 0.1), transparent 34%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  line-height: 1.6;
`;

export const EmptyStateTitle = styled.strong`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
`;