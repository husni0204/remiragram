import { render, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBookmarksStore } from "@/src/stores/bookmarksStore";
import ButtonBookmark from "@/src/components/ButtonBookmark";

const queryClient = new QueryClient();
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
