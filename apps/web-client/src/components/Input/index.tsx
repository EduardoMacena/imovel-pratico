"use client";

import { InputHTMLAttributes } from "react";
import { Field, InputElement, Label } from "./styles";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label;

  return (
    <Field htmlFor={inputId}>
      {label && <Label>{label}</Label>}
      <InputElement id={inputId} {...props} />
    </Field>
  );
}
