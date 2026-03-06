import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";
import { colors } from "../utils/color";

interface PostData {
  id: number;
  username: string;
  avatar: string;
  image: string;
  caption: string;
}

const ListPost = ({ item }: { item: PostData }) => {
  return (
    <View className="mb-4">
      {/* Post Header */}
      <View className="flex-row items-center px-4 mb-2">
        <Image
          source={{ uri: item.avatar }}
          className="w-10 h-10 rounded-full"
        />
        <Text className="ml-3 font-semibold">{item.username}</Text>
      </View>
      {/* Post Image */}
      <Image
        source={{ uri: item.image }}
        className="w-full h-96"
        resizeMode="cover"
      />
      {/* Actions */}
      <View className="flex-row justify-between px-4 py-3">
        <View className="flex-row gap-2">
          <Feather name="heart" size={24} color={colors.inactive} />
          <Feather name="message-circle" size={24} color={colors.inactive} />
        </View>
        <Feather name="bookmark" size={24} color={colors.inactive} />
      </View>
      {/* Caption */}
      <View className="px-4">
        <Text>
          <Text className="font-semibold">{item.username} </Text>
          {item.caption}
        </Text>
      </View>
    </View>
  );
};

export default ListPost;
