import { getToken } from "@/utils/auth";
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { removeAuthCookies } from "./cookies";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

// Custom error class for server-side 401
export class ServerRedirectError extends Error {
  redirectTo: string;

  constructor(redirectTo: string) {
    super("Redirect required");
    this.name = "ServerRedirectError";
    this.redirectTo = redirectTo;
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
});

// Request Interceptor to set Authorization Header from Cookie
instance.interceptors.request.use(
  async (config) => {
    try {
      // Skip if already manually provided
      if (!config.headers?.Authorization) {
        const token = await getToken(); // risky on server if not SSR-safe
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.data?.Response) {
      const updatedResponse: AxiosResponse = {
        ...response,
        data: {
          ...response.data,
          Response: response.data.Response,
        },
      };
      return updatedResponse;
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      removeAuthCookies();

      if (typeof window !== "undefined") {
        setTimeout(() => (window.location.href = "/signin"), 1500);
      } else {
        // ✅ Server-side: signal the redirect with a custom error
        throw new ServerRedirectError("/signin");
      }
    }

    return Promise.reject(error);
  }
);

export const createApiInstance = (): AxiosInstance => {
  const apiInstance: AxiosInstance = axios.create({
    baseURL: baseUrl,
  });

  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response?.data?.Response) {
        const decryptedResponse = response.data.Response;

        return {
          ...response,
          data: {
            ...response.data,
            Response: decryptedResponse,
          },
        };
      }
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default instance;
