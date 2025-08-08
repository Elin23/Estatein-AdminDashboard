import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { FormSubmission } from '../../types';

interface SubmissionCardProps {
  submission: FormSubmission;
  onUpdateStatus: (id: string, status: FormSubmission['status']) => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, onUpdateStatus }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: AlertCircle,
    reviewed: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const StatusIcon = statusIcons[submission.status];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{submission.formName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{submission.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusColors[submission.status]}`}>
          <StatusIcon className="w-4 h-4" />
          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {Object.entries(submission.data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{key}:</span>
            <span className="text-sm text-gray-800 dark:text-gray-200">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        {submission.status !== 'approved' && (
          <button
            onClick={() => onUpdateStatus(submission.id, 'approved')}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Approve
          </button>
        )}
        {submission.status !== 'rejected' && (
          <button
            onClick={() => onUpdateStatus(submission.id, 'rejected')}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Reject
          </button>
        )}
        {submission.status !== 'reviewed' && (
          <button
            onClick={() => onUpdateStatus(submission.id, 'reviewed')}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Mark as Reviewed
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Submitted on {submission.submittedAt.toLocaleDateString()}
      </div>
    </div>
  );
};

export default SubmissionCard;