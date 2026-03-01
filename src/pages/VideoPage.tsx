/**
 * 精品视频页面
 * 展示B站精品视频，支持分类筛选和搜索功能
 * 数据模型: 对接后端 BilibiliVideoInfo
 */

import { useState, useMemo } from 'react';
import videoRawData from '../data/video_data.json';
import type { VideoData, VideoItem } from '../types';
import { PlayIcon, SearchIcon } from '../components/Icons';

const videoData = videoRawData as unknown as VideoData;

// 格式化时长 (秒 -> mm:ss)
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 格式化数字 (137374 -> 13.7万)
function formatCount(count: number): string {
    if (count >= 10000) {
        return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
}

// 格式化发布时间
function formatPublishTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
}

export function VideoPage() {
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [searchQuery, setSearchQuery] = useState('');

    // 筛选后的视频列表
    const filteredVideos = useMemo(() => {
        return videoData.items.filter(video => {
            const matchCategory = selectedCategory === '全部' || video.category === selectedCategory;
            const matchSearch = searchQuery === '' ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            return matchCategory && matchSearch;
        });
    }, [selectedCategory, searchQuery]);

    // 打开视频链接
    const openVideo = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="about-layout fade-in">
            <div className="about-card video-card">
                <div className="card-header">
                    <h2>精品视频 // FEATURED VIDEOS</h2>
                </div>
                <div className="card-scroll-body">
                    {/* 搜索和筛选区域 */}
                    <div className="video-controls">
                        {/* 搜索框 */}
                        <div className="search-box">
                            <SearchIcon size={18} color="#888" />
                            <input
                                type="text"
                                placeholder="搜索视频标题、UP主..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button
                                    className="search-clear"
                                    onClick={() => setSearchQuery('')}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* 分类筛选 */}
                        <div className="category-filters">
                            {videoData.categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 视频计数 */}
                    <div className="video-count">
                        共 <span className="count-number">{filteredVideos.length}</span> 个视频
                        {selectedCategory !== '全部' && ` · ${selectedCategory}`}
                        {searchQuery && ` · 搜索: "${searchQuery}"`}
                    </div>

                    {/* 视频网格 */}
                    {filteredVideos.length > 0 ? (
                        <div className="video-grid">
                            {filteredVideos.map(video => (
                                <VideoCard
                                    key={video.bvid}
                                    video={video}
                                    onClick={() => openVideo(video.url)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-video-state">
                            <div className="scanner-line"></div>
                            <h2>NO VIDEOS FOUND</h2>
                            <p>未找到符合条件的视频</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// 视频卡片组件
interface VideoCardProps {
    video: VideoItem;
    onClick: () => void;
}

function VideoCard({ video, onClick }: VideoCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="video-item" onClick={onClick}>
            {/* 封面区域 */}
            <div className="video-cover">
                {imageError ? (
                    // 图片加载失败时显示占位
                    <div className="cover-placeholder">
                        <PlayIcon size={40} color="rgba(255,193,7,0.8)" />
                    </div>
                ) : (
                    // 真实封面图片
                    <img
                        src={video.cover}
                        alt={video.title}
                        className="cover-image"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                )}
                {/* 时长标签 */}
                <span className="video-duration">{formatDuration(video.duration)}</span>
                {/* 悬停播放按钮 */}
                <div className="play-overlay">
                    <PlayIcon size={48} color="#ffc107" />
                </div>
            </div>

            {/* 视频信息 */}
            <div className="video-info">
                <div className="video-title-wrapper">
                    <h3 className="video-title">{video.title}</h3>
                    <span className="video-title-tooltip">{video.title}</span>
                </div>
                <div className="video-meta">
                    <span className="video-author">{video.ownerName}</span>
                    <span className="video-time">{formatPublishTime(video.publishTime)}</span>
                </div>
                <div className="video-footer">
                    {/* 分类标签 */}
                    {video.category && (
                        <span className="video-category-tag">{video.category}</span>
                    )}
                    {/* 统计数据 */}
                    <div className="video-stats">
                        <span className="stat-item">
                            <span className="stat-icon">▶</span>
                            {formatCount(video.viewCount)}
                        </span>
                        <span className="stat-item">
                            <span className="stat-icon">♡</span>
                            {formatCount(video.likeCount)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
