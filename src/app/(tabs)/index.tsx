import Header from "@/src/components/Header";
import ListPost from "@/src/components/ListPost";
import customAPI from "@/src/config/api";
// import { useAuthStore } from "@/src/stores/authStore";
import { Feed } from "@/src/types/feed";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  // const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [postData, setPostData] = useState<Feed[]>([]);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(1);

  const fetchFeed = async () => {
    // Simulate fetching posts from an API
    if (loading) return;
    if (page > totalPage) return;
    setLoading(true);
    try {
      const { data } = await customAPI.get(`/feed?page=${page}&limit=2`);
      setPostData((prev) => [...prev, ...data.data]);
      setTotalPage(data.totalPage);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.log("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPostData([]);
    setPage(1);
    setTotalPage(1);
    await fetchFeed();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <SafeAreaView>
      <Header />
      {/* <Text>Welcome, {user?.username}!</Text> */}
      <FlatList
        data={postData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ListPost item={item} />}
        onEndReached={fetchFeed}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        // ListEmptyComponent={
        //   !loading ? (
        //     <View className="items-center">
        //       <Text className="text-xl font-semibold text-gray-500">
        //         Tidak ada data Postingan
        //       </Text>
        //       <Text className="my-2 text-sm text-gray-500">
        //         Silahkan follow user lain di halaman search{" "}
        //         <Feather name="search" size={14} color={colors.active} />
        //       </Text>
        //     </View>
        //   ) : null
        // }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size={"large"} style={{ marginVertical: 20 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Index;
