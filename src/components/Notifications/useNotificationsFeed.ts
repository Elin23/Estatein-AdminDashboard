import { useEffect, useMemo, useState } from "react";
import {
  getDatabase,
  ref as r,
  query,
  orderByChild,
  limitToLast,
  onValue,
} from "firebase/database";

export type NotificationItem = {
  id: string;
  formType?: string;
  name?: string;
  email?: string;
  message?: string;
  createdAt: number; 
};

export function useNotificationsFeed(limit = 100) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const q = query(
      r(db, "notifications"),
      orderByChild("createdAt"),
      limitToLast(limit)
    );

    const unsub = onValue(
      q,
      (snap) => {
        const val = snap.val();
        if (!val) {
          setItems([]);
          setLoading(false);
          return;
        }

        const list: NotificationItem[] = Object.entries(val).map(
          ([id, v]: any) => ({
            id,
            formType: v?.formType ?? "form",
            name: v?.name ?? "",
            email: v?.email ?? "",
            message: v?.message ?? "",
            createdAt: typeof v?.createdAt === "number" ? v.createdAt : Date.now(),
          })
        );

        list.sort((a, b) => b.createdAt - a.createdAt);
        setItems(list);
        setLoading(false);
      },
      () => {
        setItems([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [limit]);

  const latestTs = useMemo(() => (items[0]?.createdAt ?? 0), [items]);

  return { items, latestTs, loading };
}
