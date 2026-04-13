/* eslint-disable react-hooks/exhaustive-deps */
import Header from "@/src/components/Header";
import PostCard from "@/src/components/post/PostCard";
import UserInfo from "@/src/components/post/UserInfo";
import UserProfileHeader from "@/src/components/post/UserProfileHeader";
import UserProfileTab from "@/src/components/post/UserProfileTab";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { DetailUserType } from "@/src/types/user";
import { colors } from "@/src/utils/color";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detailUserData, setDetailUserData] = useState<DetailUserType>();
  const [tab, setTab] = useState<"posts" | "bookmarks">("posts");

  const { user } = useAuthStore();

  const fetchDetailUser = async () => {
    setLoading(true);
    try {
      const res = await customAPI.get(`/user/${user?.username}`);
      // console.log("ini datanya :", res.data.data)
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
      <View className={"flex-1 justify-center items-center"}>
        <ActivityIndicator size={"large"} color={colors.active} />
      </View>
    );
  }

  if (!detailUserData) {
    return (
      <View className={"flex-1 items-center mt-24"}>
        <Text>User tidak ditemukan !</Text>
      </View>
    );
  }

  const gridData =
    tab === "posts"
      ? detailUserData.posts
      : detailUserData.bookmarks.map((b) => b.post);

  return (
    <SafeAreaView>
      {/* header navigation back */}
      <Header />
      {/*Detail user dan post*/}
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
        renderItem={({ item }) => (
          <PostCard id={item.id} caption={item.caption} image={item.image} />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <View className="items-center font-semibold">
              <Text className="text-lg font-semibold">
                {tab === "posts"
                  ? "Belum ada postingan"
                  : "Belum ada bookmarks"}
              </Text>
              <Text className="mt-2 text-gray-400">
                {tab === "posts"
                  ? "Postingan akan muncul disini"
                  : "Simpan agar postingan muncul disini"}
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
