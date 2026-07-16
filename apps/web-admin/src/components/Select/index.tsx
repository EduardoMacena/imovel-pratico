"use client";

import { SelectHTMLAttributes, useId } from "react";
import { Field, Label, SelectElement } from "./styles";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, id, children, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? props.name ?? generatedId;

  return (
    <Field htmlFor={selectId}>
      {label && <Label>{label}</Label>}
      <SelectElement id={selectId} {...props}>
        {children}
      </SelectElement>
    </Field>
  );
}
