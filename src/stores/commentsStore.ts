import { create } from "zustand";

interface CommentsState {
  comments: any[];
  loading: boolean;
  error: string | null;
  fetchComments: (postId: string) => Promise<void>;
  addComment: (comment: any) => void;
  removeComment: (commentId: string) => void;
}

export const useCommentsStore = create<CommentsState>((set) => ({
  comments: [],
  loading: false,
  error: null,
  fetchComments: async (postId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/comments?postId=${postId}`); // replace with customAPI
      const data = await response.json();
      set({ comments: data });
    } catch {
      set({ error: "Failed to load comments" });
    } finally {
      set({ loading: false });
    }
  },
  addComment: (comment) => {
    set((state) => ({ comments: [...state.comments, comment] }));
  },
  removeComment: (commentId) => {
    set((state) => ({ comments: state.comments.filter((c) => c.id !== commentId) }));
  },
}));
