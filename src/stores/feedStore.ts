import { create } from "zustand";
import { Feed } from "@/src/types/feed";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import customAPI from "@/src/config/api";

interface FeedState {
  posts: Feed[];
  page: number;
  totalPages: number;
  loading: boolean;
  refreshing: boolean;
  fetchNext: () => Promise<void>;
  refresh: () => Promise<void>;
  addPosts: (newPosts: Feed[]) => void;
  setPosts: (posts: Feed[]) => void;
  setPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
}

// AsyncStorage storage for Zustand persist — PABAYA / recommended way
// in React Native / Expo. Avoids the "setItem of undefined" crash.
const storage = createJSONStorage(() => AsyncStorage);

export const useFeedStore = create<FeedState>()(
  devtools(
    persist(
      (set, get) => ({
        posts: [],
        page: 1,
        totalPages: 1,
        loading: false,
        refreshing: false,
        addPosts: (newPosts) => set({ posts: [...get().posts, ...newPosts] }),
        setPosts: (posts) => set({ posts }),
        setPage: (page) => set({ page }),
        setTotalPages: (total) => set({ totalPages: total }),
        setLoading: (loading) => set({ loading }),
        setRefreshing: (refreshing) => set({ refreshing }),
        fetchNext: async () => {
          const { page, totalPages, loading } = get();
          if (loading || page > totalPages) return;
          set({ loading: true });
          try {
            const { data } = await customAPI.get(`/feed?page=${page}&limit=2`);
            get().addPosts(data.data);
            set({ totalPages: data.totalPages, page: page + 1 });
          } catch (e) {
            console.log("Error fetching feed", e);
          } finally {
            set({ loading: false });
          }
        },
        refresh: async () => {
          set({ refreshing: true, posts: [], page: 1, totalPages: 1 });
          await get().fetchNext();
          set({ refreshing: false });
        },
      }),
      {
        name: "feed-store",
        storage,
        // Don't persist transient state — only the feed data
        partialize: (state) => ({
          posts: state.posts,
          page: state.page,
          totalPages: state.totalPages,
        }),
      }
    )
  )
);
