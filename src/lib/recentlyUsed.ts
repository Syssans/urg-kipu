import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "urgence-plus:recent";
const MAX_ENTRIES = 3;

interface RecentEntry {
  id: string;
  ts: number;
}

function readRecent(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is RecentEntry => typeof x?.id === "string" && typeof x?.ts === "number");
  } catch {
    return [];
  }
}

function writeRecent(entries: RecentEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // stockage indisponible (navigation privée...) : on ignore silencieusement
  }
}

export function useRecentlyUsed() {
  const [recent, setRecent] = useState<RecentEntry[]>(() => readRecent());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setRecent(readRecent());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const recordVisit = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [{ id, ts: Date.now() }, ...prev.filter((r) => r.id !== id)].slice(0, MAX_ENTRIES);
      writeRecent(next);
      return next;
    });
  }, []);

  return { recent, recordVisit };
}

export function timeAgo(ts: number): string {
  const minutes = Math.floor((Date.now() - ts) / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `il y a ${weeks} sem`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}
