"use client";

import type { SelectHTMLAttributes } from "react";
import { Field, Label, StyledSelect } from "./styles";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({ label, id, children, ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <Field>
      <Label htmlFor={selectId}>{label}</Label>
      <StyledSelect id={selectId} {...props}>
        {children}
      </StyledSelect>
    </Field>
  );
}
