import CustomAlert from "@/src/components/CustomAlert";
import customAPI from "@/src/config/api";
import FormatDate from "@/src/config/date";
import { useAuthStore } from "@/src/stores/authStore";
import { DetailFeed } from "@/src/types/feed";
import { colors } from "@/src/utils/color";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ActionSheetIOS } from "react-native"; // For iOS, we can use ActionSheet; Android will use custom modal
import { SafeAreaView } from "react-native-safe-area-context";

const DetailFeedScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [content, setContent] = useState<string>("");
  const [isDeletePostModalVisible, setDeletePostModalVisible] = useState(false);
  const [isDeleteCommentModalVisible, setDeleteCommentModalVisible] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Query for post data
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery<DetailFeed, Error>({
    queryKey: ["post", id],
    queryFn: () => customAPI.get(`/feed/${id}`).then((res) => res.data.data),
    enabled: !!id,
  });

  // Mutation for creating a comment
  const createCommentMutation = useMutation<any, any, { content: string; postId: string }, unknown>({
    mutationFn: ({ content, postId }) => customAPI.post("/comment", { content, postId }),
    onSuccess: () => {
      setContent("");
      // Invalidate post query to refetch comments
      // (cannot directly invalidate here without query client, so we rely on page refresh)
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message ?? "Gagal membuat komentar");
    },
  });

  // Mutation for deleting a post
  const deletePostMutation = useMutation<any, any, string, unknown>({
    mutationFn: (postId: string) => customAPI.delete(`/feed/${postId}`),
    onSuccess: () => {
      Alert.alert("Success", "Postingan berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message ?? "Gagal menghapus postingan.");
    },
  });

  // Mutation for deleting a comment
  const deleteCommentMutation = useMutation<any, any, string, unknown>({
    mutationFn: (commentId: string) => customAPI.delete(`/comment/${commentId}`),
    onSuccess: () => {
      Alert.alert("Success", "Berhasil menghapus komentar.");
      setDeleteCommentModalVisible(false);
      setCommentToDeleteId(null);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message ?? "Gagal menghapus komentar.");
      setDeleteCommentModalVisible(false);
      setCommentToDeleteId(null);
    },
  });

  const handleConfirmDeletePost = () => {
    if (id) {
      deletePostMutation.mutate(id as string);
      setDeletePostModalVisible(false);
    }
  };

  const handleConfirmDeleteComment = () => {
    if (commentToDeleteId) {
      deleteCommentMutation.mutate(commentToDeleteId);
    }
  };

  const handleCreateComment = () => {
    if (!content.trim()) return;
    createCommentMutation.mutate({ content, postId: id as string });
  };

  const handleDeletePostPress = () => {
    setDeletePostModalVisible(true);
  };

  const handleDeleteCommentPress = (commentId: string) => {
    setCommentToDeleteId(commentId);
    setDeleteCommentModalVisible(true);
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color={colors.active} />
      </View>
    );
  }

  if (isError || !post) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Post tidak ditemukan!</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView className="flex-1 bg-background">
        {/* Header navigation back */}
        <View className="flex-row items-center justify-between px-4 pb-4 border-b border-gray-100 ios:pt-6 android:pt-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={"#111"} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Detail Post</Text>
          {user?.id === post.user.id ? (
            <TouchableOpacity onPress={handleDeletePostPress}>
              <Feather name="trash" size={22} color={"red"} />
            </TouchableOpacity>
          ) : (
            <Feather name="more-vertical" size={22} color={"#111"} />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <ScrollView showsHorizontalScrollIndicator={false}>
            {/* user info */}
            <View className="flex-row items-center px-4 py-3">
              {post.user.image ? (
                <Image source={{ uri: post.user.image }} className="w-12 h-12 rounded-full" />
              ) : (
                <FontAwesome name="user-circle" size={35} />
              )}
              <View className="ml-3">
                <Text className="font-semibold">{post.user.fullname}</Text>
                <Text className="text-xs text-gray-700">{FormatDate(post.createdAt)}</Text>
              </View>
            </View>

            {/* image */}
            <Image source={{ uri: post.image }} className="w-full h-96" resizeMode="cover" />

            {/* action */}
            <View className="flex-row justify-between px-4 py-3">
              <Feather name="heart" size={26} color={colors.inactive} />
              <Feather name="bookmark" size={26} color={colors.inactive} />
            </View>

            {/* like count */}
            <View className="px-4">
              <Text className="font-semibold">{post.likeCount} likes</Text>
            </View>

            {/* caption */}
            <View className="px-4 mt-2">
              <Text>
                <Text className="font-semibold">{post.user.username} </Text>
                {post.caption}
              </Text>
            </View>

            {/* comment */}
            <View className="px-4 mt-6">
              <Text className="mb-3 font-semibold">Comments</Text>
              {post.comments && post.comments.length > 0 ? (
                <View>
                  {post.comments.map((item, index) => (
                    <View
                      className="flex-row justify-between flex-1 mb-1"
                      key={item.id} // Use item.id as key
                    >
                      <View className="flex-1 mb-3">
                        <Text>
                          <Text className="font-semibold">{item.user.username} </Text>
                          {item.content}
                        </Text>
                        <Text className="mt-2 text-xs text-gray-700">{FormatDate(item.createdAt)}</Text>
                      </View>
                      {user?.id === item.user.id && (
                        <TouchableOpacity onPress={() => handleDeleteCommentPress(item.id)}>
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

          {/* comment input */}
          <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-100">
            <TextInput
              placeholder="Add comment.."
              className="flex-1 px-4 py-3 mr-3 bg-gray-100 rounded-full"
              value={content}
              onChangeText={setContent}
            />
            <TouchableOpacity onPress={handleCreateComment} disabled={createCommentMutation.isPending}>
              <Ionicons name="send" size={22} color={colors.active} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Alerts */}
        <CustomAlert
          isVisible={isDeletePostModalVisible}
          title="Hapus Postingan"
          message="Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan."
          onCancel={() => setDeletePostModalVisible(false)}
          onConfirm={handleConfirmDeletePost}
        />

        <CustomAlert
          isVisible={isDeleteCommentModalVisible}
          title="Hapus Komentar"
          message="Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan."
          onCancel={() => setDeleteCommentModalVisible(false)}
          onConfirm={handleConfirmDeleteComment}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default DetailFeedScreen;
