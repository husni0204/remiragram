import { render, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLikesStore } from "@/src/stores/likesStore";
import { useBookmarksStore } from "@/src/stores/bookmarksStore";
import ButtonLike from "@/src/components/ButtonLike";
import ButtonBookmark from "@/src/components/ButtonBookmark";

// Mock auth store to provide a user
jest.mock("@/src/stores/authStore", () => ({
  useAuthStore: () => ({ user: { id: "1", username: "test" } }),
}));

// Mock API so toggle mutations don't hit the network
jest.mock("@/src/config/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: { data: { liked: true, bookmarked: true } } })),
    get: jest.fn(() => Promise.resolve({ data: { data: true } })),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});
const Wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("UI Store Integration Tests", () => {
  describe("ButtonLike", () => {
    it("toggles like state in Zustand store", () => {
      const { getByTestId } = render(<ButtonLike postId="123" />, { wrapper: Wrapper });
      const button = getByTestId("like-button");
      
      // Initially not liked
      expect(useLikesStore.getState().likedPosts.has("123")).toBe(false);
      
      // Click to like
      fireEvent.press(button);
      expect(useLikesStore.getState().likedPosts.has("123")).toBe(true);
      
      // Click again to unlike
      fireEvent.press(button);
      expect(useLikesStore.getState().likedPosts.has("123")).toBe(false);
    });
  });

  describe("ButtonBookmark", () => {
    it("toggles bookmark state in Zustand store", () => {
      const { getByTestId } = render(<ButtonBookmark postId="456" />, { wrapper: Wrapper });
      const button = getByTestId("bookmark-button");
      
      // Initially not bookmarked
      expect(useBookmarksStore.getState().bookmarkedPosts.has("456")).toBe(false);
      
      // Click to bookmark
      fireEvent.press(button);
      expect(useBookmarksStore.getState().bookmarkedPosts.has("456")).toBe(true);
      
      // Click again to unbookmark
      fireEvent.press(button);
      expect(useBookmarksStore.getState().bookmarkedPosts.has("456")).toBe(false);
    });
  });
});
