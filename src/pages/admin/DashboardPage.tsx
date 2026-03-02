/**
 * 管理后台仪表盘页面
 * 展示统计数据和快捷操作
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api/config';
import { formatCount } from '../../utils/format';
import type { VideoInfo, VideoTagWithStats, VideoListResponse, ApiResponse } from '../../types';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    color?: string;
}

function StatCard({ title, value, icon, color = '#ffc107' }: StatCardProps) {
    return (
        <div className="stat-card">
            <div className="stat-card-inner">
                <div className="stat-card-icon" style={{ color }}>
                    {icon}
                </div>
                <div className="stat-card-content">
                    <div className="stat-card-value">{value}</div>
                    <div className="stat-card-title">{title}</div>
                </div>
            </div>
        </div>
    );
}

export function DashboardPage() {
    const navigate = useNavigate();
    const [videos, setVideos] = useState<VideoInfo[]>([]);
    const [tags, setTags] = useState<VideoTagWithStats[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // 并行加载视频和标签数据
            const [videosResult, tagsResult] = await Promise.all([
                apiClient.post<ApiResponse<VideoListResponse>>(
                    '/api/Bilibili/QueryVideoList',
                    { page: 1, pageSize: 50 }
                ),
                apiClient.post<ApiResponse<VideoTagWithStats[]>>('/api/Tags/GetTagList'),
            ]);

            if (videosResult.success && videosResult.data) {
                setVideos(videosResult.data.rows);
            }
            if (tagsResult.success && tagsResult.data) {
                setTags(tagsResult.data);
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('加载数据失败:', error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // 统计数据
    const totalVideos = videos.length;
    const totalTags = tags.length;
    const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
    const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);

    return (
        <div className="admin-dashboard">
            <div className="page-header">
                <h1>仪表盘 // DASHBOARD</h1>
                <p>系统概览与数据统计</p>
            </div>

            {/* 统计卡片 */}
            <div className="stats-grid">
                <StatCard
                    title="视频总数"
                    value={loading ? '...' : totalVideos}
                    icon="▶"
                    color="#ffc107"
                />
                <StatCard
                    title="标签数量"
                    value={loading ? '...' : totalTags}
                    icon="◆"
                    color="#00bcd4"
                />
                <StatCard
                    title="总播放量"
                    value={loading ? '...' : formatCount(totalViews)}
                    icon="◎"
                    color="#4caf50"
                />
                <StatCard
                    title="总点赞数"
                    value={loading ? '...' : formatCount(totalLikes)}
                    icon="♡"
                    color="#f44336"
                />
            </div>

            {/* 快捷操作 */}
            <div className="quick-actions">
                <h2>快捷操作 // QUICK ACTIONS</h2>
                <div className="actions-grid">
                    <button className="action-card" onClick={() => navigate('/admin/videos')}>
                        <span className="action-icon">+</span>
                        <span className="action-label">添加视频</span>
                    </button>
                    <button className="action-card" onClick={() => navigate('/admin/tags')}>
                        <span className="action-icon">◈</span>
                        <span className="action-label">管理标签</span>
                    </button>
                    <button className="action-card" onClick={() => navigate('/admin/videos')}>
                        <span className="action-icon">⬡</span>
                        <span className="action-label">数据导出</span>
                    </button>
                    <button className="action-card">
                        <span className="action-icon">⚙</span>
                        <span className="action-label">系统设置</span>
                    </button>
                </div>
            </div>

            {/* 最近视频 */}
            <div className="recent-section">
                <h2>最近视频 // RECENT VIDEOS</h2>
                <div className="recent-list">
                    {loading ? (
                        <div className="empty-state">加载中...</div>
                    ) : videos.length === 0 ? (
                        <div className="empty-state">暂无视频</div>
                    ) : (
                        videos.slice(0, 5).map(video => (
                            <div key={video.id} className="recent-item">
                                <img
                                    src={video.cover}
                                    alt={video.title}
                                    className="recent-thumb"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="recent-info">
                                    <div className="recent-title">{video.title}</div>
                                    <div className="recent-meta">
                                        <span>{video.ownerName}</span>
                                        <span>▶ {formatCount(video.viewCount)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
