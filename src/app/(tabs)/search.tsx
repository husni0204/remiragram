import Header from "@/src/components/Header";
import ListUser from "@/src/components/ListUser";
import customAPI from "@/src/config/api";
import { User } from "@/src/types/auth";
import { colors } from "@/src/utils/color";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1500);

    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => customAPI.get(`/user/search?username=${debouncedQuery}`).then((res) => res.data.data || res.data),
    enabled: !!debouncedQuery,
  });

  return (
    <SafeAreaView>
      <Header />
      <Text className="font-semibold text-2xl text-center my-3">Searching User by Username</Text>
      <View className="px-4 mb-3">
        <TextInput
          placeholder="cari username ... "
          value={query}
          onChangeText={setQuery}
          className="bg-gray-100 p-4 rounded-xl mb-4 text-base border"
        />
      </View>

      {isLoading && <ActivityIndicator size="large" color={colors.active} className="mt-5" />}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ListUser item={item} />}
        ListEmptyComponent={
          !isLoading && debouncedQuery ? (
            <View className="items-center mt-10">
              <Text className="text-gray-500">User tidak ditemukan !</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
