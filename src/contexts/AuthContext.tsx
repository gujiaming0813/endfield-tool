/**
 * 认证上下文
 * 管理管理端登录状态
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../services/api/config';
import type { VUserInfoModel, LoginResponseData } from '../services/api/types';
import type { ApiResponse } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    currentUser: VUserInfoModel | null;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<VUserInfoModel | null>(null);
    const [loading, setLoading] = useState(true);

    // 初始化时检查 localStorage 中的登录状态
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const authStatus = localStorage.getItem('admin_authenticated');

        if (token && authStatus === 'true') {
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await apiClient.post<ApiResponse<LoginResponseData>>('/api/Auth/Login', { username, password });

            if (result.success && result.data) {
                const { accessToken, user } = result.data;

                // 存储到 localStorage
                localStorage.setItem('auth_token', accessToken);
                localStorage.setItem('admin_authenticated', 'true');
                setIsAuthenticated(true);
                setCurrentUser(user);

                return { success: true };
            }

            return { success: false, message: result?.message || '登录失败' };
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('登录请求异常:', error);
            }
            return { success: false, message: '网络错误，请稍后重试' };
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/api/Auth/Logout');
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('注销请求异常:', error);
            }
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('admin_authenticated');
            setIsAuthenticated(false);
            setCurrentUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
