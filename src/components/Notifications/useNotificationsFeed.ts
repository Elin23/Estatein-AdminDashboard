import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // عدّل المسار لو لزم
import { limitToLast, onChildAdded, onValue, query, ref } from "firebase/database";
import type { NotificationItem } from "../../types/NotificationItem";

export function useNotificationsFeed(limit: number = 100) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [latestTs, setLatestTs] = useState<number>(0);

  useEffect(() => {
    const listRef = query(ref(db, "notifications"), limitToLast(limit));

    const offAll = onValue(listRef, (snap) => {
      const data = snap.val() || {};
      const arr: NotificationItem[] = Object.entries<any>(data)
        .map(([id, v]) => ({
          id,
          name: v?.name || "",
          email: v?.email || "",
          message: v?.message || "",
          formType: v?.formType || "",
          createdAt: typeof v?.createdAt === "number" ? v.createdAt : Date.now(),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setItems(arr);
      if (arr[0]) setLatestTs(arr[0].createdAt);
    });

    const offAdd = onChildAdded(listRef, (snap) => {
      const v = snap.val();
      const item: NotificationItem = {
        id: snap.key || crypto.randomUUID(),
        name: v?.name || "",
        email: v?.email || "",
        message: v?.message || "",
        formType: v?.formType || "",
        createdAt: typeof v?.createdAt === "number" ? v.createdAt : Date.now(),
      };
      setItems((prev) => {
        if (prev.some((p) => p.id === item.id)) return prev;
        const next = [item, ...prev].slice(0, limit);
        if (item.createdAt > latestTs) setLatestTs(item.createdAt);
        return next;
      });
    });

    return () => {
      offAll();
      offAdd();
    };
  }, [limit]);

  return { items, latestTs, setItems };
}
