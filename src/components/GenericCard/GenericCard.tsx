import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import GeneralBtn from "../buttons/GeneralBtn";

interface GenericCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  hasImage?: boolean;
  twitterLink?: string;
  email?: string;
}

export default function GenericCard({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  onEdit,
  onDelete,
  loading,
  hasImage,
  twitterLink,
  email,
}: GenericCardProps) {
  const role = useSelector((state: RootState) => state.auth.role) || '';

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow animate-pulse w-full huge:max-w-[452px]">

        {hasImage && (
          <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        )}

        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
        {twitterLink && (
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        )}
        <div className="flex space-x-2 justify-end">
          <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow huge:max-w-[452px] h-full flex flex-col">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt || title || ""}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      {subtitle && <h4 className="text-md font-semibold text-purple70">{subtitle}</h4>}
      {title && <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>}

      {description && <p className="text-gray08 dark:text-gray75">{description}</p>}


      {twitterLink && (
        <div className="mt-3">
          <a
            href={twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:underline text-gray-800 dark:text-white "
            aria-label="Twitter profile"
            title="Twitter"
          >
            <span>Twitter</span>
          </a>
        </div>
      )}

      {email && (
        <div className="mt-3">
          <a
            href={`mailto:${email}`}
    className="inline-flex items-center gap-2 hover:underline text-gray-800 dark:text-white w-full whitespace-normal break-words break-all"
            aria-label="Email"
            title="Email"
          >
            <span>Email: {email}</span>
          </a>
        </div>
      )}

      {(role === "admin") && (
      <div className="mt-auto pt-4 flex justify-end items-end space-x-2">
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
          />
        )}
      </div>)}
    </div>
  );
}
