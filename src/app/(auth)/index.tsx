import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { setTokenData } = useAuthStore();

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await customAPI.post("/auth/login", {
        email: email,
        password: password,
      });

      await setTokenData(data.data, data.token);
      Alert.alert("Success", "Berhasil Login");
      router.push("/(tabs)");
    } catch (error: any) {
      const errorMsg = error.response.data.message;
      const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      Alert.alert("Error", errorData);
      console.log("ini errornya :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="justify-center flex-1 px-8 bg-background">
        {/* Logo */}
        <View className="items-center">
          <Text className="text-4xl font-title text-active">RemiraGram</Text>
          <Text className="mt-2 text-gray-500">Welcome 😀</Text>
        </View>
        {/* Form */}
        <View className="mt-5">
          <TextInput
            placeholder="Email"
            className="px-4 mb-4 bg-gray-300 rounded-xl"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            className="px-4 mb-4 bg-gray-300 rounded-xl"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="items-center p-4 mb-6 bg-active rounded-xl"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={"#fff"} />
            ) : (
              <Text className="text-base font-semibold text-white">Login</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View className="flex-row items-center justify-center mb-10">
          <Text className="text-gray-500">Don&apos;t have an account ? </Text>
          <Link href={"/(auth)/register"} className="font-semibold text-active">
            Sign up
          </Link>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
