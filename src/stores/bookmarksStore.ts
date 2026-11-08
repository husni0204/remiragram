import { create } from "zustand";

interface BookmarksState {
  bookmarkedPosts: Set<string>;
  toggleBookmark: (postId: string) => void;
}

export const useBookmarksStore = create<BookmarksState>((set) => ({
  bookmarkedPosts: new Set<string>(),
  toggleBookmark: (postId) => {
    set((state) => {
      const newSet = new Set(state.bookmarkedPosts);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return { bookmarkedPosts: newSet };
    });
  },
}));
