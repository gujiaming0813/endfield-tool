/**
 * 管理后台布局
 */

import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { logout, login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 登录弹窗状态
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // 监听 401 事件
    const handleUnauthorized = useCallback(() => {
        setShowLoginModal(true);
        setLoginError('登录已过期，请重新登录');
    }, []);

    useEffect(() => {
        window.addEventListener('unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, [handleUnauthorized]);

    // 登录成功后关闭弹窗
    useEffect(() => {
        if (isAuthenticated && showLoginModal) {
            setShowLoginModal(false);
            setLoginUsername('');
            setLoginPassword('');
            setLoginError('');
        }
    }, [isAuthenticated, showLoginModal]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        const result = await login(loginUsername, loginPassword);
        setLoginLoading(false);

        if (!result.success) {
            setLoginError(result.message || '登录失败');
        }
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

            {/* 登录弹窗 */}
            {showLoginModal && (
                <div className="modal-overlay" onClick={() => {}}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>重新登录</h2>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="modal-body">
                                {loginError && <div className="login-error">{loginError}</div>}
                                <div className="form-group">
                                    <label className="form-label">用户名</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={loginUsername}
                                        onChange={(e) => setLoginUsername(e.target.value)}
                                        placeholder="请输入用户名"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">密码</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="请输入密码"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowLoginModal(false);
                                        navigate('/admin/login');
                                    }}
                                >
                                    返回登录页
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loginLoading}
                                >
                                    {loginLoading ? '登录中...' : '登录'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
