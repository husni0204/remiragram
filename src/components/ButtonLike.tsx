/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import customAPI from "../config/api";
import { colors } from "../utils/color";

const ButtonLike = ({ postId }: { postId: string }) => {
    const [like, setLike] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const checkLikePost = async () => {
        setLoading(true);
        try {
            const { data } = await customAPI.get(`/like/${Number(postId)}`);
            // console.log("ini datanya :", data.data)
            setLike(data.data);
        } catch (error) {
            console.log("error check follow :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLikePost();
    }, []);

    const toggleLike = async () => {
        try {
            await customAPI.post(`/like/${Number(postId)}`);
            checkLikePost();
        } catch (error) {
            console.log("error like post :", error);
        }
    };

    if (loading) {
        return (
            <TouchableOpacity>
                <ActivityIndicator color={colors.active} />
            </TouchableOpacity>
        );
    }

    return (
        <>
            {like ? (
                <TouchableOpacity onPress={toggleLike} disabled={loading}>
                    <FontAwesome name="heart" size={24} color={"red"} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={toggleLike} disabled={loading}>
                    <Feather name="heart" size={24} color={colors.inactive} />
                </TouchableOpacity>
            )}
        </>
    );
};

export default ButtonLike;
