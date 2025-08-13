import * as XLSX from "xlsx";
import type { Location } from "../redux/slices/locationSlice"; 

export function exportLocationsToExcel(locations: Location[]) {
  if (!locations.length) return;

  const dataToExport = locations.map((loc) => ({
    ID: loc.id,
    Branch: loc.data.branch,
    Address: loc.data.address,
    Details: loc.data.details,
    Email: loc.data.email,
    Phone: loc.data.phone,
    City: loc.data.city,
    Category: loc.data.category,
    CreatedAt: new Date(loc.data.createdAt).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");
  XLSX.writeFile(workbook, `locations_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
