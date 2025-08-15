import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationsFeed } from "./useNotificationsFeed";
import { useUnread } from "./useUnread";
import NotificationItemRow from "./NotificationItemRow";

export default function NotificationSection() {
  const { items, latestTs } = useNotificationsFeed(100);
  const { isUnread, hasNew, markAllAsRead, markOneAsRead } = useUnread();
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const navigate = useNavigate();

  const canShowMore = visibleCount < items.length;
  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const showMore = () => setVisibleCount((c) => Math.min(c + 5, items.length));
  const openSubmissionAndMarkRead = (id: string) => {
    markOneAsRead(id);
    navigate("/submissions");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Notifications
          </h2>
          {hasNew(latestTs) && (
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" aria-label="New notifications" />
          )}
        </div>

        <button
          onClick={() => markAllAsRead(items)}
          className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Mark all as read
        </button>
      </div>

      <ul className="space-y-3">
        {visibleItems.map((n) => (
          <NotificationItemRow
            key={n.id}
            item={n}
            unread={isUnread(n)}
            onOpen={openSubmissionAndMarkRead}
          />
        ))}

        {items.length === 0 && (
          <li className="text-center text-gray-500 dark:text-gray-400 py-8">
            No notifications yet.
          </li>
        )}
      </ul>

      {canShowMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={showMore}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
