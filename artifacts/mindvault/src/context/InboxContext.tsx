import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CaptureType = "Voice Capture" | "Idea" | "Reflection" | "Quick Note";

export interface InboxItem {
  id: string;
  text: string;
  type: CaptureType;
  time: string;
  timestamp: number;
}

interface InboxContextValue {
  items: InboxItem[];
  addItem: (text: string, type: CaptureType) => void;
  removeItem: (id: string) => void;
}

const InboxContext = createContext<InboxContextValue | null>(null);

const STORAGE_KEY = "mindvault_inbox";
const DEMO_IDS = new Set(["d1", "d2", "d3", "d4", "d5"]);

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return "kemarin";
  return `${days} hari lalu`;
}

export function InboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InboxItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed: InboxItem[] = JSON.parse(stored);
      // Strip any seeded demo items from previous sessions
      return parsed.filter((item) => !DEMO_IDS.has(item.id));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(text: string, type: CaptureType) {
    const now = Date.now();
    const newItem: InboxItem = {
      id: `item_${now}`,
      text,
      type,
      time: formatRelativeTime(now),
      timestamp: now,
    };
    setItems((prev) => [newItem, ...prev]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <InboxContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error("useInbox must be used within InboxProvider");
  return ctx;
}
