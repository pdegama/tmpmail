import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStorage } from "./auth-storage";

export const getApiBaseURL = (): string => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }

  const isProduction = window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  if (isProduction) {
    return process.env.NEXT_PUBLIC_API_URL_PROD || "https://tmpmail.api.parthka.dev";
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

export const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

let tokenUpdateCallback: ((token: string) => void) | null = null;

export const setTokenUpdateCallback = (callback: (token: string) => void) => {
  tokenUpdateCallback = callback;
};

// Request interceptor (acts like middleware)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (data?.token && typeof data.token === "string") {
      const newToken = data.token;
      authStorage.setToken(newToken);
      if (tokenUpdateCallback) {
        tokenUpdateCallback(newToken);
      }
    } else if (data?.user?.token && typeof data.user.token === "string") {
      const newToken = data.user.token;
      authStorage.setToken(newToken);
      if (tokenUpdateCallback) {
        tokenUpdateCallback(newToken);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authStorage.clearToken();
      if (tokenUpdateCallback) {
        tokenUpdateCallback("");
      }
    }

    const errorMessage = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message || "An unknown error occurred";
    console.error("API Error:", errorMessage);
    return Promise.reject(error);
  }
);