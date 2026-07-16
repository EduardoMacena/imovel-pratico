import fs from "fs";
import path from "path";

const roots = [
  "apps/web-client/src",
  "apps/web-admin/src",
];

const patterns = [
  "Centavos",
  "preco",
  "valor",
  "currency",
  "telefone",
  "phone",
  "celular",
  "whatsapp",
  "dataNascimento",
  "aniversario",
  "birthday",
  "createdAt",
  "updatedAt",
  "venceEm",
  "vencimento",
  "pagaEm",
  "confirmadaEm",
  "completedAt",
  "startedAt",
];

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(full);
    }

    if (!/\.(tsx|ts)$/.test(entry.name)) {
      return [];
    }

    if (entry.name.endsWith(".d.ts")) {
      return [];
    }

    if (full.includes("/lib/formatters.ts")) {
      return [];
    }

    return [full];
  });
}

for (const root of roots) {
  for (const file of walk(root)) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const lower = line.toLowerCase();

      const matched = patterns.some(pattern =>
        lower.includes(pattern.toLowerCase())
      );

      const alreadyFormatted =
        line.includes("formatCurrency") ||
        line.includes("formatPhone") ||
        line.includes("formatDate") ||
        line.includes("formatBirthday") ||
        line.includes("formatNumber") ||
        line.includes("toLocaleString");

      if (matched && !alreadyFormatted) {
        console.log(`${file}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}
