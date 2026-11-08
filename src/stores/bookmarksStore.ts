import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "remiragram:bookmarkedPosts";

interface BookmarksState {
  bookmarkedPosts: Set<string>;
  toggleBookmark: (postId: string) => void;
  setBookmarked: (postId: string, bookmarked: boolean) => void;
  setBookmarks: (postIds: string[]) => void;
}

// Simpan daftar bookmark ke AsyncStorage agar tetap ada saat app di-reload/refresh
const persist = (posts: Set<string>) => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...posts])).catch(() => {
    // Abaikan error persist (state tetap jalan di memori)
  });
};

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
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
    persist(get().bookmarkedPosts);
  },
  setBookmarked: (postId, bookmarked) => {
    set((state) => {
      const newSet = new Set(state.bookmarkedPosts);
      if (bookmarked) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      return { bookmarkedPosts: newSet };
    });
    persist(get().bookmarkedPosts);
  },
  setBookmarks: (postIds) => {
    set({ bookmarkedPosts: new Set(postIds) });
    persist(get().bookmarkedPosts);
  },
}));

// Hydrate dari AsyncStorage saat app start (sebelum user berinteraksi)
AsyncStorage.getItem(STORAGE_KEY)
  .then((raw) => {
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      useBookmarksStore.getState().setBookmarks(ids);
    }
  })
  .catch(() => {
    // Belum ada data tersimpan – biarkan kosong
  });
