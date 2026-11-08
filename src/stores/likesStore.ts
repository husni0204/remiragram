import { create } from "zustand";

interface LikesState {
  likedPosts: Set<string>;
  toggleLike: (postId: string) => void;
}

export const useLikesStore = create<LikesState>((set) => ({
  likedPosts: new Set<string>(),
  toggleLike: (postId) => {
    set((state) => {
      const newSet = new Set(state.likedPosts);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return { likedPosts: newSet };
    });
  },
}));
