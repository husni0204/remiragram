/* eslint-disable react-hooks/exhaustive-deps */
import customAPI from "@/src/config/api";
import { useAuthStore } from "@/src/stores/authStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const ButtonFollow = ({ userId }: { userId: number }) => {
    const { user } = useAuthStore();
    const [checkUser, setCheckUser] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const checkFollowUser = async () => {
        setLoading(true);
        try {
            const { data } = await customAPI.get(`/follow/${userId}`);
            // console.log("ini datanya :", data)
            setCheckUser(data.data);
        } catch (error) {
            console.log("error check follow :", error);
        } finally {
            setLoading(false);
        }
    };

    const unFollowUser = async () => {
        try {
            await customAPI.delete(`/follow/${userId}`);
            checkFollowUser();
        } catch (error) {
            console.log("error unfollow :", error);
        }
    };

    const followUser = async () => {
        try {
            await customAPI.post(`/follow`, { followUserId: userId });
            checkFollowUser();
        } catch (error) {
            console.log("error unfollow :", error);
        }
    };

    useEffect(() => {
        checkFollowUser();
    }, []);

    if (loading) {
        return (
            <TouchableOpacity className="mx-5 p-5 rounded-full items-center bg-gray-500">
                <ActivityIndicator color={"fff"} />
            </TouchableOpacity>
        );
    }

    return (
        <>
            {user && user.id.toString() === userId.toString() ? null : checkUser ? (
                <TouchableOpacity className="mx-5 p-5 rounded-full items-center bg-red-500" onPress={unFollowUser}>
                    <Text className="font-semibold text-white">UnFollow</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity className="mx-5 p-5 rounded-full items-center bg-active" onPress={followUser}>
                    <Text className="font-semibold text-white">Follow</Text>
                </TouchableOpacity>
            )}
        </>
    );
};

export default ButtonFollow;
