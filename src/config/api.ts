import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const customAPI = axios.create({
  baseURL: baseURL + "/api",
});

customAPI.interceptors.request.use(async (config) => {
  const auth = await AsyncStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default customAPI;
