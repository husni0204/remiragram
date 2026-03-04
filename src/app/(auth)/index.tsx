import { Link } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center px-8 bg-background">
      {/* Logo */}
      <View className="items-center">
        <Text className="text-4xl font-title text-active">RemiraGram</Text>
        <Text className="text-gray-500 mt-2">Welcome 😀</Text>
      </View>
      {/* Form */}
      <View className="mt-5">
        <TextInput
          placeholder="Email"
          className="bg-gray-300 px-4 rounded-xl mb-4"
        />
        <TextInput
          placeholder="Password"
          className="bg-gray-300 px-4 rounded-xl mb-4"
          secureTextEntry
        />
        <TouchableOpacity className="bg-active p-4 rounded-xl items-center mb-6">
          <Text className="text-white font-semibold text-base">Login</Text>
        </TouchableOpacity>
      </View>
      {/* Footer */}
      <View className="items-center mb-10 flex-row justify-center">
        <Text className="text-gray-500">Don&apos;t have an account ? </Text>
        <Link href={"/(auth)/register"} className="text-active font-semibold">
          Sign up
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
