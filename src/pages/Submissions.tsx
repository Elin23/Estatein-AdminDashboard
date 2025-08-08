import React, { useState, useMemo } from 'react';
import SubmissionCard from '../components/submissions/SubmissionCard';
import SubmissionFilters from '../components/submissions/SubmissionFilters';
import type { FormSubmission } from '../types';

const Submissions = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([
    // Sample submission for testing
    {
      id: '1',
      formId: '1',
      formName: 'Property Interest Form',
      category: 'Residential',
      submittedAt: new Date(),
      status: 'pending',
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        propertyType: 'Apartment',
        budget: '$500,000',
      },
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState<FormSubmission['status'] | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => 
    Array.from(new Set(submissions.map(s => s.category))),
    [submissions]
  );

  const filteredSubmissions = useMemo(() => 
    submissions.filter(submission => 
      (selectedStatus === 'all' || submission.status === selectedStatus) &&
      (!selectedCategory || submission.category === selectedCategory)
    ),
    [submissions, selectedStatus, selectedCategory]
  );

  const handleUpdateStatus = (id: string, status: FormSubmission['status']) => {
    setSubmissions(submissions.map(submission =>
      submission.id === id ? { ...submission, status } : submission
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Form Submissions</h1>
      </div>

      <SubmissionFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubmissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No submissions found matching the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default Submissions;