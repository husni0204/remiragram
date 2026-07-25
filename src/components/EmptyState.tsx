import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../utils/color";

const EmptyState = () => {
    const router = useRouter();

    return (
        <View className="items-center justify-center px-8 py-16">
            <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6">
                <Feather name="image" size={40} color={colors.inactive} />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">Belum Ada Postingan</Text>
            <Text className="text-gray-500 text-center mb-6 leading-6">
                Mulai follow orang lain untuk melihat postingan mereka di sini
            </Text>
            <TouchableOpacity
                onPress={() => router.push("/(tabs)/search")}
                className="flex-row items-center bg-active px-6 py-3 rounded-xl"
                style={{ shadowColor: "#09637E", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
            >
                <Feather name="search" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Cari Pengguna</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EmptyState;
