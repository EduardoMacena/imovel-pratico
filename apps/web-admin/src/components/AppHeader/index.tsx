"use client";

import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();

  function handleLogout() {
    removeAuthToken();
    router.push("/login");
  }

  return (
    <HeaderWrapper>
      <HeaderInner>
        <Brand href="/dashboard">
          <LogoMark src="/logo-imovel-pratico.svg" alt="Imóvel Prático" />
        </Brand>

        <Nav>
          <NavLink href="/dashboard" $active={pathname === "/dashboard"}>
            Dashboard
          </NavLink>

          <NavLink href="/clientes" $active={pathname.startsWith("/clientes")}>
            Clientes
          </NavLink>

          <NavLink href="/planos" $active={pathname.startsWith("/planos")}>
            Planos
          </NavLink>

          <NavLink href="/financeiro" $active={pathname.startsWith("/financeiro")}>
            Financeiro
          </NavLink>

          <NavLink
            href="/monitoramento"
            $active={pathname.startsWith("/monitoramento")}
          >
            Monitoramento
          </NavLink>
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