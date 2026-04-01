import { Feather } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../stores/authStore";

const Header = () => {
  const { removeToken } = useAuthStore();
  const handleLogout = async () => {
    try {
      await removeToken();
      Alert.alert("Keluar", "Kamu berhasil keluar dari akunmu!");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  return (
    <View className="flex-row items-center justify-between px-2 py-5 bg-background">
      <Text className="text-3xl text-black font-title">RemiraGram</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Feather name="arrow-left-circle" color={"red"} size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
