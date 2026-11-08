import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const customAPI = axios.create({
    baseURL: baseURL + "/api",
    timeout: 10000, // 10 detik timeout
    headers: {
        'Content-Type': 'application/json',
    },
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
}, (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
});

// Response interceptor with better error handling
customAPI.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalRequest = err.config;
        
        // Log error details
        console.error(`[API] Error ${err.response?.status} ${err.config?.url}:`, 
            err.response?.data || err.message);
        
        // Handle 401 - token expired
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { useAuthStore } = require("@/src/stores/authStore");
                await useAuthStore.getState().removeToken();
            } catch (e) {
                console.error('[API] Failed to clear auth:', e);
            }
        }
        
        // Handle network errors
        if (!err.response) {
            console.error('[API] Network error - backend mungkin tidak jalan:', err.message);
            // Custom error with more info
            const networkError = new Error(
                'Tidak dapat terhubung ke server. Pastikan backend berjalan di ' + baseURL
            );
            networkError.name = 'NetworkError';
            return Promise.reject(networkError);
        }
        
        return Promise.reject(err);
    }
);

export default customAPI;
