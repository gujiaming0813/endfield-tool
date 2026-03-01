/**
 * 管理端登录页面
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);
        setLoading(false);

        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message || '登录失败');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">ENDFIELD</div>
                    <div className="login-subtitle">ADMIN TERMINAL</div>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-title">管理员登录</div>

                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">用户名</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">密码</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? '登录中...' : '登录'}
                    </button>
                </form>

                <div className="login-footer">
                    <span className="tech-decoration">/// ENDFIELD INDUSTRIES ///</span>
                </div>
            </div>
        </div>
    );
}
