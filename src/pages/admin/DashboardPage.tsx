/**
 * 管理后台仪表盘页面
 * 展示统计数据和快捷操作
 */

import videoRawData from '../../data/video_data.json';
import type { VideoData } from '../../types';

const videoData = videoRawData as unknown as VideoData;

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
    // 统计数据
    const totalVideos = videoData.items.length;
    const totalCategories = videoData.categories.length - 1; // 减去"全部"
    const totalViews = videoData.items.reduce((sum, v) => sum + v.viewCount, 0);
    const totalLikes = videoData.items.reduce((sum, v) => sum + v.likeCount, 0);

    // 格式化数字
    const formatNumber = (num: number): string => {
        if (num >= 10000) {
            return `${(num / 10000).toFixed(1)}万`;
        }
        return num.toString();
    };

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
                    value={totalVideos}
                    icon="▶"
                    color="#ffc107"
                />
                <StatCard
                    title="分类数量"
                    value={totalCategories}
                    icon="◆"
                    color="#00bcd4"
                />
                <StatCard
                    title="总播放量"
                    value={formatNumber(totalViews)}
                    icon="◎"
                    color="#4caf50"
                />
                <StatCard
                    title="总点赞数"
                    value={formatNumber(totalLikes)}
                    icon="♡"
                    color="#f44336"
                />
            </div>

            {/* 快捷操作 */}
            <div className="quick-actions">
                <h2>快捷操作 // QUICK ACTIONS</h2>
                <div className="actions-grid">
                    <button className="action-card">
                        <span className="action-icon">+</span>
                        <span className="action-label">添加视频</span>
                    </button>
                    <button className="action-card">
                        <span className="action-icon">◈</span>
                        <span className="action-label">管理标签</span>
                    </button>
                    <button className="action-card">
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
                    {videoData.items.slice(0, 5).map(video => (
                        <div key={video.bvid} className="recent-item">
                            <img
                                src={video.cover}
                                alt={video.title}
                                className="recent-thumb"
                            />
                            <div className="recent-info">
                                <div className="recent-title">{video.title}</div>
                                <div className="recent-meta">
                                    <span>{video.ownerName}</span>
                                    <span>▶ {formatNumber(video.viewCount)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
