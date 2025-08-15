import { useMemo, useRef, useState } from "react"
import { getLastSeen, loadSeenIds, saveSeenIds, setLastSeen } from "./local"
import { SYNC_EVENT } from "./keys"
import type { NotificationItem } from "../../types/NotificationItem"

export function useUnread() {
  const [seenIds, setSeenIds] = useState<Set<string>>(() => loadSeenIds())
  const lastSeenAt = useMemo(() => getLastSeen(), [])
  const lastSeenRef = useRef<number>(lastSeenAt)

  const isUnread = (n: NotificationItem) =>
    n.createdAt > lastSeenRef.current && !seenIds.has(n.id)

  const hasNew = (latestTs: number) => latestTs > lastSeenRef.current

  const markAllAsRead = (items: NotificationItem[]) => {
    const now = Date.now()
    setLastSeen(now)
    lastSeenRef.current = now

    const next = new Set(seenIds)
    for (const n of items) next.add(n.id)
    setSeenIds(next)
    saveSeenIds(next)

    window.dispatchEvent(new Event(SYNC_EVENT))
  }

  const markOneAsRead = (id: string) => {
    const next = new Set(seenIds)
    next.add(id)
    setSeenIds(next)
    saveSeenIds(next)
    window.dispatchEvent(new Event(SYNC_EVENT))
  }

  return {
    seenIds,
    lastSeenRef,
    isUnread,
    hasNew,
    markAllAsRead,
    markOneAsRead,
  }
}
