/**
 * 认证上下文
 * 管理管理端登录状态
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { post } from '../utils/request';

interface VUserInfoModel {
    id: number;
    username: string;
    nickname?: string;
    email?: string;
}

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

        console.log('=== 认证初始化 ===');
        console.log('localStorage 中的 token:', token);
        console.log('localStorage 中的 admin_authenticated:', authStatus);

        if (token && authStatus === 'true') {
            setIsAuthenticated(true);
        // 不自动获取用户信息，避免触发 401
        // 用户信息会在需要时从 API 获取
        console.log('检测到有效登录状态，无需重新获取用户信息');
        } else {
            console.log('未检测到有效登录状态');
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
        console.log('=== 开始登录流程 ===');
        console.log('用户名:', username);
        console.log('密码:', password);

        try {
            console.log('发送登录请求到后端...');

            const result = await post<{
                success: boolean;
                message: string | null;
                data: {
                    accessToken: string;
                    tokenType: string;
                    expiresIn: number;
                    user: VUserInfoModel;
                };
                code: number;
            }>(
                '/api/Auth/Login',
                { username, password }
            );

            console.log('登录请求响应状态:', result?.success);
            console.log('响应码:', result?.code);
            console.log('响应消息:', result?.message);
            console.log('响应数据:', result?.data);

            if (result.success && result.data) {
                const { accessToken, tokenType, expiresIn, user } = result.data;

                console.log('解析 Token 成功:', accessToken.substring(0, 20) + '...');
                console.log('Token 类型:', tokenType);
                console.log('Token 过期时间（秒）:', expiresIn);

                console.log('解析用户信息成功:', user);

                // 存储到 localStorage
                localStorage.setItem('auth_token', accessToken);
                localStorage.setItem('admin_authenticated', 'true');
                setIsAuthenticated(true);
                setCurrentUser(user);

                console.log('登录成功，Token 已存储');

                return { success: true };
            }

            console.log('登录请求失败，返回:', result);
            return { success: false, message: result?.message || '登录失败' };
        } catch (error) {
            console.error('登录请求异常:', error);
            return { success: false, message: '网络错误，请稍后重试' };
        }
    };

    const logout = async () => {
        console.log('=== 开始注销流程 ===');

        try {
            console.log('发送注销请求到后端...');
            await post('/api/Auth/Logout');
            console.log('注销请求发送成功');
        } catch (error) {
            console.error('注销请求异常:', error);
        } finally {
            console.log('清除本地认证信息...');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('admin_authenticated');
            setIsAuthenticated(false);
            setCurrentUser(null);
            console.log('认证信息已清除');
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
