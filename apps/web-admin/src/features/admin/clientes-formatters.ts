export function formatarCnpj(value: string) {
  const raw = value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 14);

  if (raw.length <= 2) return raw;
  if (raw.length <= 5) return `${raw.slice(0, 2)}.${raw.slice(2)}`;
  if (raw.length <= 8) {
    return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5)}`;
  }
  if (raw.length <= 12) {
    return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8)}`;
  }

  return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8, 12)}-${raw.slice(12)}`;
}

export function formatarTelefone(value: string) {
  const raw = value.replace(/\D/g, "").slice(0, 11);

  if (raw.length <= 2) return raw;
  if (raw.length <= 6) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
  if (raw.length <= 10) {
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
  }

  return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
}

export function formatarCep(value: string) {
  const raw = value.replace(/\D/g, "").slice(0, 8);

  if (raw.length <= 5) return raw;

  return `${raw.slice(0, 5)}-${raw.slice(5)}`;
}

export function formatarUf(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);
}

export function valorNullable(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

export function valorNullableUf(value: string) {
  const normalized = formatarUf(value);
  return normalized || null;
}
