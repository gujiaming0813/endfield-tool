/**
 * 管理后台应用入口
 * 包含管理后台的路由配置
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { VideoManagementPage } from './VideoManagementPage';
import { TagManagementPage } from './TagManagementPage';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { ToastContainer, ConfirmDialog } from '../../components/Notification';

export function AdminApp() {
    return (
        <NotificationProvider>
            <Routes>
                {/* 登录页面 */}
                <Route path="login" element={<LoginPage />} />

                {/* 受保护的管理后台页面 */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Routes>
                                    <Route index element={<DashboardPage />} />
                                    <Route path="videos" element={<VideoManagementPage />} />
                                    <Route path="tags" element={<TagManagementPage />} />
                                    <Route path="*" element={<Navigate to="/admin" replace />} />
                                </Routes>
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>

            {/* 通知组件 */}
            <ToastContainer />
            <ConfirmDialog />
        </NotificationProvider>
    );
}
