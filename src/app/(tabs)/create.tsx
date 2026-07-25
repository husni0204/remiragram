import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { useToastStore } from "@/src/stores/toastStore";
import { colors } from "@/src/utils/color";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const CreateScreen = () => {
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    const toast = useToastStore((s) => s.show);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCreateFeed = async () => {
        if (!caption || !image) {
            toast("Caption dan gambar harus diisi", "error");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", {
            uri: image,
            name: `photo_${Date.now()}.jpg`,
            type: "image/jpeg",
        } as any);

        try {
            setLoading(true);
            await customAPI.post("/feed", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setLoading(false);

            toast("Postingan berhasil dibuat", "success");
            router.push("/(tabs)");
        } catch (error) {
            console.log("Errornya apa mas ? : ", error);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Header />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="px-4 mt-4 mb-2">
                    <Text className="font-bold text-xl text-gray-900">Buat Postingan</Text>
                    <Text className="text-gray-500 text-sm mt-1">Bagikan momenmu dengan yang lain</Text>
                </View>
                {/* Image Upload */}
                <View className="px-4">
                    <View className="bg-white rounded-2xl p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                        {image ? (
                            <View>
                                <Image source={{ uri: image }} className="w-full h-64 rounded-xl mb-3" />
                                <TouchableOpacity onPress={() => setImage(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 items-center justify-center">
                                    <Feather name="x" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={pickImage}>
                                <View className="w-full h-64 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 justify-center items-center">
                                    <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3">
                                        <Feather name="image" size={28} color={colors.inactive} />
                                    </View>
                                    <Text className="text-gray-600 font-medium">Pilih Gambar</Text>
                                    <Text className="text-gray-400 text-sm mt-1">Ketuk untuk upload</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    {/* caption */}
                    <View className="bg-white rounded-2xl p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                        <Text className="text-gray-900 font-bold mb-3">Caption</Text>
                        <TextInput
                            placeholder="Tulis sesuatu untuk postingan..."
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                            numberOfLines={4}
                            className="text-gray-700 leading-5"
                            placeholderTextColor="#9CA3AF"
                            textAlignVertical="top"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleCreateFeed}
                        disabled={loading || !caption || !image}
                        className={`py-4 rounded-xl items-center ${loading || !caption || !image ? "bg-gray-300" : "bg-active"}`}
                        style={caption && image ? { shadowColor: "#09637E", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 } : {}}
                    >
                        {loading ? (
                            <ActivityIndicator color={"white"} />
                        ) : (
                            <Text className="text-white text-lg font-bold">Posting</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default CreateScreen;
