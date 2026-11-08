/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../utils/color";
import { useBookmarksStore } from "../stores/bookmarksStore";

const ButtonBookmark = ({ postId }: { postId: string }) => {
  const bookmarkedPosts = useBookmarksStore((state) => state.bookmarkedPosts);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);

  const isBookmarked = bookmarkedPosts.has(postId);

  return (
    <>
      {isBookmarked ? (
        <TouchableOpacity onPress={() => toggleBookmark(postId)} testID="bookmark-button">
          <FontAwesome name="bookmark" size={24} color={colors.active} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => toggleBookmark(postId)} testID="bookmark-button">
          <Feather name="bookmark" size={24} color={colors.inactive} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default ButtonBookmark;
