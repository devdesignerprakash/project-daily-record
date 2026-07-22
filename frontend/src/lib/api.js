import axios from "axios";
import { API_URL } from "@/lib/config";

/**
 * Central axios instance.
 * - baseURL  : points to the Express backend
 * - withCredentials: sends the JWT cookie on every request
 * - Interceptor: unwraps response.data automatically so every
 *   service function receives the parsed payload, not the full AxiosResponse
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Response interceptor – return data directly; re-throw with a
// meaningful message so callers can handle errors consistently.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown error occurred";
    return Promise.reject(new Error(message));
  }
);

export const apiGet = (path, config = {}) => api.get(path, config);
export const apiPost = (path, payload, config = {}) => api.post(path, payload, config);
export const apiDelete = (path, config = {}) => api.delete(path, config);

export default api;
