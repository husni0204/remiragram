/* eslint-disable react-hooks/exhaustive-deps */
import customAPI from "@/src/config/api";
import FormatDate from "@/src/config/date";
import { useAuthStore } from "@/src/stores/authStore";
import { DetailFeed } from "@/src/types/feed";
import { colors } from "@/src/utils/color";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DetailFeedScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { user } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [post, setPost] = useState<DetailFeed>();
  const [content, setContent] = useState<string>("");

  const detailPostData = async () => {
    setLoading(true);
    try {
      const { data } = await customAPI.get(`/feed/${id}`);
      //   console.log("ini detail", data);
      setPost(data.data);
    } catch (error) {
      console.log("ini error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    try {
      await customAPI.post("/comment", {
        content,
        postId: id,
      });
      setContent("");
      detailPostData();
    } catch (error) {
      console.log("ini error", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await customAPI.delete(`/comment/${commentId}`);
      Alert.alert("Delete", "Berhasil menghapus komentar");
      detailPostData();
    } catch (error: any) {
      console.log("salahnya :", error.message);
    }
  };

  useEffect(() => {
    detailPostData();
  }, []);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size={"large"} color={colors.active} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* header navigation back */}
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-gray-100 pt-14">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={"#111"} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Detail Post</Text>
        <Feather name="more-vertical" size={22} color={"#111"} />
      </View>
      {/* content */}
      <View className="flex-1">
        <ScrollView showsHorizontalScrollIndicator={false}>
          {/* user info */}
          <View className="flex-row items-center px-4 py-3">
            {post?.user.image ? (
              <Image
                source={{ uri: post.user.image }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <FontAwesome name="user-circle" size={35} />
            )}
            <View className="ml-3">
              <Text className="font-semibold">{post?.user.fullname}</Text>
              <Text className="text-xs text-gray-700">
                {FormatDate(post?.createdAt)}
              </Text>
            </View>
          </View>
          {/* image */}
          <Image
            source={{ uri: post?.image }}
            className="w-full h-96"
            resizeMode="cover"
          />
          {/* action */}
          <View className="flex-row justify-between px-4 py-3">
            <Feather name="heart" size={26} color={colors.inactive} />
            <Feather name="bookmark" size={26} color={colors.inactive} />
          </View>
          {/* like count */}
          <View className="px-4">
            <Text className="font-semibold">{post?.likeCount} likes</Text>
          </View>
          {/* caption */}
          <View className="px-4 mt-2">
            <Text>
              <Text className="font-semibold">{post?.user.username} </Text>
              {post?.caption}
            </Text>
          </View>
          {/* comment */}
          <View className="px-4 mt-6">
            <Text className="mb-3 font-semibold">Comments</Text>
            {post?.comments.length ? (
              <View>
                {post.comments.map((item) => (
                  <View
                    key={"comment" + item.id}
                    className="flex-row justify-between flex-1 mb-1"
                  >
                    <View className="flex-1 mb-3">
                      <Text>
                        <Text className="font-semibold">
                          {item.user.username}
                        </Text>
                        {item.content}
                      </Text>
                      <Text className="mt-2 text-xs text-gray-700">
                        {FormatDate(item.createdAt)}
                      </Text>
                    </View>
                    {user?.id === item.user.id && (
                      <TouchableOpacity
                        onPress={() => handleDeleteComment(item.id)}
                      >
                        <Feather name="trash" size={15} color={"red"} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text>Belum ada komentar</Text>
            )}
          </View>
        </ScrollView>
        <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-100">
          <TextInput
            placeholder="Add comment.."
            className="flex-1 px-4 py-3 mr-3 bg-gray-100 rounded-full"
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity onPress={handleCreateComment}>
            <Ionicons name="send" size={22} color={colors.active} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailFeedScreen;
