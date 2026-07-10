"use client";

import { usePathname, useRouter } from "next/navigation";
import { removeAuthToken } from "../../lib/auth-storage";
import { Button } from "../Button";
import {
  Brand,
  BrandText,
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
        <Brand href="/">
          <LogoMark>IP</LogoMark>
          <BrandText>Imóvel Prático</BrandText>
        </Brand>

        <Nav>
          <NavLink href="/" $active={pathname === "/"}>
            Nova busca
          </NavLink>

          <NavLink href="/historico" $active={pathname.startsWith("/historico")}>
            Histórico
          </NavLink>

          <NavLink
            href="/trocar-senha"
            $active={pathname.startsWith("/trocar-senha")}
          >
            Perfil
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