import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";
import CustomAlert from "./CustomAlert";
import { useState } from "react";

const Header = () => {
    const { removeToken } = useAuthStore();
    const router = useRouter();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleLogout = async () => {
        try {
            await removeToken();
            // Tidak perlu setLogoutModalVisible(false) karena component akan di-unmount
            router.replace("/(auth)"); 
        } catch {
            setLogoutModalVisible(false);
        }
    };

    return (
        <View className="flex-row items-center justify-between px-2 py-5 bg-background">
            <Text className="text-3xl text-black font-title">RemiraGram</Text>
            <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
                <Feather name="arrow-left-circle" color={"red"} size={30} />
            </TouchableOpacity>

            <CustomAlert
                isVisible={isLogoutModalVisible}
                title="Keluar"
                message="Apakah Anda yakin ingin keluar dari akun Anda?"
                onCancel={() => setLogoutModalVisible(false)}
                onConfirm={handleLogout}
                confirmText="Keluar"
            />
        </View>
    );
};

export default Header;
