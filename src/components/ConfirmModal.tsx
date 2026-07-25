import { useConfirmStore } from "@/src/stores/confirmStore";
import { Text, TouchableOpacity, View } from "react-native";

const ConfirmModal = () => {
    const { visible, title, message, onConfirm, hide } = useConfirmStore();

    if (!visible) return null;

    const handleConfirm = () => {
        onConfirm?.();
        hide();
    };

    return (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50">
            <View className="w-72 bg-white rounded-2xl p-6 shadow-lg">
                <Text className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</Text>
                <Text className="text-sm text-gray-500 text-center mb-6">{message}</Text>
                <View className="flex-row gap-3">
                    <TouchableOpacity onPress={hide} className="flex-1 py-3 rounded-xl bg-gray-200 items-center">
                        <Text className="font-semibold text-gray-700">Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirm} className="flex-1 py-3 rounded-xl bg-red-500 items-center">
                        <Text className="font-semibold text-white">Lanjut</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ConfirmModal;
