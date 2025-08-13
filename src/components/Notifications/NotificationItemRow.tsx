import React from "react";
import type { NotificationItem } from "../../types/NotificationItem";

type Props = {
  item: NotificationItem;
  unread: boolean;
  onOpen: (id: string) => void;
};

const NotificationItemRow: React.FC<Props> = ({ item, unread, onOpen }) => {
  const handleKey = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(item.id);
    }
  };

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.id)}
      onKeyDown={handleKey}
      className="border border-gray-100 dark:border-gray-800 rounded-xl p-3 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800/60 outline-none focus:ring-2 focus:ring-purple70"
      title="Open in Submissions"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {item.formType || "form"}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="text-sm text-gray-800 dark:text-gray-100">
          <strong className="font-medium">{item.name || item.email || "User"}</strong>
          {item.message ? <>: {item.message}</> : null}
        </div>

        {unread && (
          <span
            className="shrink-0 mt-0.5 h-2.5 w-2.5 rounded-full bg-red-500"
            aria-label="Unread"
          />
        )}
      </div>
    </li>
  );
};

export default NotificationItemRow;
