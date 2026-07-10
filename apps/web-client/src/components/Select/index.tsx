"use client";

import { SelectHTMLAttributes } from "react";
import { Field, Label, SelectElement } from "./styles";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, id, children, ...props }: SelectProps) {
  const selectId = id ?? props.name ?? label;

  return (
    <Field htmlFor={selectId}>
      {label && <Label>{label}</Label>}
      <SelectElement id={selectId} {...props}>
        {children}
      </SelectElement>
    </Field>
  );
}
