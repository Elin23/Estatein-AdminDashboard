import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import { addBotCommand, cleanupSubscription, deleteBotCommand, subscribeToBotCommands, updateBotCommand } from "../redux/slices/botCommandsSlice";
import GeneralBtn from "./buttons/GeneralBtn";


const SHOW_LIMIT = 5;

export default function BotCommands() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);

  const { items, loading } = useAppSelector((state) => state.botCommands);

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

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    dispatch(addBotCommand(text));
    setNewText("");
  };

  const handleEdit = () => {
    const text = editText.trim();
    if (!text) return;
    dispatch(updateBotCommand({ id: editingId!, text }));
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

  const visibleItems = expanded ? items : items.slice(0, SHOW_LIMIT);
  const showMoreNeeded = items.length > SHOW_LIMIT;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6 w-full lg-custom:w-1/2">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-5">
        ChatBot Commands
      </h1>

      {role === "admin" && (
        <div className="flex gap-2">
          <input
            className="flex-1 text-gray-800 dark:text-gray-100 border border-gray-400 dark:border-gray-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple70"
            placeholder="Type a command (instruction) and click Add"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-60"
            disabled={!newText.trim() || loading}
          >
            {loading ? "..." : "Add"}
          </button>
        </div>
      )}

      <div
        className={[
          "mt-3 space-y-3",
          expanded ? "max-h-80 overflow-y-auto pr-1" : "",
        ].join(" ")}
      >
        {items.length === 0 ? (
          <div className="p-4 text-gray-500 border border-gray-400 dark:border-gray-600 rounded-xl">
            No commands yet.
          </div>
        ) : (
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
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-between w-full break-words text-gray-800 dark:text-gray-100 items-center">
                    <div className="w-1/2 line-clamp-1">{item.text}</div>
                    {role === "admin" && (
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
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

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