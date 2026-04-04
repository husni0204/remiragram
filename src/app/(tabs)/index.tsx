/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import Header from "@/src/components/Header";
import ListPost from "@/src/components/ListPost";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { Feed } from "@/src/types/feed";
import { colors } from "@/src/utils/color";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const { user } = useAuthStore();
  console.log("User data :", user?.fullname);
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
      setTotalPage(data.totalPages);
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

// Hilangkan duplikat berdasarkan id
const uniquePosts = [
  ...new Map(postData.map(item => [item.id, item])).values()
];

// Cari ID duplikat di postData
// const ids = postData.map(item => item.id);
// const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

// if (duplicates.length > 0) {
//   console.log("Duplikat ID ditemukan:", duplicates);
// } else {
//   console.log("Tidak ada duplikat ID");
// }


  return (
    <SafeAreaView>
      <Header />
      <Text>Welcome, {user?.fullname}!</Text>
      <FlatList
        data={uniquePosts}
        windowSize={5}
        // keyExtractor={(item) => item.id.toString()}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ListPost item={item} />}
        onEndReached={fetchFeed}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center">
              <Text className="text-xl font-semibold text-gray-500">
                Tidak ada data Postingan
              </Text>
              <Text className="my-2 text-sm text-gray-500">
                Silahkan follow user lain di halaman search{" "}
                <Feather name="search" size={14} color={colors.active} />
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size={"large"} style={{ marginVertical: 20 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default index;
