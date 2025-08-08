import React, { useState } from 'react';
import ContactList from '../components/contact/ContactList';
import type { Contact } from '../types';

const Contact = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Interested in residential properties in Hubli',
      message: 'I am looking for a 3BHK residential property in Hubli. Please share available options.',
      createdAt: new Date('2024-03-15'),
      status: 'new'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Commercial property inquiry',
      message: 'Looking for commercial properties in Dharwad for setting up an office space.',
      createdAt: new Date('2024-03-14'),
      status: 'replied'
    }
  ]);

  const handleUpdateStatus = (id: string, status: Contact['status']) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, status } : contact
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Contact Requests</h1>
      <ContactList 
        contacts={contacts}
        onUpdateStatus={handleUpdateStatus} 
      />
    </div>
  );
};

export default Contact;