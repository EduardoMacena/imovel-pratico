"use client";

import Link from "next/link";
import styled from "styled-components";

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(244, 241, 234, 0.82);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(18px);
`;

export const HeaderInner = styled.div`
  width: min(1220px, calc(100% - 32px));
  height: 76px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 950;
  font-size: 18px;
  letter-spacing: -0.04em;
  text-decoration: none;
`;

export const LogoMark = styled.span`
  width: 38px;
  height: 38px;
  display: inline-grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background:
    linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: ${({ theme }) => theme.colors.accent};
  box-shadow: ${({ theme }) => theme.shadows.button};
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 880px) {
    display: none;
  }
`;

export const NavLink = styled(Link)`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  font-weight: 850;
  text-decoration: none;
  transition:
    color 0.18s ease,
    background 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;
