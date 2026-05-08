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

const defaultItems: InboxItem[] = [
  { id: "d1", text: "ide random untuk sidang", type: "Idea", time: "2 jam lalu", timestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { id: "d2", text: "voice notes kuliah dr. Budi", type: "Voice Capture", time: "kemarin", timestamp: Date.now() - 24 * 60 * 60 * 1000 },
  { id: "d3", text: "insight dosen tentang farmakologi", type: "Quick Note", time: "2 hari lalu", timestamp: Date.now() - 48 * 60 * 60 * 1000 },
  { id: "d4", text: "refleksi minggu pertama koas", type: "Reflection", time: "3 hari lalu", timestamp: Date.now() - 72 * 60 * 60 * 1000 },
  { id: "d5", text: "link artikel: burnout prevention", type: "Quick Note", time: "4 hari lalu", timestamp: Date.now() - 96 * 60 * 60 * 1000 },
];

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
      return stored ? JSON.parse(stored) : defaultItems;
    } catch {
      return defaultItems;
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
