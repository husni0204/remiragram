import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Parisienne-Reggular: require("../assets/fonts/Parisienne-Regular.ttf"),
    Poppins-Regular: require("../assets/fonts/Poppins-Regular.ttf"),
    Montserrat-VariableFont: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    Montserrat-Italic-VariableFont_wght: require("../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return <View></View>;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="(tabs)" /> */}
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
