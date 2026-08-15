import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL configuration (from environment variable or fallback)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create Axios instance
const httpService: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
httpService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach token if available (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
httpService.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized (e.g. token expired)
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access forbidden:', error.response.data);
      }

      // Handle 500+ Server Errors
      if (status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network Error / No Response received:', error.request);
    } else {
      console.error('Request configuration error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Generic API helper methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpService.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    httpService.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    httpService.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    httpService.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpService.delete<T>(url, config).then((res) => res.data),
};

export default httpService;
