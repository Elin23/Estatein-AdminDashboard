import React, { useState } from 'react';
import { Check, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import type { Contact } from '../../types';

interface ContactListItemProps {
  contact: Contact;
  onUpdateStatus: (id: string, status: Contact['status']) => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ 
  contact, 
  onUpdateStatus 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    read: 'bg-gray-100 text-gray-800',
    replied: 'bg-green-100 text-green-800',
  };

  return (
    <div 
      className="border-l-4 pl-4 py-3 rounded-r-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-800 dark:text-white">{contact.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{contact.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Received on {contact.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contact.status]}`}>
            {contact.status}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{contact.subject}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{contact.message}</p>
          </div>
          <div className="flex gap-2 pt-2">
            {contact.status === 'new' && (
              <button
                onClick={() => onUpdateStatus(contact.id, 'read')}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Check className="w-4 h-4" /> Mark as Read
              </button>
            )}
            {contact.status !== 'replied' && (
              <button
                onClick={() => onUpdateStatus(contact.id, 'replied')}
                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
              >
                <Reply className="w-4 h-4" /> Mark as Replied
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactListItem;