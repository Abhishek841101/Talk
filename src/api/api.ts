
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
// src/lib/api.ts
import { io, Socket } from "socket.io-client";

export const API_BASE = "http://10.189.33.9:8000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE, {
      transports: ["websocket"],
      reconnection: true,
    });
    socket.on("connect", () => console.log("✅ Socket connected:", socket?.id));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
  }
  return socket;
}

// ------------------ Axios ------------------
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

// ------------------ Upload Reel ------------------
export const uploadReel = async (videoUri: string, username: string) => {
  const formData = new FormData();
  formData.append("video", {
    uri: Platform.OS === "ios" ? videoUri.replace("file://", "") : videoUri,
    type: "video/mp4",
    name: `reel_${Date.now()}.mp4`,
  } as any);
  formData.append("username", username);

  try {
    console.log("[UploadReel] Sending request...");
    const res = await axiosInstance.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("[UploadReel] Success:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("[UploadReel] Error:", err.response?.data || err.message);
    throw err;
  }
};

// ------------------ Fetch Reels ------------------
export const fetchReels = async () => {
  try {
    console.log("[FetchReels] Fetching...");
    const res = await axiosInstance.get("/api/reels");
    console.log("[FetchReels] Success:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("[FetchReels] Error:", err.response?.data || err.message);
    throw err;
  }
};

export default axiosInstance;
