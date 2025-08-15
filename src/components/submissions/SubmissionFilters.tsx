import React, { memo, useCallback, useMemo } from "react"
import type { FormSubmission } from "../../types"

interface SubmissionFiltersProps {
  selectedStatus: FormSubmission["status"] | "all"
  onStatusChange: (status: FormSubmission["status"] | "all") => void
  selectedCategory: string
  categories: string[]
  onCategoryChange: (category: string) => void
}

const SubmissionFilters: React.FC<SubmissionFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  selectedCategory,
  categories,
  onCategoryChange,
}) => {
  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onStatusChange(e.target.value as FormSubmission["status"] | "all")
    },
    [onStatusChange]
  )

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryChange(e.target.value)
    },
    [onCategoryChange]
  )

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      )),
    [categories]
  )

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <select
        value={selectedStatus}
        onChange={handleStatusChange}
        className="rounded-md bg-purple90 p-2.5 border-white90 dark:border-gray15 hover:text-purple75 transition-colors duration-300"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="rounded-md bg-purple90 p-2.5 border-white90 dark:border-gray15 hover:text-purple75 transition-colors duration-300"
      >
        <option value="">All Categories</option>
        {categoryOptions}
      </select>
    </div>
  )
}

export default memo(SubmissionFilters)
