import { XCircle, AlertCircle, Building2 } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';

function Reporting() {
    const { items: submissions, loading: submissionsLoading } = useAppSelector(
        (state) => state.submissions
    );
    const { list: properties, loading: propertiesLoading } = useAppSelector(
        (state) => state.properties
    );

    const pendingCount = submissions.filter((s) => s.status === "pending").length;
    const rejectedCount = submissions.filter((s) => s.status === "rejected").length;
    const availableCount = properties.filter((p) => p.status === "available").length;
    const soldCount = properties.filter((p) => p.status === "sold").length;

    const cards = [
        { icon: <AlertCircle className="w-6 h-6 text-purple70" />, value: submissionsLoading ? "..." : pendingCount.toString(), label: "Submissions Pending" },
        { icon: <XCircle className="w-6 h-6 text-purple70" />, value: submissionsLoading ? "..." : rejectedCount.toString(), label: "Submissions Rejected" },
        { icon: <Building2 className="w-6 h-6 text-purple70" />, value: propertiesLoading ? "..." : availableCount.toString(), label: "Properties Available" },
        { icon: <Building2 className="w-6 h-6 text-purple70" />, value: propertiesLoading ? "..." : soldCount.toString(), label: "Properties Sold" },
    ];

    return (
      <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-0 w-full">
        {cards.map((item, index) => (
          <li
            key={index}
            className={`flex items-center gap-0.5 max-[390px]:p-1 min-[391px]:p-3 bg-white dark:bg-gray-800 rounded-xl w-full shadow-sm duration-300 `}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary">
              {item.icon}
            </div>

            <div className="text-left">
              <h3 className="text-md font-bold text-gray-800 dark:text-white">
                {item.label}
              </h3>
              <p className="text-gray-800 dark:text-white">{item.value}</p>
            </div>
          </li>
        ))}
      </ul>
    );
}

export default Reporting
