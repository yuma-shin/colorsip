import { create } from "zustand";
import type { HistoryEntry } from "@/types/color";

export const MAX_HISTORY_ENTRIES = 50;

export interface HistoryStoreState {
  entries: HistoryEntry[];
  addEntry(entry: HistoryEntry): void;
  removeEntry(id: string): void;
  clear(): void;
}

export const useHistoryStore = create<HistoryStoreState>((set) => ({
  entries: [],
  addEntry(entry) {
    set((state) => {
      const next = [entry, ...state.entries];
      if (next.length > MAX_HISTORY_ENTRIES) {
        next.length = MAX_HISTORY_ENTRIES;
      }
      return { entries: next };
    });
  },
  removeEntry(id) {
    set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) }));
  },
  clear() {
    set({ entries: [] });
  },
}));
