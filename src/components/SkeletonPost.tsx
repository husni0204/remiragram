import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const SkeletonPost = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View className="mx-4 mb-4 bg-white rounded-2xl overflow-hidden" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
            {/* Header skeleton */}
            <View className="flex-row items-center px-4 py-3">
                <Animated.View style={{ opacity }} className="w-10 h-10 rounded-full bg-gray-200" />
                <Animated.View style={{ opacity }} className="w-24 h-4 rounded bg-gray-200 ml-3" />
            </View>
            {/* Image skeleton */}
            <Animated.View style={{ opacity }} className="w-full h-80 bg-gray-200" />
            {/* Actions skeleton */}
            <View className="flex-row justify-between items-center px-4 py-3">
                <View className="flex-row gap-4">
                    <Animated.View style={{ opacity }} className="w-6 h-6 rounded bg-gray-200" />
                    <Animated.View style={{ opacity }} className="w-6 h-6 rounded bg-gray-200" />
                </View>
                <Animated.View style={{ opacity }} className="w-6 h-6 rounded bg-gray-200" />
            </View>
            {/* Caption skeleton */}
            <View className="px-4 pb-4">
                <Animated.View style={{ opacity }} className="w-32 h-3 rounded bg-gray-200 mb-2" />
                <Animated.View style={{ opacity }} className="w-full h-3 rounded bg-gray-200 mb-2" />
                <Animated.View style={{ opacity }} className="w-3/4 h-3 rounded bg-gray-200" />
            </View>
        </View>
    );
};

export default SkeletonPost;
