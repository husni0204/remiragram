import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { FontAwesome } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import CustomAlert from "@/src/components/CustomAlert";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Client-side cap for profile photo uploads — downscale so the longest side
// <= MAX_DIMENSION and re-encode as JPEG at UPLOAD_QUALITY before hitting the
// API. Avatar is rendered at w-24 (96px, ~192px on retina), so 512px gives a
// comfortable margin without shipping a multi-megapixel original.
const MAX_DIMENSION = 512;
const UPLOAD_QUALITY = 0.7;

const resizeImage = async (uri: string): Promise<string> => {
  try {
    const size = await new Promise<{ width: number; height: number }>(
      (resolve, reject) =>
        Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject)
    );

    if (Math.max(size.width, size.height) <= MAX_DIMENSION) return uri;

    const scale = MAX_DIMENSION / Math.max(size.width, size.height);
    const targetW = Math.round(size.width * scale);

    const { uri: outUri } = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: targetW } }],
      { compress: UPLOAD_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
    );

    return outUri;
  } catch {
    return uri;
  }
};

const UpdateProfileScreen = () => {
  const { user, setTokenData, token } = useAuthStore();
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ visible: boolean; title: string; message: string; isError: boolean; onConfirm?: () => void }>({
    visible: false,
    title: "",
    message: "",
    isError: false,
  });
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [fullname, setFullname] = useState<string>(user?.fullname ?? "");
  const [bio, setBio] = useState<string | null | undefined>(user?.bio);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: UPLOAD_QUALITY,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(await resizeImage(uri));
    }
  };

  // Open the phone camera to capture a new profile photo
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setAlert({ visible: true, title: "Permission", message: "Izin kamera ditolak. Aktifkan izin kamera di pengaturan HP.", isError: true });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: UPLOAD_QUALITY,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(await resizeImage(uri));
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
      setAlert({ visible: true, title: "Success", message: "Photo profile berhasil diupdate", isError: false, onConfirm: () => setImage(null) });
      setImage(null);
    },
    onError: (error: any) => {
      setAlert({ visible: true, title: "Error", message: error.message ?? "Gagal mengupdate photo profile", isError: true });
    },
  });

  // Mutation for updating user profile details
  const updateProfileMutation = useMutation<any, any, { username: string; fullname: string; bio: string | null | undefined }, unknown>({
    mutationFn: ({ username, fullname, bio }) =>
      customAPI.put("/user/update-user", { username, fullname, bio }),
    onSuccess: (res) => {
      const data = res.data;
      setTokenData(data.data, data.token);
      setAlert({ visible: true, title: "Success", message: "Profile berhasil diupdate", isError: false });
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message;
      const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      setAlert({ visible: true, title: "Error", message: errorData ?? "Gagal mengupdate profile", isError: true });
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

          <View className="flex-row items-center justify-center gap-2 mt-3">
            <TouchableOpacity onPress={pickImage}>
              <Text className="text-blue-500 text-sm">Pilih Galeri</Text>
            </TouchableOpacity>
            <Text className="text-gray-400 text-sm">•</Text>
            <TouchableOpacity onPress={takePhoto}>
              <Text className="text-blue-500 text-sm">Ambil Foto</Text>
            </TouchableOpacity>
          </View>

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
