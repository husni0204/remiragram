import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");

  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      console.log("Errornya apa mas ? : ", error);
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
              <Image source={{ uri: image }} className="w-full h-64 rounded-lg mb-4" />
            ) : (
              <TouchableOpacity onPress={pickImage}>
                <View className="w-full h-64 rounded-xl bg-gray-200 justify-center items-center mb-4">
                  <Feather name="image" size={40} color={"gray"} />
                  <Text className="text-gray-500 mt-40">Upload Gambar Postingan</Text>
                </View>
              </TouchableOpacity>
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
