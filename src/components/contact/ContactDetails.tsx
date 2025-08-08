import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import type { Contact } from '../../types';

interface ContactDetailsProps {
  contact: Contact;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{contact.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
          contact.status === 'read' ? 'bg-gray-100 text-gray-800' :
          'bg-green-100 text-green-800'
        }`}>
          {contact.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Mail className="w-4 h-4" />
          <a href={`mailto:${contact.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            {contact.email}
          </a>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          <span>{contact.createdAt.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="border-t dark:border-gray-700 pt-4">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">
          {contact.subject}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {contact.message}
        </p>
      </div>
    </div>
  );
};

export default ContactDetails;