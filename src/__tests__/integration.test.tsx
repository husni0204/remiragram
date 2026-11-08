import { render, fireEvent } from "@testing-library/react-native";
import { useLikesStore } from "@/src/stores/likesStore";
import { useBookmarksStore } from "@/src/stores/bookmarksStore";
import ButtonLike from "@/src/components/ButtonLike";
import ButtonBookmark from "@/src/components/ButtonBookmark";

describe("UI Store Integration Tests", () => {
  describe("ButtonLike", () => {
    it("toggles like state in Zustand store", () => {
      const { getByTestId } = render(<ButtonLike postId="123" />);
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
      const { getByTestId } = render(<ButtonBookmark postId="456" />);
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
