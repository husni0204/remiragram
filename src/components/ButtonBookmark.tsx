/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import customAPI from "../config/api";
import { colors } from "../utils/color";

const ButtonBookmark = ({ postId }: { postId: string }) => {
    const [saved, setSaved] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const checkBookmarkPost = async () => {
        setLoading(true);
        try {
            const { data } = await customAPI.get(`/bookmark/${Number(postId)}`);
            // console.log("ini datanya :", data.data)
            setSaved(data.data);
        } catch (error) {
            console.log("error check bookmark :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkBookmarkPost();
    }, []);

    const toggleSavedPost = async () => {
        try {
            await customAPI.post(`/bookmark/${Number(postId)}`);
            checkBookmarkPost();
        } catch (error) {
            console.log("error bookmark :", error);
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
            {saved ? (
                <TouchableOpacity onPress={toggleSavedPost} disabled={loading}>
                    <FontAwesome name="bookmark" size={24} color={colors.active} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={toggleSavedPost} disabled={loading}>
                    <Feather name="bookmark" size={24} color={colors.inactive} />
                </TouchableOpacity>
            )}
        </>
    );
};

export default ButtonBookmark;
