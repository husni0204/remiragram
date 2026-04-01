import { AuthState } from "@/src/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  setTokenData: async (user, token) => {
    const authData = {
      user: user,
      token: token,
    };
    await AsyncStorage.setItem("auth", JSON.stringify(authData));
  },

  loadToken: async () => {
    set({ isLoading: true });
    try {
      const data = await AsyncStorage.getItem("auth");

      if (data) {
        const parsed = JSON.parse(data);
        set({
          user: parsed.user,
          token: parsed.token,
        });
      }
    } catch (error) {
      console.log("Error loading token:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeToken: async () => {
    await AsyncStorage.removeItem("auth");
    set({ token: null, user: null });
  },
}));
