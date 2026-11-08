import { render, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBookmarksStore } from "@/src/stores/bookmarksStore";
import ButtonBookmark from "@/src/components/ButtonBookmark";

// Mock auth store to provide a user
jest.mock("@/src/stores/authStore", () => ({
  useAuthStore: () => ({ user: { id: "1", username: "test" } }),
}));

// Mock API so toggle mutations don't hit the network
jest.mock("@/src/config/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: { data: { bookmarked: true } } })),
    get: jest.fn(() => Promise.resolve({ data: { data: true } })),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});
const Wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("ButtonBookmark integration", () => {
  it("toggles bookmark state in Zustand store", () => {
    const { getByTestId } = render(<ButtonBookmark postId="456" />, { wrapper: Wrapper });
    const button = getByTestId("bookmark-button");
    fireEvent.press(button);
    expect(useBookmarksStore.getState().bookmarkedPosts.has("456")).toBe(true);
    fireEvent.press(button);
    expect(useBookmarksStore.getState().bookmarkedPosts.has("456")).toBe(false);
  });
});
