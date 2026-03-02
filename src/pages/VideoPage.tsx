/**
 * 精品视频页面
 * 展示B站精品视频，支持分类筛选和搜索功能
 * 数据来源: 后端 API
 */

import { useState, useEffect, useCallback } from 'react';
import { PlayIcon, SearchIcon } from '../components/Icons';
import apiClient from '../services/api/config';
import { formatDuration, formatCount, formatPublishTime } from '../utils/format';
import type { VideoInfo, VideoTag, VideoListResponse, ApiResponse } from '../types';

export function VideoPage() {
    const [selectedTag, setSelectedTag] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [videos, setVideos] = useState<VideoInfo[]>([]);
    const [tags, setTags] = useState<VideoTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // 加载标签列表
    const loadTags = useCallback(async () => {
        try {
            const result = await apiClient.post<ApiResponse<VideoTag[]>>('/api/Tags/GetTagList');
            if (result.success && result.data) {
                setTags(result.data);
            }
        } catch (error) {
            console.error('加载标签失败:', error);
        }
    }, []);

    // 加载视频列表
    const loadVideos = useCallback(async () => {
        setLoading(true);
        try {
            const result = await apiClient.post<ApiResponse<VideoListResponse>>(
                '/api/Bilibili/QueryVideoList',
                {
                    keyword: searchQuery || undefined,
                    tagIds: selectedTag ? [selectedTag] : undefined,
                    page: 1,
                    pageSize: 100,
                }
            );
            if (result.success && result.data) {
                setVideos(result.data.rows);
                setTotalCount(result.data.total);
            }
        } catch (error) {
            console.error('加载视频失败:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedTag]);

    // 初始化加载
    useEffect(() => {
        loadTags();
    }, [loadTags]);

    // 搜索或筛选变化时加载视频
    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    // 获取选中的标签名称
    const getSelectedTagName = () => {
        if (!selectedTag) return null;
        const tag = tags.find(t => t.id === selectedTag);
        return tag?.name || null;
    };

    // 打开视频链接（添加安全参数）
    const openVideo = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
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
                            <SearchIcon size={18} color="currentColor" className="search-icon" />
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

                        {/* 标签筛选 */}
                        <div className="category-filters">
                            <button
                                className={`category-btn ${selectedTag === null ? 'active' : ''}`}
                                onClick={() => setSelectedTag(null)}
                            >
                                全部
                            </button>
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    className={`category-btn ${selectedTag === tag.id ? 'active' : ''}`}
                                    onClick={() => setSelectedTag(tag.id)}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 视频计数 */}
                    <div className="video-count">
                        共 <span className="count-number">{totalCount}</span> 个视频
                        {getSelectedTagName() && ` · ${getSelectedTagName()}`}
                        {searchQuery && ` · 搜索: "${searchQuery}"`}
                    </div>

                    {/* 视频网格 */}
                    {loading ? (
                        <div className="no-video-state">
                            <div className="scanner-line"></div>
                            <h2>LOADING...</h2>
                            <p>加载中...</p>
                        </div>
                    ) : videos.length > 0 ? (
                        <div className="video-grid">
                            {videos.map(video => (
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
    video: VideoInfo;
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
                        referrerPolicy="no-referrer"
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
                    {/* 标签 */}
                    {video.tags && video.tags.length > 0 && (
                        <span className="video-category-tag">{video.tags[0].name}</span>
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
