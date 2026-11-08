import { AuthState } from "@/src/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,

    setTokenData: async (user, token) => {
        // Token → SecureStore (aman)
        await SecureStore.setItemAsync("auth_token", token);
        // User → AsyncStorage (bukan rahasia, ukuran bisa lebih besar)
        await AsyncStorage.setItem("auth_user", JSON.stringify(user));

        set({ user, token });
    },

    loadToken: async () => {
        set({ isLoading: true });
        try {
            const [token, userRaw] = await Promise.all([SecureStore.getItemAsync("auth_token"), AsyncStorage.getItem("auth_user")]);

            if (token && userRaw) {
                set({ user: JSON.parse(userRaw), token });
            }
        } catch (error) {
            console.log("Error loading token:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    removeToken: async () => {
        await Promise.all([SecureStore.deleteItemAsync("auth_token"), AsyncStorage.removeItem("auth_user")]);
        set({ token: null, user: null });
    },
}));
