import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constant";

let refreshPromise: Promise<void> | null = null;

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    const response = error.response;

    if (!response) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (response.status !== 401) {
      return Promise.reject(error);
    }

    const errorData = response.data as any;

    // only handle expired access token
    if (errorData?.code !== "AUTH_404") {
      return Promise.reject(error);
    }

    // prevent infinite loop
    if (originalRequest._retried) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      // SINGLE refresh in-flight
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true },
          )
          .then(async () => {
            // DO nothing
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;

      // retry original request
      return axiosClient(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  },
);
