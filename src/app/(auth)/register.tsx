import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { Link, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const RegisterScreen = () => {
  const { setTokenData } = useAuthStore();
  const router = useRouter();

  const registerMutation = useMutation<
    any,
    any,
    { email: string; password: string; username: string; fullname: string },
    unknown
  >({
    mutationFn: ({ email, password, username, fullname }) =>
      customAPI.post("/auth/register", { email, password, username, fullname }),
    onSuccess: (res) => {
      const data = res.data;
      setTokenData(data.data, data.token);
      Alert.alert("Success", "Berhasil Register!");
      router.push("/(tabs)");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message;
      const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      Alert.alert("Error", errorData ?? "Terjadi kesalahan");
    },
  });

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [fullname, setFullname] = React.useState<string>("");

  const handleRegister = () => {
    registerMutation.mutate({ email, password, username, fullname });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView className="justify-center flex-1 px-8 bg-background">
        <View className="items-center">
          <Text className="text-4xl font-semibold text-active">Create Account</Text>
          <Text className="mt-2 text-gray-500">Join and Start Sharing Your Moments 😀</Text>
        </View>
        <View className="mt-5">
          <TextInput placeholder="Full Name" className="px-4 mb-4 bg-gray-300 rounded-xl" autoCapitalize="none" value={fullname} onChangeText={setFullname} />
          <TextInput placeholder="Username" className="px-4 mb-4 bg-gray-300 rounded-xl" autoCapitalize="none" value={username} onChangeText={setUsername} />
          <TextInput placeholder="Email" className="px-4 mb-4 bg-gray-300 rounded-xl" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Password" className="px-4 mb-4 bg-gray-300 rounded-xl" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity className="items-center p-4 mb-6 bg-active rounded-xl" onPress={handleRegister} disabled={registerMutation.isPending}>
            {registerMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">Register</Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-center mb-10">
          <Text className="text-gray-500">Already have an account ? </Text>
          <Link href="/(auth)" className="font-semibold text-active">Sign in</Link>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
