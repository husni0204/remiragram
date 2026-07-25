import { useToastStore } from "@/src/stores/toastStore";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

const Toast = () => {
    const { visible, message, type } = useToastStore();
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: -20,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const bgColor = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-[#09637E]",
    }[type];

    const icon = {
        success: "✓",
        error: "✕",
        info: "ℹ",
    }[type];

    if (!visible && !message) return null;

    return (
        <Animated.View
            style={{ opacity, transform: [{ translateY }] }}
            className="absolute top-12 left-4 right-4 z-50"
        >
            <View className={`flex-row items-center ${bgColor} px-4 py-3 rounded-xl shadow-lg`}>
                <View className="w-7 h-7 rounded-full bg-white/20 items-center justify-center mr-3">
                    <Text className="text-white font-bold text-sm">{icon}</Text>
                </View>
                <Text className="text-white flex-1 text-sm font-medium">{message}</Text>
            </View>
        </Animated.View>
    );
};

export default Toast;
