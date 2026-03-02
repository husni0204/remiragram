import { Stack } from "expo-router";
import { FC } from "react";

const AuthRoutesLayout: FC = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default AuthRoutesLayout;
