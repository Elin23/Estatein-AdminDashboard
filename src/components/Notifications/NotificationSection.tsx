import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationsFeed } from "./useNotificationsFeed";
import { useUnread } from "./useUnread";
import NotificationItemRow from "./NotificationItemRow";

export default function NotificationSection() {
  const { items, latestTs, loading } = useNotificationsFeed(100);
  const { isUnread, hasNew, markAllAsRead, markOneAsRead } = useUnread();
  const navigate = useNavigate();

  const DEFAULT_LIMIT = 6;
  const [expanded, setExpanded] = useState(false);

  const showMoreNeeded = !loading && items.length > DEFAULT_LIMIT;
 const visibleItems = useMemo(
    () => (expanded ? items : items.slice(0, DEFAULT_LIMIT)),
    [items, expanded]
  );

  const openSubmissionAndMarkRead = (id: string) => {
    const notif = items.find((x) => x.id === id);
    markOneAsRead(id);

    const type = notif?.formType?.toLowerCase();
    if (type === "contact") {
      navigate("/contact"); 
    } else {
      navigate("/submissions");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6 w-full lg-custom:w-1/2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Notifications
          </h2>
          {hasNew(latestTs) && (
            <span
              className="inline-block h-2.5 w-2.5 rounded-full bg-red-500"
              aria-label="New notifications"
            />
          )}
        </div>

        <button
          onClick={() => markAllAsRead(items)}
          className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Mark all as read
        </button>
      </div>

      <ul
        className={`space-y-3 ${
          expanded && !loading
            ? "max-h-80 overflow-y-auto pr-1 -mr-1 overscroll-contain scrollarea"
            : ""
        }`}
        style={expanded && !loading ? { scrollbarGutter: "stable" } : undefined}
        aria-busy={loading}
      >
        {loading &&
          Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
            <li
              key={`sk-${i}`}
              className="border border-gray-300 dark:border-gray-700 rounded-xl p-3 animate-pulse"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
            </li>
          ))}

        {!loading &&
          visibleItems.map((n) => (
            <NotificationItemRow
              key={n.id}
              item={n}
              unread={isUnread(n)}
              onOpen={openSubmissionAndMarkRead}
            />
          ))}

        {!loading && items.length === 0 && (
          <li className="text-center text-gray-500 dark:text-gray-400 py-8">
            No notifications yet.
          </li>
        )}
      </ul>

      {showMoreNeeded && (
        <div className="mt-2 flex justify-center">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Show more
            </button>
          ) : (
            <button
              onClick={() => setExpanded(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
