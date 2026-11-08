import { render, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/src/stores/authStore";
import { useLikesStore } from "@/src/stores/likesStore";
import ButtonLike from "@/src/components/ButtonLike";

// Mock auth store to provide a user if needed
jest.mock("@/src/stores/authStore", () => ({
  useAuthStore: () => ({ user: { id: "1", username: "test" } }),
}));

// Create a query client for React Query context
const queryClient = new QueryClient();

const Wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("ButtonLike integration", () => {
  it("toggles like state in Zustand store", () => {
    const { getByTestId } = render(<ButtonLike postId="123" />, { wrapper: Wrapper });
    // Initially not liked, click to like
    const button = getByTestId("like-button");
    fireEvent.press(button);
    // Verify Zustand store updated (likedPosts should contain "123")
    const { likedPosts } = useLikesStore.getState();
    expect(likedPosts.has("123")).toBe(true);
    // Click again to unlike
    fireEvent.press(button);
    expect(useLikesStore.getState().likedPosts.has("123")).toBe(false);
  });
});
