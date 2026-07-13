"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1240px);
  }
`;

export const BackLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primary};
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 850;
  text-decoration: none;
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContent = styled.div`
  min-height: 300px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 4vw, 58px);
  border-radius: 32px;
  background:
    radial-gradient(circle at 16% 12%, rgba(200, 164, 93, 0.24), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.32), transparent 34%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #071927);
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};

  &::after {
    content: "";
    position: absolute;
    right: -90px;
    bottom: -120px;
    width: 280px;
    height: 280px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
  }
`;

export const HeaderEyebrow = styled.div`
  width: fit-content;
  position: relative;
  z-index: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 8px 13px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.10);
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: clamp(38px, 4.6vw, 64px);
  line-height: 0.97;
  letter-spacing: -0.08em;
`;

export const Subtitle = styled.p`
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;

  ${HeaderContent} & {
    position: relative;
    z-index: 1;
    margin-top: ${({ theme }) => theme.spacing.md};
    color: rgba(255, 255, 255, 0.72);
  }
`;

export const HeaderPanel = styled.aside`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 32px;
  background:
    radial-gradient(circle at 16% 14%, rgba(200, 164, 93, 0.18), transparent 30%),
    ${({ theme }) => theme.colors.surfaceDark};
  color: ${({ theme }) => theme.colors.textInverted};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const HeaderPanelItem = styled.div`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.10);
`;

export const HeaderPanelLabel = styled.div`
  color: rgba(255, 255, 255, 0.56);
  font-size: 12px;
  line-height: 1.25;
  font-weight: 800;
  margin-bottom: 8px;
`;

export const HeaderPanelValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.textInverted};
  font-size: 15px;
  line-height: 1.45;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const FormPanel = styled.section`
  min-width: 0;
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

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const FormHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const FormSection = styled.section`
  min-width: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(200, 164, 93, 0.08), transparent 30%),
    ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FormSectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.05em;
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
    button,
    a {
      width: 100%;
    }
  }
`;

export const ErrorBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;
`;

export const SuccessBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
  line-height: 1.6;
`;
