import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useConfirmStore } from "../stores/confirmStore";
import { useToastStore } from "../stores/toastStore";

const Header = () => {
    const { removeToken } = useAuthStore();
    const toast = useToastStore((s) => s.show);
    const confirm = useConfirmStore((s) => s.show);
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        confirm("Keluar", "Kamu yakin ingin keluar dari akunmu?", async () => {
            try {
                await removeToken();
                toast("Kamu berhasil keluar dari akunmu!", "info");
            } catch (error) {
                console.log("Error during logout:", error);
            }
        });
    };

    return (
        <View className="bg-active" style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20 }}>
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center mr-3">
                        <Feather name="camera" size={20} color="white" />
                    </View>
                    <Text className="text-2xl font-bold text-white">RemiraGram</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                    <Feather name="log-out" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;
