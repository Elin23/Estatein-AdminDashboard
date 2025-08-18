import { memo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";


function PropertiesCardSkeletonComponent() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full animate-pulse flex flex-col">
      <div className="relative">
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
        <div className="absolute top-2 left-2 h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3" />

          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
          </div>

          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
            ))}
          </div>
        </div>

        {(role === "admin" || role === "sales") && (
          <div className="mt-1 pt-4 flex gap-2 justify-end">
            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        )}
      </div>
    </div>
  );
}

const PropertiesCardSkeleton = memo(PropertiesCardSkeletonComponent);
export default PropertiesCardSkeleton;
