/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../utils/color";
import customAPI from "@/src/config/api";
import CustomAlert from "./CustomAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBookmarksStore } from "@/src/stores/bookmarksStore";
import { useAuthStore } from "@/src/stores/authStore";

const ButtonBookmark = ({ postId }: { postId: string }) => {
  // Local Zustand store – instant UI feedback
  const bookmarkedPosts = useBookmarksStore((state) => state.bookmarkedPosts);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);
  const setBookmarked = useBookmarksStore((state) => state.setBookmarked);
  const isBookmarked = bookmarkedPosts.has(postId);

  // Keep UI in sync after a refresh (e.g., when a screen re‑mounts)
  // The Zustand store already holds the correct state, so we just read it.
  // No extra effect needed.


  // Auth store – needed for query key (username)
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  // Helper to refresh the user‑profile query (which contains the bookmarks list)
  const refreshProfile = () => {
    if (user?.username) {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user.username] });
      // Force immediate refetch so UI updates instantly
      queryClient.refetchQueries({ queryKey: ["userProfile", user.username] });
    }
  };

  // Mutations that talk to the backend - backend uses TOGGLE endpoint
  const toggleBookmarkMutation = useMutation({
    mutationFn: async () => {
      // Toggle bookmark di server
      await customAPI.post(`/bookmark/${postId}`);
      // Backend tidak mengembalikan boolean bookmarked, jadi cek status eksplisit
      const check = await customAPI.get(`/bookmark/${postId}`);
      return check.data.data; // boolean
    },
    onSuccess: (bookmarked) => {
      // Sinkronkan store dengan status sebenarnya di server
      if (typeof bookmarked === "boolean") {
        setBookmarked(postId, bookmarked);
      }
      refreshProfile();
    },
    onError: (error: any) => {
      console.error('[Bookmark] Toggle bookmark failed:', error.response?.data || error.message);
      // Rollback local state on error
      toggleBookmark(postId);
      // Show error alert
      setAlert({
        visible: true,
        title: "Error",
        message: error.response?.data?.message || "Gagal bookmark/unbookmark",
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
    // Pastikan user ter‑autentikasi (username tersedia)
    if (!user?.username) {
      return;
    }

    // Update UI secara lokal terlebih dulu
    toggleBookmark(postId);

    // Sinkronkan dengan server (toggle endpoint handles both bookmark & unbookmark)
    toggleBookmarkMutation.mutate();
  };

  return (
    <>
      {isBookmarked ? (
        <TouchableOpacity onPress={handlePress} testID="bookmark-button">
          <FontAwesome name="bookmark" size={24} color={colors.active} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handlePress} testID="bookmark-button">
          <Feather name="bookmark" size={24} color={colors.inactive} />
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

export default ButtonBookmark;
