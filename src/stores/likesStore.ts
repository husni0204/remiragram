import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "remiragram:likedPosts";

interface LikesState {
  likedPosts: Set<string>;
  toggleLike: (postId: string) => void;
  setLike: (postId: string, liked: boolean) => void;
  setLikes: (postIds: string[]) => void;
}

// Simpan daftar like ke AsyncStorage agar tetap ada saat app di-reload/refresh
const persist = (posts: Set<string>) => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...posts])).catch(() => {
    // Abaikan error persist (state tetap jalan di memori)
  });
};

export const useLikesStore = create<LikesState>((set, get) => ({
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
    persist(get().likedPosts);
  },
  setLike: (postId, liked) => {
    set((state) => {
      const newSet = new Set(state.likedPosts);
      if (liked) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      return { likedPosts: newSet };
    });
    persist(get().likedPosts);
  },
  setLikes: (postIds) => {
    set({ likedPosts: new Set(postIds) });
    persist(get().likedPosts);
  },
}));

// Hydrate dari AsyncStorage saat app start (sebelum user berinteraksi)
AsyncStorage.getItem(STORAGE_KEY)
  .then((raw) => {
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      useLikesStore.getState().setLikes(ids);
    }
  })
  .catch(() => {
    // Belum ada data tersimpan – biarkan kosong
  });
