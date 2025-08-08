import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import type { FeedbackItem } from '../types';

const Feedback: React.FC = () => {
  const [feedbacks] = useState<FeedbackItem[]>([
    {
      id: '1',
      user: 'John Doe',
      message: 'Great property listings! Very helpful.',
      date: new Date('2024-03-10')
    },
    {
      id: '2',
      user: 'Jane Smith',
      message: 'Would love to see more agricultural properties.',
      date: new Date('2024-03-09')
    }
  ]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 h-[300px]">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <MessageSquare className="w-6 h-6 mr-2" />
        Notifications
      </h2>
      <div className="space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="border-l-4 border-purple70 pl-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{feedback.user}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{feedback.message}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {feedback.date.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;