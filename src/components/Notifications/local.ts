import { LAST_SEEN_KEY, SEEN_IDS_KEY } from "./keys";

export function loadSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_IDS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function saveSeenIds(set: Set<string>) {
  localStorage.setItem(SEEN_IDS_KEY, JSON.stringify([...set]));
}

export function getLastSeen(): number {
  return Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
}

export function setLastSeen(ts: number) {
  localStorage.setItem(LAST_SEEN_KEY, String(ts));
}
