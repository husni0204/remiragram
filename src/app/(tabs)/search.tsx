import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { User } from "@/src/types/auth";
import { colors } from "@/src/utils/color";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

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

        const res = await customAPI.get(
          `/user/search?username=${debouncedQuery}`,
        );

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
    <SafeAreaView>
      <Header />
      <Text className="font-semibold text-2xl text-center my-3">
        Searching User by Username
      </Text>
      {/* Inputan Searching */}
      <View className="px-4 mb-3">
        <TextInput
          placeholder="cari username ... "
          value={query}
          onChangeText={setQuery}
          className="bg-gray-100 p-4 rounded-xl mb-4 text-base border"
        />
      </View>
      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size={"large"}
          color={colors.active}
          className="mt-5"
        />
      )}

      {/* List user */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.username}</Text>}
        ListEmptyComponent={
          !loading && debouncedQuery ? (
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
