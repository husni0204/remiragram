/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import Header from "@/src/components/Header";
import ListPost from "@/src/components/ListPost";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { useFeedStore } from "@/src/stores/feedStore";
import { colors } from "@/src/utils/color";
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const { user } = useAuthStore();
  console.log("User data :", user?.fullname);

  // Feed state managed by Zustand store
  const { posts, loading, refreshing, fetchNext, refresh } = useFeedStore();

  // Initial load
  useEffect(() => {
    fetchNext();
  }, []);

  // Remove duplicate posts by id (store already ensures uniqueness, but keep safety)
  const uniquePosts = [...new Map(posts.map((item) => [item.id, item])).values()];

  return (
    <SafeAreaView>
      <Header />
      <Text>Welcome, {user?.fullname}!</Text>
      <FlatList
        data={uniquePosts}
        windowSize={5}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ListPost item={item} onReload={refresh} />}
        onEndReached={fetchNext}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center">
              <Text className="text-xl font-semibold text-gray-500">Tidak ada data Postingan</Text>
              <Text className="my-2 text-sm text-gray-500">
                Silahkan follow user lain di halaman search <Feather name="search" size={14} color={colors.active} />
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={loading ? <ActivityIndicator size={"large"} style={{ marginVertical: 20 }} /> : null}
      />
    </SafeAreaView>
  );
};

export default index;
