"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAuthCliente,
  getAuthUser,
  removeAuthToken,
  type AuthCliente,
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
  const [cliente, setCliente] = useState<AuthCliente | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
    setCliente(getAuthCliente());
  }, []);

  function handleLogout() {
    removeAuthToken();
    router.replace("/login");
  }

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Brand href="/">Imóvel Prático</Brand>

        <Nav>
          <NavLink href="/">Nova busca</NavLink>
          <NavLink href="/historico">Histórico</NavLink>

          {user && (
            <UserInfo>
              {user.nome}
              {cliente ? ` • ${cliente.nome}` : ""}
            </UserInfo>
          )}

          <LogoutButton type="button" onClick={handleLogout}>
            Sair
          </LogoutButton>
        </Nav>
      </HeaderContent>
    </HeaderWrapper>
  );
}
