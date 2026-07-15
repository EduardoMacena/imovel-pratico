"use client";

import { ReactNode } from "react";
import {
  Eyebrow,
  Header,
  HeaderActions,
  Shell,
  Subtitle,
  Title,
} from "./styles";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: PageShellProps) {
  return (
    <Shell>
      <Header>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </div>

        {actions && <HeaderActions>{actions}</HeaderActions>}
      </Header>

      {children}
    </Shell>
  );
}
