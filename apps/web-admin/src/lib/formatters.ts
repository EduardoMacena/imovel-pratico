type DateInput = string | Date | null | undefined;

function onlyDigits(value: string | number | null | undefined) {
  return String(value ?? "").replace(/\D/g, "");
}

function parseDateInput(value: DateInput) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value).trim();

  if (!text) {
    return null;
  }

  const brDateTimeMatch = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+\d{2}:\d{2}:\d{2})?/.exec(text);

  if (brDateTimeMatch) {
    const [, day, month, year] = brDateTimeMatch;

    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0)
    );
  }

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0)
    );
  }

  const parsed = new Date(text);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatCurrencyBRL(value: number | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function formatCurrencyFromCents(value: number | null | undefined) {
  return formatCurrencyBRL(Number(value ?? 0) / 100);
}

export function formatNumberBR(value: number | null | undefined) {
  return new Intl.NumberFormat("pt-BR").format(Number(value ?? 0));
}

export function formatPercentBR(value: number | null | undefined) {
  return `${formatNumberBR(value)}%`;
}

export function formatPhoneBR(value: string | number | null | undefined) {
  const digits = onlyDigits(value);

  if (!digits) {
    return "-";
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  if (digits.length === 9) {
    return digits.replace(/^(\d{5})(\d{4})$/, "$1-$2");
  }

  if (digits.length === 8) {
    return digits.replace(/^(\d{4})(\d{4})$/, "$1-$2");
  }

  return String(value ?? "-");
}

export function formatCpfBR(value: string | number | null | undefined) {
  const digits = onlyDigits(value);

  if (digits.length !== 11) {
    return value ? String(value) : "-";
  }

  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export function formatCepBR(value: string | number | null | undefined) {
  const digits = onlyDigits(value);

  if (digits.length !== 8) {
    return value ? String(value) : "-";
  }

  return digits.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

export function formatDateBR(value: DateInput) {
  const date = parseDateInput(value);

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateOnlyBR(value: DateInput) {
  return formatDateBR(value);
}

export function formatBirthdayBR(value: DateInput) {
  return formatDateBR(value);
}

export function formatDateTimeBR(value: DateInput) {
  const date = parseDateInput(value);

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
