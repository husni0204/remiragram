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

const RegisterScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const { setTokenData } = useAuthStore();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { data } = await customAPI.post("/auth/register", {
        email: email,
        password: password,
        username: username,
        fullname: fullname,
      });

      await setTokenData(data.data, data.token);
      Alert.alert("Success", "Berhasil Register!");
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
          <Text className="text-4xl font-semibold text-active">
            Create Account
          </Text>
          <Text className="mt-2 text-gray-500">
            Join and Start Sharing Your Moments 😀
          </Text>
        </View>
        {/* Form */}
        <View className="mt-5">
          <TextInput
            placeholder="Full Name"
            className="px-4 mb-4 bg-gray-300 rounded-xl"
            autoCapitalize="none"
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            placeholder="Username"
            className="px-4 mb-4 bg-gray-300 rounded-xl"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
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
            onPress={handleRegister}
          >
            {loading ? (
              <ActivityIndicator color={"#fff"} />
            ) : (
              <Text className="text-base font-semibold text-white">
                Register
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View className="flex-row items-center justify-center mb-10">
          <Text className="text-gray-500">Already have an account ? </Text>
          <Link href={"/(auth)"} className="font-semibold text-active">
            Sign in
          </Link>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
