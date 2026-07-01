import { create } from "zustand";

interface CanvasState {
  selectedRepo: string | null;
  hoveredRepo: string | null;
  activeTagFilter: string | null;
  select: (repoName: string | null) => void;
  hover: (repoName: string | null) => void;
  setTagFilter: (tag: string | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  selectedRepo: null,
  hoveredRepo: null,
  activeTagFilter: null,
  select: (repoName) => set({ selectedRepo: repoName }),
  hover: (repoName) => set({ hoveredRepo: repoName }),
  setTagFilter: (tag) => set({ activeTagFilter: tag }),
}));
