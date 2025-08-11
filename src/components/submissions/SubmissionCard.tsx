import React, { useEffect, useMemo, useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';
import type { FormSubmission } from '../../types';
import EmailReplyModalUI from '../EmailForm/EmailReplyModalUI';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetEmailState,
  selectEmailError,
  selectEmailSending,
  selectEmailSuccess,
  sendEmail,
} from '../../redux/slices/emailSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { composeEmailMessage } from '../EmailForm/composeEmailMessage';

interface SubmissionCardProps {
  submission: FormSubmission;
  onUpdateStatus: (id: string, status: FormSubmission['status']) => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role) || '';

  const dispatch = useDispatch<AppDispatch>();
  const sending = useSelector(selectEmailSending);
  const sendError = useSelector(selectEmailError);
  const sendSuccess = useSelector(selectEmailSuccess);

  const StatusIcon = {
    pending: AlertCircle,
    reviewed: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  }[submission.status];

  const firstName =
    (submission.data?.firstName as string) ||
    (submission.data?.name as string) ||
    (submission.data?.fullName as string) ||
    '';

  const email =
    (submission.data?.email as string) ||
    (submission.data?.Email as string) ||
    '';

  const { subject: defaultSubject, message: defaultMessage } = useMemo(
    () => composeEmailMessage(submission),
    [submission]
  );

  const handleSendEmail = async ({
    to,
    subject,
    message,
  }: {
    to: string;
    subject: string;
    message: string;
  }) => {
    const finalSubject = subject?.trim() ? subject : defaultSubject;
    const finalMessage = message?.trim() ? message : defaultMessage;

    dispatch(
      sendEmail({
        to,
        subject: finalSubject,
        message: finalMessage,
        meta: {
          customer_name: firstName || 'there',
          form_name: submission.formName,
          category: submission.category,
        },
      })
    );
  };

  useEffect(() => {
  if (sendSuccess && !sending) {
    const t = setTimeout(() => closeModal(), 1200);
    return () => clearTimeout(t);
  }
}, [sendSuccess, sending]);


  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(resetEmailState());
  };

  return (

    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 huge:max-w-[452px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {submission.formName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {submission.category}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
            {
              pending: 'bg-yellow-100 text-yellow-800',
              reviewed: 'bg-blue-100 text-blue-800',
              approved: 'bg-green-100 text-green-800',
              rejected: 'bg-red-100 text-red-800',
            }[submission.status]
          }`}
        >
          {StatusIcon && <StatusIcon className="w-4 h-4" />}
          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {Object.entries(submission.data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{key}:</span>
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {String(value)}
            </span>
          </div>
        ))}
      </div>
      {(role === "admin" || role === "sales") && (
      <div className="mt-6 flex flex-wrap gap-2">
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm flex items-center gap-1"
        >
          <Mail className="w-4 h-4" />
          Send Email
        </button>
      </div>
      )}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Submitted on {submission.submittedAt.toLocaleDateString()}
      </div>

      <EmailReplyModalUI
        open={isModalOpen}
        onClose={closeModal}
        title="Send an Email to the client"
        onSubmit={handleSendEmail}
        loading={sending}
        error={sendError}
        success={sendSuccess}
        defaultEmail={email}
        defaultSubject={defaultSubject}
        defaultMessage={defaultMessage}
      />
    </div>
  );
};

export default SubmissionCard;