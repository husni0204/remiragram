import { Stack } from "expo-router";

export default function DetailRouteLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="post/[id]" />
        </Stack>
    );
}
