import Header from "@/src/components/Header";
import PostCard from "@/src/components/post/PostCard";
import UserInfo from "@/src/components/post/UserInfo";
import UserProfileHeader from "@/src/components/post/UserProfileHeader";
import UserProfileTab from "@/src/components/post/UserProfileTab";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { useBookmarksStore } from "@/src/stores/bookmarksStore";
import { DetailUserType, Bookmark } from "@/src/types/user";
import { colors } from "@/src/utils/color";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { user } = useAuthStore();

  const {
    data: detailUserData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<DetailUserType, Error>({
    queryKey: ["userProfile", user?.username],
    queryFn: () => customAPI.get(`/user/${user?.username}`).then((res) => {
      const data = res.data.data as DetailUserType;
      // Hydrate bookmarksStore dari server agar ikon bookmark konsisten
      const bookmarkIds = (data.bookmarks ?? []).map((b: Bookmark) => String(b.postId));
      useBookmarksStore.getState().setBookmarks(bookmarkIds);
      return data;
    }),
    enabled: !!user?.username,
    staleTime: 5000, // 5 detik cache
  });

  const [tab, setTab] = React.useState<"posts" | "bookmarks">("posts");
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Safety: if user not loaded yet, show loading
  // (setelah semua hooks agar urutan hooks konsisten)
  if (!user?.username) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} color={colors.active} />
        <Text className="mt-4 text-gray-500">Memuat profil...</Text>
      </View>
    );
  }

  // Handle initial loading
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.active} />
      </View>
    );
  }

  // Handle error
  if (isError || !detailUserData) {
    return (
      <View className="flex-1 items-center mt-24">
        <Text>User tidak ditemukan !</Text>
        <Text className="mt-2 text-sm text-gray-500">{error?.message || 'Unknown error'}</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.active]}
          />
        }
      />
      {/* Background fetching indicator */}
      {isFetching && !refreshing && (
        <View className="fixed bottom-4 right-4 bg-black/70 px-3 py-1 rounded-full">
          <Text className="text-white text-xs">Memperbarui...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
