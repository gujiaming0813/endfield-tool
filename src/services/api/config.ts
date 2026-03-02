/**
 * API 请求配置
 * 基于 axios 创建统一的请求实例
 */

import axios, { type AxiosRequestConfig } from 'axios';

// API 基础地址
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://joyousoda.top';

// 创建 axios 实例
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 添加 Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 统一处理错误，返回 response.data
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // 处理 401 未授权
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('admin_authenticated');

            // 触发自定义事件，让 AdminLayout 处理跳转
            // 这样可以避免在 API 层直接跳转，给 UI 层更多控制
            window.dispatchEvent(new CustomEvent('unauthorized'));

            // 返回一个被拒绝的 Promise，但使用更友好的错误信息
            return Promise.reject(new Error('登录已过期，请重新登录'));
        }

        // 其他错误，返回后端的错误信息或默认消息
        const errorMessage = error.response?.data?.message || error.message || '请求失败';
        return Promise.reject(new Error(errorMessage));
    }
);

/**
 * 类型安全的 API 客户端
 * 由于响应拦截器返回 response.data，泛型 T 直接是响应体类型
 */
const apiClient = {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return axiosInstance.get(url, config) as Promise<T>;
    },
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return axiosInstance.post(url, data, config) as Promise<T>;
    },
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return axiosInstance.put(url, data, config) as Promise<T>;
    },
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return axiosInstance.delete(url, config) as Promise<T>;
    },
};

export default apiClient;
