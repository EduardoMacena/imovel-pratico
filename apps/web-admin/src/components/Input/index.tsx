"use client";

import { InputHTMLAttributes, useId } from "react";
import { Field, InputElement, Label } from "./styles";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;

  return (
    <Field htmlFor={inputId}>
      {label && <Label>{label}</Label>}
      <InputElement id={inputId} {...props} />
    </Field>
  );
}
