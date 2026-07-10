"use client";

import { useRouter } from "next/navigation";
import { removeAuthToken } from "../../lib/auth-storage";
import { Button } from "../Button";
import {
  Brand,
  HeaderActions,
  HeaderInner,
  HeaderWrapper,
  LogoMark,
  Nav,
  NavLink,
} from "./styles";

export function AppHeader() {
  const router = useRouter();

  function handleLogout() {
    removeAuthToken();
    router.push("/login");
  }

  return (
    <HeaderWrapper>
      <HeaderInner>
        <Brand href="/dashboard">
          <LogoMark>IP</LogoMark>
          Imóvel Prático
        </Brand>

        <Nav>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/clientes">Clientes</NavLink>
          <NavLink href="/planos">Planos</NavLink>
        </Nav>

        <HeaderActions>
          <Button type="button" variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </HeaderActions>
      </HeaderInner>
    </HeaderWrapper>
  );
}
