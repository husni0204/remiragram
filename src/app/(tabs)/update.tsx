import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { useToastStore } from "@/src/stores/toastStore";
import { colors } from "@/src/utils/color";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const UpdateProfileScreen = () => {
    const { user, loadToken, setTokenData, token } = useAuthStore();
    const toast = useToastStore((s) => s.show);

    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState(user?.username);
    const [fullname, setFullname] = useState(user?.fullname);
    const [bio, setBio] = useState<string | null | undefined>(user?.bio);

    const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
    const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);

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

    const handleUpdatePhoto = async () => {
        if (!image) return;

        try {
            setLoadingPhoto(true);

            const formData = new FormData();
            formData.append("image", {
                uri: image,
                name: "profile.jpg",
                type: "image/jpeg",
            } as any);

            const { data } = await customAPI.put("/user/update-photo-profile", formData, { headers: { "Content-Type": "multipart/form-data" } });

            setTokenData(data.data, token!);
            loadToken();

            toast("Photo profile berhasil diupdate", "success");

            setImage(null);
        } catch (error: any) {
            toast(error.message, "error");
        } finally {
            setLoadingPhoto(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoadingProfile(true);

            const { data } = await customAPI.put("/user/update-user", {
                username,
                fullname,
                bio,
            });

            setTokenData(data.data, token!);
            loadToken();

            toast("Profile berhasil diupdate", "success");
        } catch (error: any) {
            const errorMsg = error.response.data.message;
            const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
            toast(errorData, "error");
        } finally {
            setLoadingProfile(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Header />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="px-4 mt-4 mb-2">
                    <Text className="font-bold text-xl text-gray-900">Edit Profil</Text>
                    <Text className="text-gray-500 text-sm mt-1">Perbarui informasi akunmu</Text>
                </View>

                {/* Photo Profile */}
                <View className="items-center mb-6 px-4">
                    <View className="relative">
                        {user?.image ? (
                            <Image source={{ uri: image || user.image }} className="w-28 h-28 rounded-full border-4 border-white" />
                        ) : image ? (
                            <Image source={{ uri: image }} className="w-28 h-28 rounded-full border-4 border-white" />
                        ) : (
                            <View className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center border-4 border-white">
                                <FontAwesome name="user" size={40} color={colors.inactive} />
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={pickImage}
                            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-active items-center justify-center border-2 border-white"
                        >
                            <Feather name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    {image && (
                        <TouchableOpacity
                            onPress={handleUpdatePhoto}
                            disabled={loadingPhoto}
                            className="mt-4 px-6 py-2.5 bg-active rounded-xl flex-row items-center"
                            style={{ shadowColor: "#09637E", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
                        >
                            {loadingPhoto ? (
                                <ActivityIndicator color={"#fff"} />
                            ) : (
                                <>
                                    <Feather name="check" size={16} color="white" />
                                    <Text className="font-semibold text-white ml-2">Simpan Foto</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Form Input */}
                <View className="px-4">
                    <View className="bg-white rounded-2xl p-4 mb-3" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                        <Text className="mb-2 text-gray-500 text-sm font-medium">Fullname</Text>
                        <TextInput
                            className="text-gray-900 text-base"
                            value={fullname}
                            onChangeText={setFullname}
                            placeholder="Masukan full name"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View className="bg-white rounded-2xl p-4 mb-3" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                        <Text className="mb-2 text-gray-500 text-sm font-medium">Username</Text>
                        <TextInput
                            className="text-gray-900 text-base"
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Masukan username"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View className="bg-white rounded-2xl p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                        <Text className="mb-2 text-gray-500 text-sm font-medium">Biodata</Text>
                        <TextInput
                            className="text-gray-900 text-base"
                            value={bio || undefined}
                            onChangeText={setBio}
                            placeholder="Masukan biodata"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>
                    <TouchableOpacity
                        disabled={loadingProfile}
                        onPress={handleUpdateProfile}
                        className="items-center py-4 bg-active rounded-xl"
                        style={{ shadowColor: "#09637E", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
                    >
                        {loadingProfile ? (
                            <ActivityIndicator color={"#fff"} />
                        ) : (
                            <Text className="font-bold text-white text-base">Update Profile</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default UpdateProfileScreen;
