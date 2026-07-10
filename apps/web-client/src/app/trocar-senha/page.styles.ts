"use client";

import styled from "styled-components";

export const PageContainer = styled.main`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing["3xl"]};

  @media (max-width: 720px) {
    width: min(100% - 24px, 1120px);
  }
`;

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

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
  max-width: 700px;
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 16px;
  line-height: 1.7;
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
  font-weight: 850;
  margin-bottom: 8px;
`;

export const HeaderPanelValue = styled.div`
  min-width: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  line-height: 1.35;
  font-weight: 950;
  overflow-wrap: anywhere;
`;

export const AlertBox = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.warningBg};
  color: ${({ theme }) => theme.colors.warning};
  border: 1px solid ${({ theme }) => theme.colors.warningBorder};
  line-height: 1.6;
`;

export const FormCard = styled.section`
  max-width: 720px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const SecurityHint = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.7;
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
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
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.dangerBg};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  line-height: 1.6;
`;

export const SuccessBox = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.successBorder};
  line-height: 1.6;
`;