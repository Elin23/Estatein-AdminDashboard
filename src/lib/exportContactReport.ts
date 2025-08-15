import * as XLSX from "xlsx"
import type { ContactType } from "../types"

export function exportContactReport(contacts: ContactType[]) {
  if (!contacts.length) return

  const dataToExport = contacts.map((c) => ({
    ID: c.id,
    Name: c.name,
    Email: c.email,
    Subject: c.subject,
    Message: c.message,
    CreatedAt: c.createdAt.toLocaleDateString(),
    Status: c.status,
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataToExport)

  Object.keys(worksheet).forEach((cell) => {
    if (cell[0] === "!") return
    worksheet[cell].s = {
      alignment: { horizontal: "center", vertical: "center" },
    }
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts")
  XLSX.writeFile(
    workbook,
    `contacts_report_${new Date().toISOString().slice(0, 10)}.xlsx`
  )
}
