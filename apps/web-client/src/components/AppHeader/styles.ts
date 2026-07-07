"use client";

import Link from "next/link";
import styled from "styled-components";

export const HeaderWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const HeaderContent = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Brand = styled(Link)`
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  font-weight: 700;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const UserInfo = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export const LogoutButton = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;
