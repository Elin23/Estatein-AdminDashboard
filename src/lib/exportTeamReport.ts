import * as XLSX from "xlsx";
import type { TeamMember } from "../types";

export function exportTeamReport(members: TeamMember[]) {
  if (!members.length) return;

  const dataToExport = members.map((m) => ({
    ID: m.id,
    Name: m.name,
    Role: m.role,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cell_address]) continue;
      if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
      worksheet[cell_address].s.alignment = { horizontal: "center", vertical: "center" };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Team");

  XLSX.writeFile(workbook, `team_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
