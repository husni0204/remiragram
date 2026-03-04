import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View } from "react-native";

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

  if (!fontsLoaded) return <View></View>;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen name="(auth)" /> */}
    </Stack>
  );
}
