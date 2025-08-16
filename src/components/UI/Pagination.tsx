import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePagination } from "../../hooks/usePagination"
import GenericCard from "../GenericCard/GenericCard"
import React from "react"

interface PaginationProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  loading?: boolean
}

export default function Pagination<T>({
  items,
  renderItem,
  loading = false,
}: PaginationProps<T>) {
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    itemsPerPage,
    getPaginationNumbers,
  } = usePagination(items)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 huge:max-w-[1390px] huge:mx-auto">
        {Array.from({ length: 3 }).map((_, idx) => (
          <GenericCard key={idx} loading />
        ))}
      </div>
    )
  }
  return (
    <div>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
        }}
      >
        {paginatedItems.map((item) => (
          <React.Fragment key={(item as any).id}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>

      <div className="flex  sm:flex-row justify-center items-center gap-2  sm:space-y-0 space-y-3 flex-wrap mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center bg-white border rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple90 transition"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex  items-center justify-center gap-2 ">
          {getPaginationNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`flex  items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 text-sm font-medium transition-all duration-200 ${
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
                className="px-2 text-gray-400 select-none text-[12px] sm:text-sm"
              >
                {page}
              </span>
            )
          )}
        </div>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center mb-2 lg-custom:mb-0 justify-center bg-white border rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple90 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
