import { XCircle, AlertCircle, Building2 } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';

function Reporting() {
    const {items , loading } = useAppSelector(state => state.locations);
    const locationsCount = items.length;  
  
    const cards = [
        { icon: <AlertCircle className="w-6 h-6 text-purple70" />, value: !loading ? "..." : locationsCount.toString(), label: "Submissions Pending" },
        { icon: <XCircle className="w-6 h-6 text-purple70" />, value: "2543", label: "Submissions Rejected" },
        { icon: <Building2 className="w-6 h-6 text-purple70" />, value: "2543", label: "Properties Available" },
        { icon: <Building2 className="w-6 h-6 text-purple70" />, value: "2543", label: "Properties Sold" },
    ];

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-0 w-full">
        {cards.map((item, index) => (
          <li
            key={index}
            className={`flex items-center gap-0.5 p-2 bg-white dark:bg-gray-800 rounded w-full shadow-sm duration-300 `}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary">
              {item.icon}
            </div>

            <div className="text-left">
              <h3 className="text-md font-bold text-gray-800 dark:text-white">{item.label}</h3>
              <p className="text-gray-800 dark:text-white">{item.value}</p>
            </div>
          </li>
        ))}
    </ul>
  )
}

export default Reporting
