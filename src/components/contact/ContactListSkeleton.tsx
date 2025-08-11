import React from "react";

type SkeletonProps = { className?: string };
export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    aria-hidden="true"
  />
);

type ContactListSkeletonProps = { count?: number };
export const ContactListSkeleton: React.FC<ContactListSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="h-4 w-48 mb-2" />  
              <Skeleton className="h-3 w-32 mb-4" /> 
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-5/6" />      
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <Skeleton className="h-8 w-24" />        
              <Skeleton className="h-8 w-24" />       
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Skeleton className="h-3 w-24" />          
            <Skeleton className="h-3 w-20" />         
          </div>
        </div>
      ))}
    </div>
  );
};
