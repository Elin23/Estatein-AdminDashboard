
type Props = {
  lines?: number; 
  className?: string;
};

const SubmissionCardSkeleton: React.FC<Props> = ({ lines = 10, className = "" }) => {
  const widths = ["w-24","w-28","w-20","w-32","w-16","w-36","w-24","w-28","w-32","w-40"];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 huge:max-w-[452px] animate-pulse ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mt-2" />
        </div>
        <div className="px-0 py-0">
          <div className="h-7 w-28 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex justify-between items-start gap-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
            <div className={`h-4 bg-gray-300 dark:bg-gray-700 rounded ${widths[i % widths.length]}`} />
          </div>
        ))}
        <div className="flex justify-between items-start gap-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
          <div className="space-y-2 w-3/4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <div className="h-9 w-28 bg-gray-300 dark:bg-gray-700 rounded-md" />
        <div className="h-9 w-40 bg-gray-300 dark:bg-gray-700 rounded-md" />
        <div className="h-9 w-32 bg-gray-300 dark:bg-gray-700 rounded-md" />
      </div>
      <div className="mt-4 h-3 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );
};

export default SubmissionCardSkeleton;
