import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { Feather } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Client-side image cap applied BEFORE upload so we don't ship 12-50MP
// originals to the server. Longest side <= MAX_DIMENSION, JPEG re-encoded
// at UPLOAD_QUALITY. Keeps upload payloads ~1-2 MB for a typical phone
// photo while staying sharp for a social feed (feed renders <= 1080px).
const MAX_DIMENSION = 1080;
const UPLOAD_QUALITY = 0.7;

// Downscale the picked/captured image so the longest side is <= MAX_DIMENSION
// and re-encode it as JPEG at UPLOAD_QUALITY. Used for BOTH the gallery pick
// and the camera capture so the uploaded file is never the multi-megapixel
// original. Returns the original URI if the image is already within the cap
// or if the manipulator fails (never block the user on a resize hiccup).
const resizeImage = async (uri: string): Promise<string> => {
  try {
    // Determine the true source dimensions without a full decode.
    const size = await new Promise<{ width: number; height: number }>(
      (resolve, reject) =>
        Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject)
    );

    // Already small enough — keep the original (quality re-encode was already
    // applied by the picker via `quality: UPLOAD_QUALITY`).
    if (Math.max(size.width, size.height) <= MAX_DIMENSION) {
      return uri;
    }

    const scale = MAX_DIMENSION / Math.max(size.width, size.height);
    const targetW = Math.round(size.width * scale);
    const targetH = Math.round(size.height * scale);

    const { uri: outUri } = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: { width: targetW },
        },
      ],
      { compress: UPLOAD_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
    );

    void targetH; // Specifying only width preserves aspect ratio automatically.
    return outUri;
  } catch (e) {
    console.log("resizeImage: keeping original on failure", e);
    return uri;
  }
};

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");

  const router = useRouter();

  // Pick image from gallery (existing behaviour)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: UPLOAD_QUALITY,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(await resizeImage(uri));
    }
  };

  // Open camera & capture a new photo
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission", "Izin kamera ditolak. Aktifkan izin kamera di pengaturan HP.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: UPLOAD_QUALITY,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(await resizeImage(uri));
    }
  };

  const createPostMutation = useMutation<any, any, { caption: string; imageUri: string }, unknown>({
    mutationFn: ({ caption, imageUri }) => {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", {
        uri: imageUri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
      return customAPI.post("/feed", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      Alert.alert("Sukses", "Postingan berhasil dibuat");
      router.push("/(tabs)");
    },
    onError: (error) => {
      console.log("Error creating post:", error);
      Alert.alert("Error", "Gagal membuat postingan");
    },
  });

  const handleCreateFeed = () => {
    if (!caption || !image) {
      Alert.alert("Error", "Caption dan gambar harus diisi");
      return;
    }
    createPostMutation.mutate({ caption, imageUri: image });
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <SafeAreaView>
        <Header />
        <View className="p-5">
          <View className="bg-white rounded-2xl p-4 shadow mb-5">
            {image ? (
              <>
                <Image source={{ uri: image }} className="w-full h-64 rounded-lg mb-4" />
                <TouchableOpacity
                  onPress={takePhoto}
                  className="flex-row items-center justify-center"
                >
                  <Feather name="camera" size={14} color="#09637E" />
                  <Text className="ml-2 text-xs text-active font-medium">Retake</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={pickImage} className="w-full mb-3">
                  <View className="w-full h-56 rounded-xl bg-gray-200 justify-center items-center">
                    <Feather name="image" size={32} color={"gray"} />
                    <Text className="text-gray-500 mt-2">Pilih dari Galeri</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto}>
                  <View className="flex-row items-center justify-center rounded-lg bg-active px-4 py-3">
                    <Feather name="camera" size={16} color="#fff" />
                    <Text className="text-white text-sm font-medium ml-2">Ambil Foto</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View className="bg-white rounded-2xl p-4 shadow mb-5">
            <Text className="text-lg font-semibold mb-2">Caption</Text>
            <TextInput
              placeholder="Tulis sesuatu untuk postingan"
              value={caption}
              onChangeText={setCaption}
              multiline
              className="border border-gray-200 rounded-lg p-4 text-gray-700"
            />
          </View>

          <TouchableOpacity
            onPress={handleCreateFeed}
            disabled={createPostMutation.isPending}
            className="bg-active py-4 rounded-xl items-center"
          >
            {createPostMutation.isPending ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text className="text-white text-lg font-semibold">Upload Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateScreen;
