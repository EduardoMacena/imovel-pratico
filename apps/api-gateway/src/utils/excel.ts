import { Buffer } from "node:buffer";
import ExcelJS from "exceljs";

type ExcelRow = Record<string, string | number | boolean | null | undefined>;

export async function buildExcelBuffer(rows: ExcelRow[], sheetName = "Resultados") {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Imóvel Prático";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  if (rows.length === 0) {
    worksheet.columns = [
      {
        header: "mensagem",
        key: "mensagem",
        width: 40,
      },
    ];

    worksheet.addRow({
      mensagem: "Nenhum resultado encontrado",
    });
  } else {
    const headers = Object.keys(rows[0]);

    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: Math.max(header.length + 6, 18),
    }));

    worksheet.addRows(rows);
  }

  worksheet.getRow(1).font = {
    bold: true,
  };

  worksheet.getRow(1).alignment = {
    vertical: "middle",
  };

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  worksheet.autoFilter = {
    from: {
      row: 1,
      column: 1,
    },
    to: {
      row: 1,
      column: worksheet.columnCount,
    },
  };

  const buffer = await workbook.xlsx.writeBuffer();

  return Buffer.isBuffer(buffer)
    ? buffer
    : Buffer.from(buffer as ArrayBuffer);
}
