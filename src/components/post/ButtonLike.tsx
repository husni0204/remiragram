/* eslint-disable react-hooks/exhaustive-deps */
import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useLikesStore } from "../../stores/likesStore";
import { colors } from "../../utils/color";

const ButtonLike = ({ postId }: { postId: string }) => {
  const likedPosts = useLikesStore((state) => state.likedPosts);
  const toggleLike = useLikesStore((state) => state.toggleLike);

  const isLiked = likedPosts.has(postId);

  return (
    <TouchableOpacity onPress={() => toggleLike(postId)} testID="like-button">
      {isLiked ? (
        <Feather name="heart" size={24} color={"red"} />
      ) : (
        <Feather name="heart" size={24} color={colors.inactive} />
      )}
    </TouchableOpacity>
  );
};

export default ButtonLike;
