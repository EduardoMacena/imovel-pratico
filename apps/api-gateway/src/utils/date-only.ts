export function parseDateOnlyToUtcNoon(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(
      Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate(),
        12,
        0,
        0,
        0
      )
    );
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("Data inválida. Use o formato YYYY-MM-DD.");
  }

  const [, year, month, day] = match;

  return new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0)
  );
}

export function formatDateOnlyFromDate(value?: Date | string | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
