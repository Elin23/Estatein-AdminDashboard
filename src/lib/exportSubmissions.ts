import * as XLSX from "xlsx";
import type { FormSubmission } from "../types";

export function exportSubmissionsToExcel(submissions: FormSubmission[]) {
  if (!submissions.length) return;

  const dataToExport = submissions.map((s) => ({
    ID: s.id,
    FormName: s.formName,
    Category: s.category,
    SubmittedAt: s.submittedAt.toLocaleString(),
    Status: s.status,
    FirstName: s.data.firstName,
    LastName: s.data.lastName,
    Email: s.data.email,
    Phone: s.data.phone,
    Location: s.data.location,
    PropertyType: s.data.propertyType,
    Bedrooms: s.data.bedrooms,
    Bathrooms: s.data.bathrooms,
    Budget: s.data.budget,
    Message: s.data.message,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  const range = XLSX.utils.decode_range(worksheet['!ref']!);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cell_address]) continue;
      if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
      worksheet[cell_address].s.alignment = { horizontal: "center", vertical: "center" };
    }
  }

  const firstRowNumber = range.s.r;
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = XLSX.utils.encode_cell({ r: firstRowNumber, c: C });
    if (!worksheet[cell_address]) continue;
    worksheet[cell_address].s = {
      ...worksheet[cell_address].s,
      fill: {
        fgColor: { rgb: "FFD700" },
      },
      font: {
        bold: true,
        color: { rgb: "000000" },
      },
    };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
  XLSX.writeFile(workbook, `submissions_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
