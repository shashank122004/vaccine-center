// src/api/axios.js
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // ✅ Replace with your actual backend URL
  withCredentials: false, // ✅ To allow cookies (access & refresh tokens)
});

// Interceptor for attaching tokens from localStorage if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
