import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const customAPI = axios.create({
    baseURL: baseURL + "/api",
});

// Attach Authorization header from the auth store (source of truth).
// Using the Zustand store avoids the legacy "auth" key mismatch bug
// where the interceptor read a key that was never written.
//
// We read the store at request-time (not at import-time) to avoid
// circular dependencies. `getState()` is a synchronous, side-effect-free
// read of the current store state.
customAPI.interceptors.request.use((config) => {
    // Lazy require to avoid a circular import with the store
    // (the store itself imports customAPI).
    const { useAuthStore } = require("@/src/stores/authStore");
    const { token } = useAuthStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401, clear the session and let the router redirect to /login.
customAPI.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            try {
                const { useAuthStore } = require("@/src/stores/authStore");
                await useAuthStore.getState().removeToken();
            } catch {
                /* ignore */
            }
        }
        return Promise.reject(err);
    }
);

export default customAPI;
