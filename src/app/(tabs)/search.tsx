import Header from "@/src/components/Header";
import ListUser from "@/src/components/ListUser";
import customAPI from "@/src/config/api";
import { User } from "@/src/types/auth";
import { colors } from "@/src/utils/color";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";

const SearchScreen = () => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 1500);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery) {
            setUsers([]);
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);

                const res = await customAPI.get(`/user/search?username=${debouncedQuery}`);

                setUsers(res.data.data || res.data);
            } catch (error) {
                console.log("ini errornya :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [debouncedQuery]);

    return (
        <View className="flex-1 bg-gray-50">
            <Header />
            <View className="px-4 mt-4 mb-2">
                <Text className="font-bold text-xl text-gray-900">Cari Pengguna</Text>
                <Text className="text-gray-500 text-sm mt-1">Temukan teman untuk di-follow</Text>
            </View>
            {/* Inputan Searching */}
            <View className="px-4 mb-3">
                <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4">
                    <Feather name="search" size={18} color={colors.inactive} />
                    <TextInput
                        placeholder="Cari username..."
                        value={query}
                        onChangeText={setQuery}
                        className="flex-1 py-4 ml-3 text-base"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>
            {/* Loading */}
            {loading && <ActivityIndicator size={"large"} color={colors.active} className="mt-5" />}

            {/* List user */}
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ListUser item={item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    !loading && debouncedQuery ? (
                        <View className="items-center mt-16">
                            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                                <Feather name="user-x" size={32} color={colors.inactive} />
                            </View>
                            <Text className="text-gray-600 font-medium">User tidak ditemukan</Text>
                            <Text className="text-gray-400 text-sm mt-1">Coba kata kunci lain</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default SearchScreen;
