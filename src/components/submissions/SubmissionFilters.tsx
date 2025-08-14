import React from 'react';
import type { FormSubmission } from '../../types';

interface SubmissionFiltersProps {
  selectedStatus: FormSubmission['status'] | 'all';
  onStatusChange: (status: FormSubmission['status'] | 'all') => void;
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

const SubmissionFilters: React.FC<SubmissionFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  selectedCategory,
  categories,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col  sm:flex-row sm:items-center gap-3">
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value as FormSubmission['status'] | 'all')}
        className="rounded-md  bg-purple90 p-2.5 border-white90 dark:border-gray15 hover:text-purple75 transition-colors duration-300"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-md  bg-purple90 p-2.5 border-white90 dark:border-gray15 hover:text-purple75 transition-colors duration-300"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default SubmissionFilters;