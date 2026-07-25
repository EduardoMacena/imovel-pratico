"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { StyledButton } from "./styles";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  children,
  variant = "primary",
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
}
