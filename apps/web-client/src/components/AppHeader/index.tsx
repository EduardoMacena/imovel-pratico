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
        <Brand href="/">
          <LogoMark src="/logo-imovel-pratico.svg" alt="Imóvel Prático" />
        </Brand>

        <Nav>
          <NavLink href="/" $active={pathname === "/"}>
            Dashboard
          </NavLink>

          <NavLink
            href="/nova-busca"
            $active={pathname.startsWith("/nova-busca")}
          >
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
