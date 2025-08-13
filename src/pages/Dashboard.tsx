import { Users, CreditCard } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { Clock, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';

const Dashboard = () => {
  const {items , loading } = useAppSelector(state => state.locations);
  const locationsCount = items.length;  
  
  const cards = [
    { icon: <AlertCircle className="w-6 h-6" />, value: !loading ? "..." : locationsCount.toString(), label: "Submissions Pending", classExtra: "bg-[#CFE8FF] text-[#3C91E6]" },
    { icon: <Clock className="w-6 h-6" />, value: "2834", label: "Submissions Reviewed", classExtra: "bg-[#FFF2C6] text-[#FFCE26]" },
    { icon: <XCircle className="w-6 h-6" />, value: "2543", label: "Submissions Rejected", classExtra: "bg-[#FFE0D3] text-[#FD7238]" },
    { icon: <XCircle className="w-6 h-6" />, value: "2543", label: "Submissions Rejected", classExtra: "bg-[#FFE0D3] text-[#FD7238]" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-0 w-full">
        {cards.map((item, index) => (
          <li
            key={index}
            className={`flex items-center gap-0.5 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${item.classExtra}`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary">
              {item.icon}
            </div>

            <div className="text-left">
              <h3 className="text-lg font-semibold">{item.label}</h3>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;