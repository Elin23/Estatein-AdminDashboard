import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'How do I add a new property?',
      answer: 'Navigate to the Properties page and click on "Add New Property". Fill in all the required details including images, features, and location.'
    },
    {
      question: 'Can I edit property details after posting?',
      answer: 'Yes, you can edit any property details by clicking on the edit button on the property card.'
    },
    {
      question: 'How do I manage locations?',
      answer: 'Go to the Locations page where you can add new locations or remove existing ones.'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <HelpCircle className="w-6 h-6 mr-2" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
          >
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="font-medium text-gray-800 dark:text-white">{faq.question}</span>
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transform group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 pl-4">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;