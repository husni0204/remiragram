import { Image, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type UserProfileHeaderProps = {
    image?: string | null;
    followerCount: number;
    followingCount: number;
};

const UserProfileHeader = ({ image, followerCount, followingCount }: UserProfileHeaderProps) => {
    return (
        <View className="flex-row justify-evenly items-center px-5 py-4">
            <View className="items-center">
                <Text className="font-semibold text-2xl">{followerCount}</Text>
                <Text className="text-gray-500">followers</Text>
            </View>
            {image ? <Image className="w-28 h-28 rounded-full" source={{ uri: image }} /> : <FontAwesome name="user-circle" size={100} />}
            <View className="items-center">
                <Text className="font-semibold text-2xl">{followingCount}</Text>
                <Text className="text-gray-500">following</Text>
            </View>
        </View>
    );
};

export default UserProfileHeader;
