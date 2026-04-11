import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import customAPI from "../config/api";
import { useAuthStore } from "../stores/authStore";
import { Feed } from "../types/feed";
import { colors } from "../utils/color";

const ListPost = ({ item, onReload }: { item: Feed; onReload: () => Promise<void> }) => {
  const router = useRouter();

  const {user} = useAuthStore();

  const handleDeletePost = async (postId: string) => {
    try {
      await customAPI.delete(`/feed/${postId}`)
      onReload()
      Alert.alert("Delete", "Berhasil menghapus postingan!")
    } catch (error) {
      console.log("Ini errornya mas : ", error);
    }
  }

  return (
    <View className="mb-4">
      {/* Post Header */}
      <View className="flex-row justify-between items-center">
      <View className="flex-row items-center px-4 mb-2">
        {item.user.image ? (
          <Image
            source={{ uri: item.user.image }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <FontAwesome name="user-circle" size={30} />
        )}
        <Text className="ml-3 font-semibold">{item.user.username}</Text>
      </View>
      {user?.id === item.user.id && (
        <TouchableOpacity 
          onPress={() => handleDeletePost(item.id.toString())}
          className="px-4 py-3"
        >
          <Feather name="trash" size={20} color={"red"}/>
        </TouchableOpacity>
      )}
      </View>
      <TouchableOpacity 
        onPress={() => 
          router.push({
            pathname: "/(detail)/post/[id]",
            params: {id: item.id}
          })
        }
      >
      {/* Post Image */}
      <Image
        source={{ uri: item.image }}
        className="w-full h-96"
        resizeMode="cover"
      />
      </TouchableOpacity>
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
