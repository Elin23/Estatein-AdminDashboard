import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
 const getPaginationNumbers = (): (number | string)[] => {
   if (totalPages <= 4) {
     return Array.from({ length: totalPages }, (_, i) => i + 1);
   }

   if (currentPage <= 2) {
     return [1, 2, "...", totalPages];
   }

   if (currentPage >= totalPages - 1) {
     return [1, "...", totalPages - 1, totalPages];
   }

   return [1, "...", currentPage, "...", totalPages];
 };


  return (
    <div className="flex justify-center items-center gap-2 flex-wrap mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center bg-white border rounded-full w-9 h-9 sm:w-10 sm:h-10 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple90 transition"
      >
        <ChevronLeft size={16} />
      </button>

      {getPaginationNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center rounded-full w-9 h-9 sm:w-10 sm:h-10 text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? "bg-purple60 text-white shadow-md"
                : "bg-white border text-gray-700 hover:bg-purple90"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-gray-400 select-none text-sm">
            {page}
          </span>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center bg-white border rounded-full w-9 h-9 sm:w-10 sm:h-10 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple90  transition"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
