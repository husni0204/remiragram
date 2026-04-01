import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../stores/authStore";

export default function RootLayout() {
  // const [fontsLoaded] = useFonts({
  //   Parisienne-Reggular: require("../assets/fonts/Parisienne-Regular.ttf"),
  //   Poppins-Regular: require("../assets/fonts/Poppins-Regular.ttf"),
  //   Montserrat-VariableFont: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  //   Montserrat-Italic-VariableFont_wght: require("../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf"),
  // });

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
  }, [loadToken, token]);

  if (!fontsLoaded || isLoading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!token || !user ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
