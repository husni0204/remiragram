import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import "../../global.css";

export default function Index() {
    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-yellow-300">
            <Text className="text-xl font-bold text-green-500">Welcome to Nativewind Ok!</Text>
        </SafeAreaView>
    );
}
