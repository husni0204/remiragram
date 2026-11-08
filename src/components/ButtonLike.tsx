/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../utils/color";
import { useLikesStore } from "../stores/likesStore";

const ButtonLike = ({ postId }: { postId: string }) => {
  const likedPosts = useLikesStore((state) => state.likedPosts);
  const toggleLike = useLikesStore((state) => state.toggleLike);

  const isLiked = likedPosts.has(postId);

  return (
    <>
      {isLiked ? (
        <TouchableOpacity onPress={() => toggleLike(postId)} testID="like-button">
          <FontAwesome name="heart" size={24} color={"red"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => toggleLike(postId)} testID="like-button">
          <Feather name="heart" size={24} color={colors.inactive} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default ButtonLike;
