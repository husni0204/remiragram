import Header from "@/src/components/Header";
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UpdateProfileScreen = () => {
    const { user, loadToken, setTokenData, token } = useAuthStore();

    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState(user?.username);
    const [fullname, setFullname] = useState(user?.fullname);
    const [bio, setBio] = useState<string | null | undefined>(user?.bio);

    const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
    const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);

    // Ambil gambar
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

            Alert.alert("Sukses", "Photo profile berhasil diupdate");

            setImage(null);
        } catch (error: any) {
            Alert.alert("Error", error.message);
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

            Alert.alert("Sukses", "Profile berhasil diupdate");
        } catch (error: any) {
            const errorMsg = error.response.data.message;
            const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
            Alert.alert("Error", errorData);
        } finally {
            setLoadingProfile(false);
        }
    };

    return (
        <SafeAreaView>
            <Header />
            <View className="px-5">
                {/* Photo Profile */}
                <View className="items-center mb-6">
                    <View className="flex-row justify-evenly">
                        {user?.image ? (
                            <Image source={{ uri: image || user.image }} className="w-24 h-24 rounded-full" />
                        ) : image ? (
                            <Image source={{ uri: image }} className="w-24 h-24 rounded-full" />
                        ) : (
                            <FontAwesome name="user-circle" size={50} color="gray" />
                        )}
                    </View>

                    <TouchableOpacity onPress={pickImage}>
                        <Text className="mt-3 text-blue-500">Ganti Photo Profile</Text>
                    </TouchableOpacity>
                    {image && (
                        <TouchableOpacity onPress={handleUpdatePhoto} disabled={loadingPhoto} className="px-4 py-2 mt-3 rounded-lg bg-active">
                            {loadingPhoto ? <ActivityIndicator color={"#fff"} /> : <Text className="font-semibold text-white">Update Photo Profile</Text>}
                        </TouchableOpacity>
                    )}
                </View>
                {/* Form Input */}
                <View className="mb-4">
                    <Text className="mb-1 text-gray-500">Fullname</Text>
                    <TextInput className="px-3 py-2 border border-gray-300 rounded-lg" value={fullname} onChangeText={setFullname} placeholder="Masukan full name" />
                </View>
                <View className="mb-4">
                    <Text className="mb-1 text-gray-500">User Name</Text>
                    <TextInput className="px-3 py-2 border border-gray-300 rounded-lg" value={username} onChangeText={setUsername} placeholder="Masukan username" />
                </View>
                <View className="mb-4">
                    <Text className="mb-1 text-gray-500">Biodata</Text>
                    <TextInput className="px-3 py-2 border border-gray-300 rounded-lg" value={bio || undefined} onChangeText={setBio} placeholder="Masukan biodata" multiline />
                </View>
                <TouchableOpacity disabled={loadingProfile} onPress={handleUpdateProfile} className="items-center py-3 bg-active rounded-xl">
                    {loadingProfile ? <ActivityIndicator color={"#fff"} /> : <Text className="font-semibold text-white">Update Profile</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default UpdateProfileScreen;
