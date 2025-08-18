import * as XLSX from "xlsx";

interface ExportButtonProps<T> {
  data: T[];
  fileName?: string;
  getSheetName?: () => string;
  mapData?: (item: T) => Record<string, any>; 
  onExport?: (data: T[]) => void; 
  buttonLabel?: string;
  disabled?: boolean;
}

function ExportButton<T>({
  data,
  fileName,
  getSheetName,
  mapData,
  onExport,
  buttonLabel = "Export To Excel",
  disabled = false,
}: ExportButtonProps<T>) {
  const handleExport = () => {
    if (!data.length) return;

    if (onExport) {
      onExport(data);
    } else if (mapData) {
      const exportData = data.map(mapData);
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, getSheetName?.() || "Report");
      XLSX.writeFile(workbook, fileName || `report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } else {
      console.warn("No export method provided (onExport or mapData)");
    }
  };

  return (
<button
  onClick={handleExport}
  className="
    rounded-xl px-4 py-2
    bg-purple65 hover:bg-purple60 text-white
    ring-2 ring-purple65           
    ring-offset-2                 
    ring-offset-white dark:ring-offset-gray-900  
    disabled:opacity-60 disabled:cursor-not-allowed
    transition-colors
  "
  disabled={disabled || data.length === 0}
  title={disabled || data.length === 0 ? 'No data to export' : buttonLabel}
>
  {buttonLabel}
</button>
  );
}

export default ExportButton;
