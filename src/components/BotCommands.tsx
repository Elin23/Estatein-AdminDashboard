import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import {
  addBotCommand,
  cleanupSubscription,
  deleteBotCommand,
  subscribeToBotCommands,
  updateBotCommand,
} from "../redux/slices/botCommandsSlice";
import GeneralBtn from "./buttons/GeneralBtn";

const SHOW_LIMIT = 5;

export default function BotCommands() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.botCommands);

  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    dispatch(subscribeToBotCommands());
    return () => {
      dispatch(cleanupSubscription());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("BotCommands Error:", error);
    }
  }, [error]);

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    dispatch(addBotCommand(text));
    setNewText("");
  };

  const handleEdit = () => {
    const text = editText.trim();
    if (!text || !editingId) return;
    dispatch(updateBotCommand({ id: editingId, text }));
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBotCommand(id));
    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  // ✅ ترتيب العناصر (الجدد بالأعلى)
  const sortedItems = [...items].sort((a, b) => {
    const aTime = a.createdAt ?? 0;
    const bTime = b.createdAt ?? 0;

    if (aTime && bTime) {
      return bTime - aTime; // الأحدث أولاً
    }
    // fallback حسب id
    return b.id.localeCompare(a.id);
  });

  const showMoreNeeded = !loading && sortedItems.length > SHOW_LIMIT;
  const visibleItems = expanded
    ? sortedItems
    : sortedItems.slice(0, SHOW_LIMIT);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-1 sm:p-4 md:p-6 w-full lg-custom:w-1/2 min-w-0">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-5">
        ChatBot Commands
      </h1>

      <div className="flex gap-2">
        <input
          className="flex-1 text-gray-800 dark:text-gray-100 border border-gray-400 dark:border-gray-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple70 disabled:opacity-60"
          placeholder="Type a command (instruction) and click Add"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
        />
        <GeneralBtn
          btnContent="Add"
          actionToDo={handleAdd}
          btnType="add"
          disabled={loading}
        />
      </div>

      <div
        className={[
          "mt-3 space-y-3",
          expanded ? "max-h-80 overflow-y-auto pr-1" : "",
        ].join(" ")}
        aria-busy={loading}
      >
        {/* Skeleton Loader */}
        {loading &&
          Array.from({ length: SHOW_LIMIT }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="p-3 flex items-start justify-between gap-2 border border-gray-300 dark:border-gray-700 rounded-xl animate-pulse"
            >
              <div className="flex-1">
                <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex gap-2 shrink-0">
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}

        {!loading && sortedItems.length === 0 && (
          <div className="p-4 text-gray-500 border border-gray-400 dark:border-gray-600 rounded-xl">
            No commands yet.
          </div>
        )}

        {!loading &&
          visibleItems.map((item) => (
            <div
              key={item.id}
              className="p-3 flex items-start gap-2 border border-gray-400 dark:border-gray-600 rounded-xl"
            >
              {editingId === item.id ? (
                <>
                  <input
                    className="flex-1 border rounded p-2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <GeneralBtn
                    btnContent="Update"
                    actionToDo={handleEdit}
                    btnType="update"
                  />
                  <GeneralBtn
                    btnContent="Cancel"
                    actionToDo={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    btnType="cancel"
                  />
                </>
              ) : (
                <div className="flex justify-between w-full break-words text-gray-800 dark:text-gray-100 items-center">
                  <div className="w-1/2 line-clamp-1">{item.text}</div>
                  <div className="flex gap-2">
                    <GeneralBtn
                      btnContent="Edit"
                      actionToDo={() => {
                        setEditingId(item.id);
                        setEditText(item.text);
                      }}
                      btnType="update"
                    />
                    <GeneralBtn
                      btnContent="Delete"
                      actionToDo={() => handleDelete(item.id)}
                      btnType="delete"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {showMoreNeeded && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            title={expanded ? "Show less" : "Show more"}
            className={[
              "group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
              "bg-white/80 dark:bg-gray-800/80 backdrop-blur",
              "border border-gray-200 dark:border-gray-700",
              "text-gray-700 dark:text-gray-200",
              "shadow-sm hover:shadow-md",
              "transition-all duration-200 hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-offset-2 focus-visible:ring-purple-500",
            ].join(" ")}
          >
            <span>{expanded ? "Show less" : "Show more"}</span>
            <ChevronDown
              className={[
                "h-4 w-4 transition-transform duration-200",
                expanded ? "rotate-180" : "rotate-0",
                "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
              ].join(" ")}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </div>
  );
}
