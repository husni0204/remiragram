import { Link } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center px-8 bg-background">
      {/* Logo */}
      <View className="items-center">
        <Text className="text-4xl font-semibold text-active">
          Create Account
        </Text>
        <Text className="text-gray-500 mt-2">
          Join and Start Sharing Your Moments 😀
        </Text>
      </View>
      {/* Form */}
      <View className="mt-5">
        <TextInput
          placeholder="Full Name"
          className="bg-gray-300 px-4 rounded-xl mb-4"
        />
        <TextInput
          placeholder="Username"
          className="bg-gray-300 px-4 rounded-xl mb-4"
        />
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
          <Text className="text-white font-semibold text-base">Register</Text>
        </TouchableOpacity>
      </View>
      {/* Footer */}
      <View className="items-center mb-10 flex-row justify-center">
        <Text className="text-gray-500">Already have an account ? </Text>
        <Link href={"/(auth)"} className="text-active font-semibold">
          Sign in
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
