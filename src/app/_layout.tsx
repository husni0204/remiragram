import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuthStore } from "../stores/authStore";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

export default function RootLayout() {
    const { token, isLoading, loadToken, user } = useAuthStore();

    useEffect(() => {
        loadToken();
    }, [loadToken]);

    if (isLoading) {
        return (
            <View className="items-center justify-center flex-1">
                <ActivityIndicator size={"large"} />
                <Text className="mt-4">Memuat sesi...</Text>
            </View>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
                {!token || !user ? <Stack.Screen name="(auth)" /> : <Stack.Screen name="(tabs)" />}
            </Stack>
        </QueryClientProvider>
    );
}