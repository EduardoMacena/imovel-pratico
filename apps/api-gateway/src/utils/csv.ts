type CsvRow = Record<string, string | number | boolean | null | undefined>;

function escapeCsvValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function buildCsv(rows: CsvRow[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);

  const csvRows = [
    headers.join(","),
    ...rows.map(row =>
      headers.map(header => escapeCsvValue(row[header])).join(",")
    ),
  ];

  // BOM ajuda o Excel abrir acentos corretamente
  return `\uFEFF${csvRows.join("\n")}`;
}
