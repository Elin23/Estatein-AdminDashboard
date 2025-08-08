import React from 'react';
import { Mail } from 'lucide-react';
import type { Contact } from '../../types';
import ContactListItem from './ContactListItem';

interface ContactListProps {
  contacts: Contact[];
  onUpdateStatus: (id: string, status: Contact['status']) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onUpdateStatus }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Requests</h2>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <ContactListItem
              key={contact.id}
              contact={contact}
              onUpdateStatus={onUpdateStatus}
            />
          ))}

          {contacts.length === 0 && (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No contact requests yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;