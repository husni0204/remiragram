/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBookmark from "@/src/components/ButtonBookmark";
import ButtonLike from "@/src/components/ButtonLike";
import customAPI from "@/src/config/api";
import FormatDate from "@/src/config/date";
import { useAuthStore } from "@/src/stores/authStore";
import { useConfirmStore } from "@/src/stores/confirmStore";
import { useToastStore } from "@/src/stores/toastStore";
import { DetailFeed } from "@/src/types/feed";
import { colors } from "@/src/utils/color";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DetailFeedScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { user } = useAuthStore();
    const toast = useToastStore((s) => s.show);
    const confirm = useConfirmStore((s) => s.show);

    const [loading, setLoading] = useState<boolean>(false);
    const [post, setPost] = useState<DetailFeed | null>(null);
    const [content, setContent] = useState<string>("");
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [loading]);

    const detailPostData = async () => {
        setLoading(true);
        try {
            const { data } = await customAPI.get(`/feed/${id}`);
            setPost(data.data);
        } catch (error) {
            console.log("ini error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateComment = async () => {
        if (!content.trim()) return;
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
        confirm("Hapus Komentar", "Kamu yakin ingin menghapus komentar ini?", async () => {
            try {
                await customAPI.delete(`/comment/${commentId}`);
                toast("Berhasil menghapus komentar", "success");
                detailPostData();
            } catch (error: any) {
                console.log("salahnya :", error.message);
            }
        });
    };

    useEffect(() => {
        detailPostData();
    }, []);

    if (loading && !post) {
        return (
            <View className="flex-1 bg-gray-50">
                {/* Header skeleton */}
                <View className="bg-active" style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20 }}>
                    <View className="flex-row items-center justify-between">
                        <View className="w-10 h-10 rounded-full bg-white/20" />
                        <View className="w-32 h-5 rounded bg-white/20" />
                        <View className="w-10 h-10 rounded-full bg-white/20" />
                    </View>
                </View>
                {/* Content skeleton */}
                <View className="flex-1">
                    <Animated.View style={{ opacity }} className="flex-row items-center px-4 py-3 bg-white">
                        <View className="w-12 h-12 rounded-full bg-gray-200" />
                        <View className="ml-3">
                            <View className="w-24 h-4 rounded bg-gray-200 mb-2" />
                            <View className="w-32 h-3 rounded bg-gray-200" />
                        </View>
                    </Animated.View>
                    <Animated.View style={{ opacity }} className="w-full h-80 bg-gray-200" />
                    <View className="px-4 py-3 bg-white">
                        <View className="flex-row gap-4">
                            <View className="w-7 h-7 rounded bg-gray-200" />
                            <View className="w-7 h-7 rounded bg-gray-200" />
                            <View className="w-7 h-7 rounded bg-gray-200" />
                        </View>
                    </View>
                    <Animated.View style={{ opacity }} className="mx-4 mt-2">
                        <View className="w-20 h-4 rounded bg-gray-200 mb-2" />
                        <View className="w-full h-3 rounded bg-gray-200 mb-2" />
                        <View className="w-3/4 h-3 rounded bg-gray-200" />
                    </Animated.View>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-active" style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20 }}>
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                            <Feather name="arrow-left" size={20} color="white" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold text-white">Detail Post</Text>
                        <View className="w-10 h-10" />
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        {/* User info */}
                        <View className="flex-row items-center px-4 py-3 bg-white">
                            {post?.user.image ? (
                                <Image source={{ uri: post.user.image }} className="w-12 h-12 rounded-full border border-gray-100" />
                            ) : (
                                <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                                    <FontAwesome name="user" size={20} color={colors.inactive} />
                                </View>
                            )}
                            <View className="ml-3 flex-1">
                                <Text className="font-bold text-gray-900">{post?.user.fullname}</Text>
                                <Text className="text-xs text-gray-500 mt-0.5">@{post?.user.username} · {FormatDate(post?.createdAt)}</Text>
                            </View>
                        </View>

                        {/* Image */}
                        <Image source={{ uri: post?.image }} className="w-full h-96" resizeMode="cover" />

                        {/* Actions */}
                        <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-100">
                            <View className="flex-row items-center gap-5">
                                {post && <ButtonLike postId={post.id.toString()} />}
                                <TouchableOpacity className="flex-row items-center">
                                    <Feather name="message-circle" size={24} color={colors.inactive} />
                                    <Text className="text-gray-500 text-sm ml-1">{post?.commentCount || 0}</Text>
                                </TouchableOpacity>
                            </View>
                            {post && <ButtonBookmark postId={post.id.toString()} />}
                        </View>

                        {/* Like count */}
                        <View className="px-4 py-3 bg-white border-b border-gray-100">
                            <Text className="font-bold text-gray-900">{post?.likeCount} likes</Text>
                        </View>

                        {/* Caption */}
                        <View className="px-4 py-3 bg-white border-b border-gray-100">
                            <Text className="text-gray-900 leading-5">
                                <Text className="font-bold">{post?.user.username} </Text>
                                {post?.caption}
                            </Text>
                        </View>

                        {/* Comments header */}
                        <View className="px-4 py-3 bg-white border-b border-gray-100 mt-2">
                            <Text className="font-bold text-gray-900">Komentar ({post?.comments.length || 0})</Text>
                        </View>

                        {/* Comments list */}
                        {post?.comments.length ? (
                            post.comments.map((item, index) => (
                                <View key={index} className="px-4 py-3 bg-white border-b border-gray-50">
                                    <View className="flex-row items-start">
                                        {item.user.image ? (
                                            <Image source={{ uri: item.user.image }} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                                                <FontAwesome name="user" size={12} color={colors.inactive} />
                                            </View>
                                        )}
                                        <View className="ml-3 flex-1">
                                            <View className="flex-row items-center">
                                                <Text className="font-bold text-gray-900 text-sm">{item.user.username}</Text>
                                                <Text className="text-gray-400 text-xs ml-2">· {FormatDate(item.createdAt)}</Text>
                                            </View>
                                            <Text className="text-gray-700 text-sm mt-1">{item.content}</Text>
                                        </View>
                                        {user?.id === item.user.id && (
                                            <TouchableOpacity
                                                onPress={() => handleDeleteComment(item.id)}
                                                className="w-7 h-7 rounded-full bg-red-50 items-center justify-center ml-2"
                                            >
                                                <Feather name="trash-2" size={12} color="#EF4444" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="items-center py-10 bg-white">
                                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3">
                                    <Feather name="message-circle" size={28} color={colors.inactive} />
                                </View>
                                <Text className="text-gray-500 font-medium">Belum ada komentar</Text>
                                <Text className="text-gray-400 text-sm mt-1">Jadilah yang pertama berkomentar</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Comment input */}
                    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3" style={{ paddingBottom: insets.bottom + 12 }}>
                        <View className="flex-row items-center">
                            {user?.image ? (
                                <Image source={{ uri: user.image }} className="w-9 h-9 rounded-full mr-3" />
                            ) : (
                                <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
                                    <FontAwesome name="user" size={14} color={colors.inactive} />
                                </View>
                            )}
                            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full pl-4 pr-1 py-1">
                                <TextInput
                                    placeholder="Tulis komentar..."
                                    className="flex-1 text-sm"
                                    value={content}
                                    onChangeText={setContent}
                                    placeholderTextColor="#9CA3AF"
                                />
                                <TouchableOpacity
                                    onPress={handleCreateComment}
                                    disabled={!content.trim()}
                                    className={`w-9 h-9 rounded-full items-center justify-center ml-2 ${content.trim() ? "bg-active" : "bg-gray-200"}`}
                                >
                                    <Ionicons name="send" size={16} color={content.trim() ? "white" : "#9CA3AF"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default DetailFeedScreen;
