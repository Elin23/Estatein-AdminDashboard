import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { ValuedClient } from "../../types/ValuedClient";
import GeneralBtn from "../buttons/GeneralBtn";

interface ValuedClientCardProps {
  client?: ValuedClient;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
}

export default function ValuedClientCard({
  client,
  onEdit,
  onDelete,
  loading,
}: ValuedClientCardProps) {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow animate-pulse w-full huge:max-w-[452px] h-full">
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
        <div className="flex space-x-2 justify-end">
          <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const {  title, since, domain, category, review, website } = client;
  const cardTitle = title  || domain || "Valued Client";
  const normalizedWebsite = website && !/^https?:\/\//i.test(website) ? `https://${website}` : website;
  const displayUrl = normalizedWebsite ? normalizedWebsite.replace(/^https?:\/\//i, "") : "";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow huge:max-w-[452px] h-full flex flex-col">
      {since && (
        <h4 className="text-md font-semibold text-purple70">
          Since {since}
        </h4>
      )}

      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
        {cardTitle}
      </h3>

      <div className="mt-2 space-y-1">
        {domain && (
          <p className="text-gray-800 dark:text-white">
            <span className="font-semibold">Domain: </span>
            {domain}
          </p>
        )}
        {category && (
          <p className="text-gray-800 dark:text-white">
            <span className="font-semibold">Category: </span>
            {category}
          </p>
        )}
        {normalizedWebsite && (
          <p className="text-gray-800 dark:text-white break-all">
            <span className="font-semibold">Website: </span>
            <a href={normalizedWebsite} target="_blank" rel="noopener noreferrer" className="underline">
              {displayUrl}
            </a>
          </p>
        )}
      </div>

      {review && (
        <p className="text-gray-800 dark:text-white mt-3 whitespace-pre-wrap">
          {review}
        </p>
      )}



      {role === "admin" && (onEdit || onDelete) && (
        <div className="mt-auto pt-4 flex justify-end space-x-2">
          {onEdit && (
            <GeneralBtn
              btnContent="Edit"
              actionToDo={onEdit}
              btnType="update"
            />
          )}
      {onDelete && (
          <GeneralBtn
          btnContent="Delete"
          actionToDo={onDelete}
          btnType="delete"
          targetLabel={title}
          />
        )}
        </div>
      )}
    </div>
  );
}
