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
        
        // Hard timeout - force isLoading=false after 8 seconds no matter what
        const hardTimeout = setTimeout(() => {
            console.warn('[AuthStore] HARD TIMEOUT - forcing isLoading=false');
            set({ isLoading: false });
        }, 8000);
        
        // Timeout wrapper untuk mencegah hang
        const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T | null> => {
            return Promise.race([
                promise,
                new Promise<null>((_, reject) => 
                    setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)
                )
            ]).catch((err) => {
                console.warn(`[AuthStore] ${label} failed:`, err.message);
                return null;
            });
        };

        try {
            const [token, userRaw] = await Promise.all([
                withTimeout(SecureStore.getItemAsync("auth_token"), 3000, 'SecureStore'),
                withTimeout(AsyncStorage.getItem("auth_user"), 3000, 'AsyncStorage')
            ]);

            if (token && userRaw) {
                const parsedUser = JSON.parse(userRaw);
                set({ user: parsedUser, token });
            }
        } catch (error) {
            console.error('[AuthStore] Error loading token:', error);
        } finally {
            clearTimeout(hardTimeout);
            set({ isLoading: false });
        }
    },

    removeToken: async () => {
        await Promise.all([SecureStore.deleteItemAsync("auth_token"), AsyncStorage.removeItem("auth_user")]);
        set({ token: null, user: null });
    },
}));
