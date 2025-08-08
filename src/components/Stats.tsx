import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">{Math.abs(trend)}% from last month</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

const Stats = () => {
  // Empty stats component since all cards were removed
  return null;
};

export default Stats;