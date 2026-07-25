import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import customAPI from "../config/api";
import { useAuthStore } from "../stores/authStore";
import { useConfirmStore } from "../stores/confirmStore";
import { useToastStore } from "../stores/toastStore";
import { Feed } from "../types/feed";
import { colors } from "../utils/color";
import ButtonBookmark from "./ButtonBookmark";
import ButtonLike from "./ButtonLike";

const ListPost = ({ item, onReload }: { item: Feed; onReload: () => Promise<void> }) => {
    const router = useRouter();

    const { user } = useAuthStore();
    const toast = useToastStore((s) => s.show);
    const confirm = useConfirmStore((s) => s.show);

    const handleDeletePost = async (postId: string) => {
        confirm("Hapus Postingan", "Kamu yakin ingin menghapus postingan ini?", async () => {
            try {
                await customAPI.delete(`/feed/${postId}`);
                onReload();
                toast("Berhasil menghapus postingan!", "success");
            } catch (error) {
                console.log("Ini errornya mas : ", error);
            }
        });
    };

    return (
        <View className="mx-4 mb-4 bg-white rounded-2xl overflow-hidden" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
            {/* Post Header */}
            <View className="flex-row justify-between items-center px-4 py-3">
                <View className="flex-row items-center">
                    {item.user.image ? (
                        <Image source={{ uri: item.user.image }} className="w-10 h-10 rounded-full border border-gray-100" />
                    ) : (
                        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                            <FontAwesome name="user" size={18} color={colors.inactive} />
                        </View>
                    )}
                    <Link
                        className="ml-3"
                        href={
                            user?.id !== item.user.id
                                ? {
                                      pathname: "/(detail)/(user)/[username]",
                                      params: { username: item.user.username },
                                  }
                                : {
                                      pathname: "/(tabs)/profile",
                                  }
                        }
                    >
                        <Text className="font-semibold text-gray-900">{item.user.username}</Text>
                    </Link>
                </View>
                {user?.id === item.user.id && (
                    <TouchableOpacity onPress={() => handleDeletePost(item.id.toString())} className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
                        <Feather name="trash-2" size={16} color="#EF4444" />
                    </TouchableOpacity>
                )}
            </View>
            {/* Post Image */}
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: "/(detail)/post/[id]",
                        params: { id: item.id },
                    })
                }
            >
                <Image source={{ uri: item.image }} className="w-full h-80" resizeMode="cover" />
            </TouchableOpacity>
            {/* Actions */}
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-50">
                <View className="flex-row items-center gap-4">
                    <ButtonLike postId={item.id.toString()} />
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/(detail)/post/[id]",
                                params: { id: item.id },
                            })
                        }
                        className="flex-row items-center"
                    >
                        <Feather name="message-circle" size={22} color={colors.inactive} />
                        <Text className="text-gray-500 text-sm ml-1">{item.commentCount}</Text>
                    </TouchableOpacity>
                </View>
                <ButtonBookmark postId={item.id.toString()} />
            </View>
            {/* Caption */}
            <View className="px-4 py-3">
                <Text className="text-gray-900">
                    <Text className="font-bold">{item.user.username} </Text>
                    {item.caption}
                </Text>
                <Text className="text-gray-400 text-xs mt-2">
                    {item.likeCount} likes · {item.commentCount} comments
                </Text>
            </View>
        </View>
    );
};

export default ListPost;
