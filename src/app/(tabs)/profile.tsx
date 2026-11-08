import Header from "@/src/components/Header";
import PostCard from "@/src/components/post/PostCard";
import UserInfo from "@/src/components/post/UserInfo";
import UserProfileHeader from "@/src/components/post/UserProfileHeader";
import UserProfileTab from "@/src/components/post/UserProfileTab";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { DetailUserType, Bookmark } from "@/src/types/user";
import { colors } from "@/src/utils/color";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { user } = useAuthStore();

  const {
    data: detailUserData,
    isLoading,
    error,
  } = useQuery<DetailUserType, Error>({
    queryKey: ["userProfile", user?.username],
    queryFn: () => customAPI.get(`/user/${user?.username}`).then((res) => res.data.data),
    enabled: !!user?.username,
  });

  const [tab, setTab] = React.useState<"posts" | "bookmarks">("posts");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.active} />
      </View>
    );
  }

  if (error || !detailUserData) {
    return (
      <View className="flex-1 items-center mt-24">
        <Text>User tidak ditemukan !</Text>
      </View>
    );
  }

  const gridData = tab === "posts"
    ? detailUserData.posts ?? []
    : detailUserData.bookmarks.map((b: Bookmark) => b.post);

  return (
    <SafeAreaView>
      <Header />
      <FlatList
        data={gridData}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 3 }}
        columnWrapperStyle={{ gap: 3 }}
        ListHeaderComponent={
          <>
            <UserProfileHeader
              image={detailUserData.image}
              followerCount={detailUserData.followerCount}
              followingCount={detailUserData.followingCount}
            />
            <UserInfo
              username={detailUserData.username}
              fullname={detailUserData.fullname}
              bio={detailUserData.bio}
            />
            <UserProfileTab tab={tab} setTab={setTab} />
          </>
        }
        renderItem={({ item }) => <PostCard id={item.id} caption={item.caption} image={item.image} />}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <View className="items-center font-semibold">
              <Text className="text-lg font-semibold">{tab === "posts" ? "Belum ada postingan" : "Belum ada bookmarks"}</Text>
              <Text className="mt-2 text-gray-400">{tab === "posts" ? "Postingan akan muncul disini" : "Simpan agar postingan muncul disini"}</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
