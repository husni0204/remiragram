import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../stores/authStore";

// The React Native Element Inspector overlay is controlled via the Dev Menu:
//   shake device -> "Toggle Inspect Element" -> off
// There is no public API to disable it from JS at module-load time in RN 0.84+.
// In production builds (EAS / release), this overlay never appears.

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

export default function RootLayout() {
    const ParisienneRegular = require("../assets/fonts/Parisienne-Regular.ttf");
    const PoppinsRegular = require("../assets/fonts/Poppins-Regular.ttf");
    const MontserratVariableFont = require("../assets/fonts/Montserrat-VariableFont_wght.ttf");
    const MontserratItalicVariableFont = require("../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf");
    const PoppinsSemiBold = require("../assets/fonts/Poppins-SemiBold.ttf");

    const [fontsLoaded] = useFonts({
        ParisienneRegular,
        PoppinsRegular,
        MontserratVariableFont,
        MontserratItalicVariableFont,
        PoppinsSemiBold,
    });

    const { token, isLoading, loadToken, user } = useAuthStore();

    useEffect(() => {
        loadToken();
    }, [loadToken]);

    return (
        <QueryClientProvider client={queryClient}>
            {!fontsLoaded || isLoading ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator size={"large"} />
                </View>
            ) : (
                <Stack screenOptions={{ headerShown: false }}>{!token || !user ? <Stack.Screen name="(auth)" /> : <Stack.Screen name="(tabs)" />}</Stack>
            )}
        </QueryClientProvider>
    );
}
