"use client";

import Link from "next/link";
import styled, { css } from "styled-components";

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(244, 241, 234, 0.78);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(18px);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
`;

export const HeaderInner = styled.div`
  width: min(1280px, calc(100% - 40px));
  min-height: 76px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 760px) {
    width: min(100% - 24px, 1280px);
    grid-template-columns: 1fr auto;
  }
`;

export const Brand = styled(Link)`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 950;
  font-size: 18px;
  letter-spacing: -0.04em;
  text-decoration: none;
`;

export const BrandText = styled.span`
  white-space: nowrap;

  @media (max-width: 420px) {
    display: none;
  }
`;

export const LogoMark = styled.img`
  width: 148px;
  max-width: 42vw;
  height: auto;
  max-height: 52px;
  display: block;
  flex: 0 0 auto;
  object-fit: contain;

  @media (max-width: 420px) {
    width: 126px;
  }
`;

export const Nav = styled.nav`
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 760px) {
    display: none;
  }
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }

  ${({ theme, $active }) =>
    $active &&
    css`
      color: ${theme.colors.primary};
      background: ${theme.colors.surface};
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    `}
`;

export const HeaderActions = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;