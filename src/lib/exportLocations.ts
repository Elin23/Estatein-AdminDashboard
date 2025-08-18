import * as XLSX from "xlsx";
import type { Location } from "../types";

export function exportLocationsToExcel(locations: Location[]) {
  if (!locations.length) return;

  const dataToExport = locations.map((loc) => ({
    ID: loc.id,
    Branch: loc.branch,
    Address: loc.address,
    Details: loc.details,
    Email: loc.email,
    Phone: loc.phone,
    City: loc.city,
    Category: loc.category,
    CreatedAt: new Date(loc.createdAt).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");
  XLSX.writeFile(workbook, `locations_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
