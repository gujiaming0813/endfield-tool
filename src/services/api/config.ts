/**
 * API 请求配置
 * 基于 axios 创建统一的请求实例
 */

import axios from 'axios';

// API 基础地址
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5186';

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 添加 Token
apiClient.interceptors.request.use(
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

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // 处理 401 未授权
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('admin_authenticated');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default apiClient;
