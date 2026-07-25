/* eslint-disable react-hooks/exhaustive-deps */
import ButtonFollow from "@/src/components/post/ButtonFollow";
import PostCard from "@/src/components/post/PostCard";
import UserInfo from "@/src/components/post/UserInfo";
import UserProfileHeader from "@/src/components/post/UserProfileHeader";
import UserProfileTab from "@/src/components/post/UserProfileTab";
import customAPI from "@/src/config/api";
import { DetailUserType } from "@/src/types/user";
import { colors } from "@/src/utils/color";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FC, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DetailUserScreen: FC = () => {
    const { username } = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [detailUserData, setDetailUserData] = useState<DetailUserType>();
    const [tab, setTab] = useState<"posts" | "bookmarks">("posts");
    const insets = useSafeAreaInsets();
    const opacity = useRef(new Animated.Value(0.3)).current;

    const router = useRouter();

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

    const fetchDetailUser = async () => {
        setLoading(true);
        try {
            const res = await customAPI.get(`/user/${username}`);
            setDetailUserData(res.data.data);
        } catch (error) {
            console.log("ini errornya :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetailUser();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50">
                {/* Header skeleton */}
                <View className="bg-active" style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20 }}>
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-white/20" />
                        <View className="w-24 h-5 rounded bg-white/20 ml-3" />
                    </View>
                </View>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size={"large"} color={colors.active} />
                </View>
            </View>
        );
    }

    if (!detailUserData) {
        return (
            <View className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-active" style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20 }}>
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                            <Feather name="arrow-left" size={20} color="white" />
                        </TouchableOpacity>
                        <Text className="ml-3 text-lg font-bold text-white">Detail User</Text>
                    </View>
                </View>
                <View className="flex-1 items-center justify-center">
                    <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                        <Feather name="user-x" size={32} color={colors.inactive} />
                    </View>
                    <Text className="text-gray-600 font-medium">User tidak ditemukan</Text>
                </View>
            </View>
        );
    }

    const gridData = tab === "posts" ? detailUserData.posts : detailUserData.bookmarks.map((b) => b.post);

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-active" style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20 }}>
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                        <Feather name="arrow-left" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="ml-3 text-lg font-bold text-white">Detail User</Text>
                </View>
            </View>

            <FlatList
                data={gridData}
                numColumns={3}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: 3, paddingBottom: 20 }}
                columnWrapperStyle={{ gap: 3 }}
                ListHeaderComponent={
                    <>
                        <UserProfileHeader image={detailUserData.image} followerCount={detailUserData.followerCount} followingCount={detailUserData.followingCount} />
                        <UserInfo username={detailUserData.username} fullname={detailUserData.fullname} bio={detailUserData.bio} />
                        <ButtonFollow userId={detailUserData.id} />
                        <UserProfileTab tab={tab} setTab={setTab} />
                    </>
                }
                renderItem={({ item }) => <PostCard id={item.id} caption={item.caption} image={item.image} />}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3">
                            <Feather name={tab === "posts" ? "image" : "bookmark"} size={28} color={colors.inactive} />
                        </View>
                        <Text className="text-gray-600 font-medium">{tab === "posts" ? "Belum ada postingan" : "Belum ada bookmark"}</Text>
                        <Text className="text-gray-400 text-sm mt-1">{tab === "posts" ? "Postingan akan muncul di sini" : "Simpan postingan agar muncul di sini"}</Text>
                    </View>
                }
            />
        </View>
    );
};

export default DetailUserScreen;
