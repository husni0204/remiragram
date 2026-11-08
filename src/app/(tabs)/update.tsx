import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UpdateProfileScreen = () => {
  const { user, setTokenData, token } = useAuthStore();
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [fullname, setFullname] = useState<string>(user?.fullname ?? "");
  const [bio, setBio] = useState<string | null | undefined>(user?.bio);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Mutation for updating profile photo
  const updatePhotoMutation = useMutation<any, any, string, unknown>({
    mutationFn: (imageUri: string) => {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      return customAPI.put("/user/update-photo-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (res) => {
      const data = res.data;
      setTokenData(data.data, data.token);
      Alert.alert("Success", "Photo profile berhasil diupdate");
      setImage(null);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message ?? "Gagal mengupdate photo profile");
    },
  });

  // Mutation for updating user profile details
  const updateProfileMutation = useMutation<any, any, { username: string; fullname: string; bio: string | null | undefined }, unknown>({
    mutationFn: ({ username, fullname, bio }) =>
      customAPI.put("/user/update-user", { username, fullname, bio }),
    onSuccess: (res) => {
      const data = res.data;
      setTokenData(data.data, data.token);
      Alert.alert("Success", "Profile berhasil diupdate");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message;
      const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      Alert.alert("Error", errorData ?? "Gagal mengupdate profile");
    },
  });

  const handleUpdatePhoto = () => {
    if (!image) return;
    updatePhotoMutation.mutate(image);
  };

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate({ username, fullname, bio });
  };

  return (
    <SafeAreaView>
      <Header />
      <View className="px-5">
        {/* Photo Profile */}
        <View className="items-center mb-6">
          <View className="flex-row justify-evenly">
            {user?.image || image ? (
              <Image source={{ uri: image || user?.image }} className="w-24 h-24 rounded-full" />
            ) : (
              <FontAwesome name="user-circle" size={50} color="gray" />
            )}
          </View>

          <TouchableOpacity onPress={pickImage}>
            <Text className="mt-3 text-blue-500">Ganti Photo Profile</Text>
          </TouchableOpacity>

          {image && (
            <TouchableOpacity
              onPress={handleUpdatePhoto}
              disabled={updatePhotoMutation.isPending}
              className="px-4 py-2 mt-3 rounded-lg bg-active"
            >
              {updatePhotoMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-semibold text-white">Update Photo Profile</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Form Input */}
        <View className="mb-4">
          <Text className="mb-1 text-gray-500">Fullname</Text>
          <TextInput
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={fullname}
            onChangeText={setFullname}
            placeholder="Masukan full name"
          />
        </View>
        <View className="mb-4">
          <Text className="mb-1 text-gray-500">User Name</Text>
          <TextInput
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={username}
            onChangeText={setUsername}
            placeholder="Masukan username"
          />
        </View>
        <View className="mb-4">
          <Text className="mb-1 text-gray-500">Biodata</Text>
          <TextInput
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={bio || undefined}
            onChangeText={setBio}
            placeholder="Masukan biodata"
            multiline
          />
        </View>

        <TouchableOpacity
          disabled={updateProfileMutation.isPending}
          onPress={handleUpdateProfile}
          className="items-center py-3 bg-active rounded-xl"
        >
          {updateProfileMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;
