/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import EmptyState from "@/src/components/EmptyState";
import Header from "@/src/components/Header";
import ListPost from "@/src/components/ListPost";
import SkeletonPost from "@/src/components/SkeletonPost";
import WelcomeBanner from "@/src/components/WelcomeBanner";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { Feed } from "@/src/types/feed";
import { useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

const index = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [postData, setPostData] = useState<Feed[]>([]);
    const [page, setPage] = useState<number>(1);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(1);
    const isLoadingRef = useRef<boolean>(false);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    const fetchFeed = async (targetPage?: number, reset?: boolean) => {
        if (isLoadingRef.current) return;
        const currentPage = targetPage ?? page;
        const currentTotalPage = reset ? 1 : totalPage;
        if (!reset && currentPage > currentTotalPage) return;
        isLoadingRef.current = true;
        setLoading(true);
        try {
            const { data } = await customAPI.get(`/feed?page=${currentPage}&limit=2`);
            if (reset) {
                setPostData(data.data);
            } else {
                setPostData((prev) => [...prev, ...data.data]);
            }
            setTotalPage(data.totalPages);
            setPage(currentPage + 1);
        } catch (error) {
            console.log("Error fetching feed:", error);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
            setInitialLoad(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        isLoadingRef.current = false;
        await fetchFeed(1, true);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchFeed(1, false);
    }, []);

    const uniquePosts = [...new Map(postData.map((item) => [item.id, item])).values()];

    const renderSkeleton = () => (
        <View>
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <Header />
            <FlatList
                data={uniquePosts}
                windowSize={5}
                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 4, paddingBottom: 20 }}
                renderItem={({ item }) => <ListPost item={item} onReload={handleRefresh} />}
                onEndReached={fetchFeed}
                onEndReachedThreshold={0.5}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#09637E" />}
                ListHeaderComponent={<WelcomeBanner user={user} />}
                ListEmptyComponent={!loading && !initialLoad ? <EmptyState /> : null}
                ListFooterComponent={loading && !initialLoad ? <SkeletonPost /> : null}
            />
            {initialLoad && renderSkeleton()}
        </View>
    );
};

export default index;
