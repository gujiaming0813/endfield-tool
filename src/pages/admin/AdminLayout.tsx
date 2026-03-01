/**
 * 管理后台布局
 */

import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin', label: '仪表盘', icon: '◈' },
        { path: '/admin/videos', label: '视频管理', icon: '▶' },
        { path: '/admin/tags', label: '标签管理', icon: '◆' },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="admin-layout">
            {/* 侧边栏 */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-logo">ENDFIELD</div>
                    <div className="admin-logo-sub">ADMIN PANEL</div>
                </div>

                <nav className="admin-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.path}
                            className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        退出登录
                    </button>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
