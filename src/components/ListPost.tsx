import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";
import { Feed } from "../types/feed";
import { colors } from "../utils/color";

const ListPost = ({ item }: { item: Feed }) => {
  return (
    <View className="mb-4">
      {/* Post Header */}
      <View className="flex-row items-center px-4 mb-2">
        {item.user.image ? (
          <Image
            source={{ uri: item.user.image }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <FontAwesome name="user-circle" size={30} />
        )}
        <Text className="ml-3 font-semibold">{item.user.fullname}</Text>
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
          <Text className="font-semibold">{item.user.username} </Text>
          {item.caption}
        </Text>
      </View>
    </View>
  );
};

export default ListPost;
