/* eslint-disable react-hooks/exhaustive-deps */
import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useFollowStore } from "../../stores/followStore";

const ButtonFollow = ({ userId }: { userId: number }) => {
  const following = useFollowStore((state) => state.following);
  const toggleFollow = useFollowStore((state) => state.toggleFollow);

  const isFollowing = following.has(userId);

  return (
    <TouchableOpacity onPress={() => toggleFollow(userId)} testID="follow-button" style={{ padding: 8 }}>
      <Feather name={isFollowing ? "user-check" : "user-plus"} size={24} color={isFollowing ? "#3b82f6" : "#6b7280"} />
    </TouchableOpacity>
  );
};

export default ButtonFollow;
