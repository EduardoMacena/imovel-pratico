"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAuthUser,
  removeAuthToken,
  type AuthUser,
} from "../../lib/auth-storage";
import {
  Brand,
  HeaderContent,
  HeaderWrapper,
  LogoutButton,
  Nav,
  NavLink,
  UserInfo,
} from "./styles";

export function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  function handleLogout() {
    removeAuthToken();
    router.replace("/login");
  }

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Brand href="/clientes">Imóvel Prático Admin</Brand>

        <Nav>
          <NavLink href="/clientes">Clientes</NavLink>

          {user && <UserInfo>{user.nome} • {user.role}</UserInfo>}

          <LogoutButton type="button" onClick={handleLogout}>
            Sair
          </LogoutButton>
        </Nav>
      </HeaderContent>
    </HeaderWrapper>
  );
}
