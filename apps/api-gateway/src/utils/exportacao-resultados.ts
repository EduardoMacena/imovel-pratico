type JsonRecord = Record<string, unknown>;

type ResultadoExportavel = {
  logradouro: string;
  numero: string;
  complemento: string | null;
  indiceCadastral: string;
  nome: string | null;
  cpf: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  dadosContato: unknown;
};

type TarefaExportavel = {
  id: string;
  logradouro: string;
  numero: string;
  cliente: {
    nome: string;
    slug: string;
  };
  resultados: ResultadoExportavel[];
};

export type LinhaResultadoExportacao = {
  "Nome do Proprietário": string;
  CPF: string;
  "Endereço do Imóvel": string;
  "Índice Cadastral do Imóvel": string;
  Telefones: string;
  "E-mails": string;
  Renda: string;
};

function onlyDigits(value: string | number | null | undefined) {
  return String(value ?? "").replace(/\D/g, "");
}

function valueOrDash(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  const text = String(value).trim();

  return text || "-";
}

function parseDadosContato(value: unknown): JsonRecord {
  if (!value) {
    return {};
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;

      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as JsonRecord)
        : {};
    } catch {
      return {};
    }
  }

  return typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function uniqueValues(values: string[]) {
  return Array.from(
    new Set(values.map(value => value.trim()).filter(Boolean))
  );
}

export function formatCpfExport(value: string | number | null | undefined) {
  const digits = onlyDigits(value);

  if (digits.length !== 11) {
    return valueOrDash(value);
  }

  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export function formatTelefoneExport(value: string | number | null | undefined) {
  const digits = onlyDigits(value);

  if (!digits) {
    return "";
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

  return String(value ?? "");
}

function parseMoneyValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const text = String(value).trim();

  if (!text) {
    return null;
  }

  const hasComma = text.includes(",");
  const hasDot = text.includes(".");

  if (hasComma && hasDot) {
    const normalized = text.replace(/\./g, "").replace(",", ".");
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
  }

  if (hasComma) {
    const parsed = Number(text.replace(",", "."));

    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Number(text.replace(/[^\d.-]/g, ""));

  return Number.isFinite(parsed) ? parsed : null;
}

export function formatRendaExport(value: unknown) {
  const amount = parseMoneyValue(value);

  if (amount === null) {
    return valueOrDash(value);
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function montarEnderecoImovel(resultado: ResultadoExportavel) {
  return [
    resultado.logradouro,
    resultado.numero ? `nº ${resultado.numero}` : null,
    resultado.complemento,
  ]
    .filter(Boolean)
    .join(", ");
}

function extrairTelefones(resultado: ResultadoExportavel) {
  const dadosContato = parseDadosContato(resultado.dadosContato);
  const telefonesRaw = Array.isArray(dadosContato.telefones)
    ? dadosContato.telefones
    : [];

  const telefones = telefonesRaw
    .map(item => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const telefone = item as JsonRecord;

      return typeof telefone.telefoneComDDD === "string"
        ? telefone.telefoneComDDD
        : "";
    })
    .concat(resultado.telefone ?? "")
    .map(formatTelefoneExport)
    .filter(Boolean);

  return uniqueValues(telefones).join("; ") || "-";
}

function extrairEmails(resultado: ResultadoExportavel) {
  const dadosContato = parseDadosContato(resultado.dadosContato);
  const emailsRaw = Array.isArray(dadosContato.emails) ? dadosContato.emails : [];

  const emails = emailsRaw
    .map(item => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const email = item as JsonRecord;

      return typeof email.enderecoEmail === "string"
        ? email.enderecoEmail
        : "";
    })
    .concat(resultado.email ?? "")
    .filter(Boolean);

  return uniqueValues(emails).join("; ") || "-";
}

function extrairRenda(resultado: ResultadoExportavel) {
  const dadosContato = parseDadosContato(resultado.dadosContato);

  return formatRendaExport(dadosContato.rendaEstimada);
}

export function montarLinhasResultadoExportacao(
  tarefa: TarefaExportavel
): LinhaResultadoExportacao[] {
  return tarefa.resultados.map(resultado => ({
    "Nome do Proprietário": valueOrDash(resultado.nome),
    CPF: formatCpfExport(resultado.cpf),
    "Endereço do Imóvel": valueOrDash(montarEnderecoImovel(resultado)),
    "Índice Cadastral do Imóvel": valueOrDash(resultado.indiceCadastral),
    Telefones: extrairTelefones(resultado),
    "E-mails": extrairEmails(resultado),
    Renda: extrairRenda(resultado),
  }));
}

function drawTextBlock(params: {
  doc: any;
  label: string;
  value: string;
  x: number;
  y: number;
  width: number;
}) {
  const { doc, label, value, x, y, width } = params;

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor("#6B7280")
    .text(label.toUpperCase(), x, y, {
      width,
      continued: false,
    });

  const valueY = doc.y + 3;

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#172033")
    .text(value || "-", x, valueY, {
      width,
      lineGap: 2,
    });

  return doc.y + 10;
}

function ensurePdfPage(params: {
  doc: any;
  y: number;
  neededHeight: number;
  margin: number;
}) {
  const { doc, y, neededHeight, margin } = params;
  const maxY = doc.page.height - margin;

  if (y + neededHeight <= maxY) {
    return y;
  }

  doc.addPage();

  return margin;
}

export async function buildPdfResultadosProprietarios(params: {
  tarefa: TarefaExportavel;
  rows: LinhaResultadoExportacao[];
}) {
  const PDFKitModule = (await import("pdfkit")) as unknown as {
    default?: any;
  } & any;

  const PDFDocument = PDFKitModule.default ?? PDFKitModule;

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 42,
      info: {
        Title: "Relatório de Proprietários - Imóvel Prático",
        Author: "Imóvel Prático",
      },
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const margin = 42;
    const pageWidth = doc.page.width - margin * 2;

    doc
      .rect(0, 0, doc.page.width, 98)
      .fill("#0B1F33");

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#FFFFFF")
      .text("Relatório de Proprietários", margin, 28, {
        width: pageWidth,
      });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#C8A45D")
      .text("Imóvel Prático - Exportação comercial", margin, 58, {
        width: pageWidth,
      });

    let y = 122;

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#0B1F33")
      .text("Resumo da busca", margin, y);

    y += 20;

    const colWidth = (pageWidth - 16) / 2;

    y = drawTextBlock({
      doc,
      label: "Cliente",
      value: params.tarefa.cliente.nome,
      x: margin,
      y,
      width: colWidth,
    });

    drawTextBlock({
      doc,
      label: "Tarefa",
      value: params.tarefa.id,
      x: margin + colWidth + 16,
      y: y - 45,
      width: colWidth,
    });

    y += 8;

    y = drawTextBlock({
      doc,
      label: "Endereço pesquisado",
      value: `${params.tarefa.logradouro}, nº ${params.tarefa.numero}`,
      x: margin,
      y,
      width: colWidth,
    });

    drawTextBlock({
      doc,
      label: "Total de registros",
      value: String(params.rows.length),
      x: margin + colWidth + 16,
      y: y - 45,
      width: colWidth,
    });

    y += 16;

    doc
      .moveTo(margin, y)
      .lineTo(margin + pageWidth, y)
      .lineWidth(1)
      .strokeColor("#E3DED3")
      .stroke();

    y += 22;

    if (params.rows.length === 0) {
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#6B7280")
        .text("Nenhum resultado encontrado para esta tarefa.", margin, y, {
          width: pageWidth,
        });

      doc.end();
      return;
    }

    params.rows.forEach((row, index) => {
      y = ensurePdfPage({
        doc,
        y,
        neededHeight: 210,
        margin,
      });

      doc
        .roundedRect(margin, y, pageWidth, 28, 8)
        .fillAndStroke("#F7F4EE", "#E3DED3");

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#0B1F33")
        .text(`${index + 1}. ${row["Nome do Proprietário"]}`, margin + 12, y + 8, {
          width: pageWidth - 24,
        });

      y += 42;

      const leftX = margin + 12;
      const rightX = margin + pageWidth / 2 + 8;
      const fieldWidth = pageWidth / 2 - 24;

      const yStart = y;

      let leftY = y;
      let rightY = y;

      leftY = drawTextBlock({
        doc,
        label: "CPF",
        value: row.CPF,
        x: leftX,
        y: leftY,
        width: fieldWidth,
      });

      leftY = drawTextBlock({
        doc,
        label: "Endereço do imóvel",
        value: row["Endereço do Imóvel"],
        x: leftX,
        y: leftY,
        width: fieldWidth,
      });

      leftY = drawTextBlock({
        doc,
        label: "Índice cadastral do imóvel",
        value: row["Índice Cadastral do Imóvel"],
        x: leftX,
        y: leftY,
        width: fieldWidth,
      });

      rightY = drawTextBlock({
        doc,
        label: "Telefones",
        value: row.Telefones,
        x: rightX,
        y: rightY,
        width: fieldWidth,
      });

      rightY = drawTextBlock({
        doc,
        label: "E-mails",
        value: row["E-mails"],
        x: rightX,
        y: rightY,
        width: fieldWidth,
      });

      rightY = drawTextBlock({
        doc,
        label: "Renda",
        value: row.Renda,
        x: rightX,
        y: rightY,
        width: fieldWidth,
      });

      y = Math.max(leftY, rightY, yStart + 110);

      doc
        .moveTo(margin, y)
        .lineTo(margin + pageWidth, y)
        .lineWidth(0.8)
        .strokeColor("#E3DED3")
        .stroke();

      y += 18;
    });

    const totalPages = doc.bufferedPageRange().count;

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
      doc.switchToPage(pageIndex);

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#9CA3AF")
        .text(
          `Gerado em ${new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date())} - Página ${pageIndex + 1} de ${totalPages}`,
          margin,
          doc.page.height - 26,
          {
            width: pageWidth,
            align: "center",
          }
        );
    }

    doc.end();
  });
}
