import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";
import { User } from "../types/auth";
import ButtonFollow from "./post/ButtonFollow";

const ListUser = ({ item }: { item: User }) => {
    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <View className="flex-row">
                {item.image ? <Image source={{ uri: item.image }} className="w-16 h-16 rounded-full" /> : <FontAwesome name="user-circle" size={50} />}

                <View className="ml-3">
                    <Text className="font-semibold">{item.fullname}</Text>
                    <Text className="text-gray-500">@{item.username}</Text>
                </View>
            </View>
            <ButtonFollow userId={item.id} />
        </View>
    );
};

export default ListUser;
