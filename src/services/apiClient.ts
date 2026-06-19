// api/apiClient.ts

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Add token if needed
  const token = localStorage.getItem("token");
  console.log("Request config:", config);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const get = async (url: string, params?: Record<string, unknown>) => {
  const response = await api.get(url, { params });
  return response.data;
};

export const post = async (url: string, data?: unknown) => {
  const response = await api.post(url, data);
  return response.data;
};

export const put = async (url: string, data?: unknown) => {
  const response = await api.put(url, data);
  return response.data;
};

export const del = async (url: string) => {
  const response = await api.delete(url);
  return response.data;
};
