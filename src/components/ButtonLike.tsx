/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../utils/color";
import customAPI from "@/src/config/api";
import CustomAlert from "./CustomAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLikesStore } from "@/src/stores/likesStore";
import { useAuthStore } from "@/src/stores/authStore";

const ButtonLike = ({ postId }: { postId: string }) => {
  // Local Zustand store – instant UI feedback
  const likedPosts = useLikesStore((state) => state.likedPosts);
  const toggleLike = useLikesStore((state) => state.toggleLike);
  const setLike = useLikesStore((state) => state.setLike);
  const isLiked = likedPosts.has(postId);

  // Auth store – needed to check authentication
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  // Mutation that talks to the backend - backend uses TOGGLE endpoint
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      // Toggle like di server
      await customAPI.post(`/like/${postId}`);
      // Backend tidak mengembalikan boolean liked, jadi cek status eksplisit
      const check = await customAPI.get(`/like/${postId}`);
      return check.data.data; // boolean
    },
    onSuccess: (liked) => {
      // Sync dengan status sebenarnya di server
      if (typeof liked === "boolean") {
        setLike(postId, liked);
      }
      // Refresh detail post agar likeCount ikut ter-update
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: any) => {
      console.error("[Like] Toggle like failed:", error.response?.data || error.message);
      // Rollback local state on error
      toggleLike(postId);
      setAlert({
        visible: true,
        title: "Error",
        message: error.response?.data?.message || "Gagal like/unlike",
        isError: true,
      });
    },
  });

  // Alert state for showing errors
  const [alert, setAlert] = React.useState<{ visible: boolean; title: string; message: string; isError: boolean }>({
    visible: false,
    title: "",
    message: "",
    isError: false,
  });

  const handlePress = () => {
    // Pastikan user ter‑autentikasi
    if (!user) {
      return;
    }

    // Update UI secara lokal terlebih dulu
    toggleLike(postId);

    // Sinkronkan dengan server (toggle endpoint handles both like & unlike)
    toggleLikeMutation.mutate();
  };

  return (
    <>
      {isLiked ? (
        <TouchableOpacity onPress={handlePress} testID="like-button">
          <FontAwesome name="heart" size={24} color={"red"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handlePress} testID="like-button">
          <Feather name="heart" size={24} color={colors.inactive} />
        </TouchableOpacity>
      )}
      <CustomAlert
        isVisible={alert.visible}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
        onConfirm={() => setAlert({ ...alert, visible: false })}
      />
    </>
  );
};

export default ButtonLike;
