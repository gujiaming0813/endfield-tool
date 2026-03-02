/**
 * 路由保护组件
 * 检查用户是否已登录，未登录则重定向到登录页
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // 正在加载认证状态时显示加载中
    if (loading) {
        return (
            <div className="admin-loading-screen">
                <div className="loading-spinner"></div>
                <p>验证登录状态...</p>
            </div>
        );
    }

    // 未登录则重定向到登录页
    if (!isAuthenticated) {
        // 保存当前路径，登录后可以重定向回来
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
