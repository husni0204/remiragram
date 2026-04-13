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
import { FC, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DetailUserScreen: FC = () => {
  const { username } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [detailUserData, setDetailUserData] = useState<DetailUserType>();
  const [tab, setTab] = useState<"posts" | "bookmarks">("posts");

  const router = useRouter();

  const fetchDetailUser = async () => {
    setLoading(true);
    try {
      const res = await customAPI.get(`/user/${username}`);
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
      <View className="flex-row items-center px-4 pb-4 border-b border-gray-100 ios:pt-6 android:pt-8">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={"#111"} />
        </TouchableOpacity>
        <Text className="ml-3 text-lg font-semibold">Detail User</Text>
      </View>
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
            <ButtonFollow userId={detailUserData.id} />
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

export default DetailUserScreen;
