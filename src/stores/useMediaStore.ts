import { create } from "zustand";
import type { MediaSource } from "@/types/media";

export interface MediaStoreState {
  source: MediaSource | null;
  videoPlaying: boolean;
  setSource(source: MediaSource | null): void;
  setVideoPlaying(playing: boolean): void;
}

export const useMediaStore = create<MediaStoreState>((set, get) => ({
  source: null,
  videoPlaying: false,
  setSource(source) {
    const previous = get().source;
    if (previous) {
      URL.revokeObjectURL(previous.objectUrl);
    }
    set({ source });
  },
  setVideoPlaying(playing) {
    set({ videoPlaying: playing });
  },
}));
