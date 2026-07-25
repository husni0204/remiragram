import { User } from "@/src/types/auth";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

const WelcomeBanner = ({ user }: { user: User | null }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 17) return "Selamat Siang";
        return "Selamat Malam";
    };

    return (
        <View className="mx-4 mt-4 mb-2 p-5 bg-active rounded-2xl" style={{ shadowColor: "#09637E", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
            <View className="flex-row items-center">
                <View className="mr-4">
                    {user?.image ? (
                        <Image source={{ uri: user.image }} className="w-14 h-14 rounded-full border-2 border-white/30" />
                    ) : (
                        <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center border-2 border-white/30">
                            <FontAwesome name="user" size={24} color="white" />
                        </View>
                    )}
                </View>
                <View className="flex-1">
                    <Text className="text-white/80 text-sm">{getGreeting()} 👋</Text>
                    <Text className="text-white text-lg font-bold mt-0.5">{user?.fullname || "User"}</Text>
                </View>
            </View>
        </View>
    );
};

export default WelcomeBanner;
