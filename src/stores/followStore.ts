import { create } from "zustand";

interface FollowState {
  following: Set<number>;
  toggleFollow: (userId: number) => void;
}

export const useFollowStore = create<FollowState>((set) => ({
  following: new Set<number>(),
  toggleFollow: (userId) =>
    set((state) => {
      const newSet = new Set(state.following);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return { following: newSet };
    }),
}));
