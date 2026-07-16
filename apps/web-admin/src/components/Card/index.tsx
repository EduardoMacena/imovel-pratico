"use client";

import { HTMLAttributes, ReactNode } from "react";
import { CardContainer } from "./styles";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, ...props }: CardProps) {
  return <CardContainer {...props}>{children}</CardContainer>;
}
