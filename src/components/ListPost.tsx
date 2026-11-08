import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CustomAlert from "@/src/components/CustomAlert";
import customAPI from "../config/api";
import { useAuthStore } from "../stores/authStore";
import { Feed } from "../types/feed";
import { colors } from "../utils/color";
import ButtonBookmark from "./ButtonBookmark";
import ButtonLike from "./ButtonLike";

const ListPost = ({ item, onReload }: { item: Feed; onReload: () => Promise<void> }) => {
    const router = useRouter();
    const { user } = useAuthStore();
    const [alert, setAlert] = useState<{ visible: boolean; title: string; message: string }>(
        { visible: false, title: "", message: "" }
    );

    const handleDeletePost = async (postId: string) => {
        try {
            await customAPI.delete(`/feed/${postId}`);
            onReload();
            setAlert({ visible: true, title: "Delete", message: "Berhasil menghapus postingan!" });
        } catch {
            setAlert({ visible: true, title: "Error", message: "Gagal menghapus postingan" });
        }
    };

    return (
        <View className="mb-4">
            {/* Post Header */}
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center px-4 mb-2">
                    {item.user.image ? <Image source={{ uri: item.user.image }} className="w-10 h-10 rounded-full" /> : <FontAwesome name="user-circle" size={30} />}
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
                        <Text className="font-semibold">{item.user.username}</Text>
                    </Link>
                </View>
                {user?.id === item.user.id && (
                    <TouchableOpacity onPress={() => handleDeletePost(item.id.toString())} className="px-4 py-3">
                        <Feather name="trash" size={20} color={"red"} />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: "/(detail)/post/[id]",
                        params: { id: item.id },
                    })
                }
            >
                {/* Post Image */}
                <Image source={{ uri: item.image }} className="w-full h-96" resizeMode="cover" />
            </TouchableOpacity>
            {/* Actions */}
            <View className="flex-row justify-between px-4 py-3">
                <View className="flex-row gap-2">
                    <ButtonLike postId={item.id.toString()} />
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/(detail)/post/[id]",
                                params: { id: item.id },
                            })
                        }
                        testID="comment-button"
                        className="flex-row items-center gap-1"
                    >
                        <Feather name="message-circle" size={24} color={colors.inactive} />
                        <Text className="text-sm text-gray-500">{item.commentCount}</Text>
                    </TouchableOpacity>
                </View>
                <ButtonBookmark postId={item.id.toString()} />
            </View>
            {/* Caption */}
            <View className="px-4">
                <Text>
                    <Text className="font-semibold">{item.user.username} </Text>
                    {item.caption}
                </Text>
            </View>

            {/* Custom Alert */}
            <CustomAlert
                isVisible={alert.visible}
                title={alert.title}
                message={alert.message}
                showCancel={false}
                confirmText="OK"
                onConfirm={() => setAlert({ ...alert, visible: false })}
            />
        </View>
    );
};

export default ListPost;
