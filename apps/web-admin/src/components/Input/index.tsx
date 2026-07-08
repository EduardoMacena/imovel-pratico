"use client";

import type { InputHTMLAttributes } from "react";
import { Field, Label, StyledInput } from "./styles";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <Field>
      <Label htmlFor={inputId}>{label}</Label>
      <StyledInput id={inputId} {...props} />
    </Field>
  );
}
