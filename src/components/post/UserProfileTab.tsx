import { Text, TouchableOpacity, View } from "react-native";

type UserProfileTabProps = {
    tab: "posts" | "bookmarks";
    setTab: (value: "posts" | "bookmarks") => void;
};

const UserProfileTab = ({ tab, setTab }: UserProfileTabProps) => {
    return (
        <View className="flex-row my-3">
            <TouchableOpacity className={`flex-1 py-3 items-center rounded-full ${tab === "posts" ? "border-b-2 border-black bg-black/40" : ""}`} onPress={() => setTab("posts")}>
                <Text className={`${tab === "posts" ? "font-semibold text-white" : "text-gray-700"}`}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className={`flex-1 py-3 items-center rounded-full ${tab === "bookmarks" ? "border-b-2 border-black bg-black/40" : ""}`}
                onPress={() => setTab("bookmarks")}
            >
                <Text className={`${tab === "bookmarks" ? "font-semibold text-white" : "text-gray-700"}`}>Bookmarks</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserProfileTab;
