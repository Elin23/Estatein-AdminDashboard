import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">Phone</h3>
            <p className="text-gray-600 dark:text-gray-300">+91 (123) 456-7890</p>
            <p className="text-gray-600 dark:text-gray-300">+91 (987) 654-3210</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">Email</h3>
            <p className="text-gray-600 dark:text-gray-300">info@cobrother.com</p>
            <p className="text-gray-600 dark:text-gray-300">support@cobrother.com</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">Address</h3>
            <p className="text-gray-600 dark:text-gray-300">
              123 Real Estate Avenue,<br />
              Hubli, Karnataka 580001,<br />
              India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;