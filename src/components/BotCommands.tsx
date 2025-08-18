import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  ref as r,
  onValue,
  push,
  set,
  update,
  remove,
} from "firebase/database";
import { db } from "../firebaseConfig";
import GeneralBtn from "./buttons/GeneralBtn";

type Command = { id: string; text: string; createdAt?: number };

export default function BotCommands() {
  const [newText, setNewText] = useState("");
  const [items, setItems] = useState<Command[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [expanded, setExpanded] = useState(false);
  const SHOW_LIMIT = 5;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(
      r(db, "admin/botCommands"),
      (snap) => {
        const val = snap.val() || {};
        const list: Command[] = Object.entries(val).map(([id, v]: any) => ({
          id,
          text: v?.text ?? "",
          createdAt: v?.createdAt ?? 0,
        }));
        list.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
        setItems(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const add = async () => {
    const text = newText.trim();
    if (!text) return;
    const keyRef = push(r(db, "admin/botCommands"));
    await set(keyRef, { text, createdAt: Date.now() });
    setNewText("");
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async () => {
    const text = editText.trim();
    if (!editingId) return;
    await update(r(db, `admin/botCommands/${editingId}`), { text });
    setEditingId(null);
    setEditText("");
  };

  const del = async (id: string) => {
    await remove(r(db, `admin/botCommands/${id}`));
    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  const showMoreNeeded = !loading && items.length > SHOW_LIMIT;
  const visibleItems = expanded ? items : items.slice(0, SHOW_LIMIT);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 md:p-6 w-full lg-custom:w-1/2">
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
        />
        <GeneralBtn
          btnContent="Add"
          actionToDo={add}
          btnType="add"
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

        {!loading && items.length === 0 && (
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
                    actionToDo={saveEdit}
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
                      actionToDo={() => startEdit(item.id, item.text)}
                      btnType="update"
                    />
                    <GeneralBtn
                      btnContent="Delete"
                      actionToDo={() => del(item.id)}
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
