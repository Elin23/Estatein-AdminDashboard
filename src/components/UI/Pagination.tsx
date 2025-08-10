import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePagination } from "../../hooks/usePagination";

interface PaginationProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export default function Pagination<T>({
  items,
  renderItem,
}: PaginationProps<T>) {
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    itemsPerPage,
    getPaginationNumbers,
  } = usePagination(items);

  return (
    <div>
      {/* Cards Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
        }}
      >
        {paginatedItems.map((item, _) => renderItem(item))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 flex-wrap mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center bg-white border rounded-full w-9 h-9 sm:w-10 sm:h-10 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple90 transition"
        >
          <ChevronLeft size={16} />
        </button>

        {getPaginationNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={`flex items-center justify-center rounded-full w-9 h-9 sm:w-10 sm:h-10 text-sm font-medium transition-all duration-200 ${
                page === currentPage
                  ? "bg-purple60 text-white shadow-md"
                  : "bg-white border text-gray-700 hover:bg-purple90"
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              className="px-2 text-gray-400 select-none text-sm"
            >
              {page}
            </span>
          )
        )}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center bg-white border rounded-full w-9 h-9 sm:w-10 sm:h-10 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple90 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}