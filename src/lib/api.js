// src/lib/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://10.250.88.9:8000/api", // 👈 yaha /user mat lagao
  timeout: 5000,
});

API.interceptors.request.use(
  async (config) => {
    // agar token add karna ho future me
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
