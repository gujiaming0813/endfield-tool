/**
 * 视频管理页面
 * 管理已添加的视频内容
 */

import { useState, useMemo } from 'react';
import videoRawData from '../../data/video_data.json';
import type { VideoData } from '../../types';
import { EditIcon, ViewIcon, DeleteIcon, SearchIcon } from '../../components/Icons';

const videoData = videoRawData as unknown as VideoData;

// 格式化数字
function formatCount(count: number): string {
    if (count >= 10000) {
        return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
}

// 格式化日期
function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN');
}

export function VideoManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

    // 筛选视频
    const filteredVideos = useMemo(() => {
        return videoData.items.filter(video => {
            const matchCategory = selectedCategory === '全部' || video.category === selectedCategory;
            const matchSearch = searchQuery === '' ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.bvid.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [searchQuery, selectedCategory]);

    // 全选/取消全选
    const handleSelectAll = () => {
        if (selectedVideos.size === filteredVideos.length) {
            setSelectedVideos(new Set());
        } else {
            setSelectedVideos(new Set(filteredVideos.map(v => v.bvid)));
        }
    };

    // 切换单个选中
    const toggleSelect = (bvid: string) => {
        const newSet = new Set(selectedVideos);
        if (newSet.has(bvid)) {
            newSet.delete(bvid);
        } else {
            newSet.add(bvid);
        }
        setSelectedVideos(newSet);
    };

    return (
        <div className="admin-video-management">
            <div className="page-header">
                <h1>视频管理 // VIDEO MANAGEMENT</h1>
                <p>管理和编辑已添加的视频内容</p>
            </div>

            {/* 工具栏 */}
            <div className="toolbar">
                <div className="toolbar-left">
                    {/* 搜索框 */}
                    <div className="admin-search-box">
                        <SearchIcon size={16} color="var(--text-secondary)" className="search-icon-svg" />
                        <input
                            type="text"
                            placeholder="搜索视频标题、UP主、BV号..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="admin-search-input"
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
                    <select
                        className="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {videoData.categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="toolbar-right">
                    <button className="btn-primary">
                        <span className="btn-icon">+</span>
                        添加视频
                    </button>
                    {selectedVideos.size > 0 && (
                        <button className="btn-danger">
                            <span className="btn-icon">×</span>
                            删除选中 ({selectedVideos.size})
                        </button>
                    )}
                </div>
            </div>

            {/* 统计信息 */}
            <div className="list-info">
                共 <span className="highlight">{filteredVideos.length}</span> 个视频
                {selectedCategory !== '全部' && ` · ${selectedCategory}`}
                {searchQuery && ` · 搜索: "${searchQuery}"`}
            </div>

            {/* 视频列表 */}
            <div className="video-table-container">
                <table className="video-table">
                    <thead>
                        <tr>
                            <th className="col-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedVideos.size === filteredVideos.length && filteredVideos.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="col-cover">封面</th>
                            <th className="col-title">标题</th>
                            <th className="col-author">UP主</th>
                            <th className="col-category">分类</th>
                            <th className="col-stats">播放/点赞</th>
                            <th className="col-date">发布时间</th>
                            <th className="col-actions">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVideos.map(video => (
                            <tr key={video.bvid} className={selectedVideos.has(video.bvid) ? 'selected' : ''}>
                                <td className="col-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedVideos.has(video.bvid)}
                                        onChange={() => toggleSelect(video.bvid)}
                                    />
                                </td>
                                <td className="col-cover">
                                    <img
                                        src={video.cover}
                                        alt={video.title}
                                        className="table-thumb"
                                    />
                                </td>
                                <td className="col-title">
                                    <div className="title-cell">
                                        <span className="title-text">{video.title}</span>
                                        <span className="bvid-text">{video.bvid}</span>
                                    </div>
                                </td>
                                <td className="col-author">{video.ownerName}</td>
                                <td className="col-category">
                                    {video.category && (
                                        <span className="category-badge">{video.category}</span>
                                    )}
                                </td>
                                <td className="col-stats">
                                    <div className="stats-cell">
                                        <span>▶ {formatCount(video.viewCount)}</span>
                                        <span>♡ {formatCount(video.likeCount)}</span>
                                    </div>
                                </td>
                                <td className="col-date">{formatDate(video.publishTime)}</td>
                                <td className="col-actions">
                                    <div className="action-buttons">
                                        <button className="action-btn edit" title="编辑">
                                            <EditIcon size={14} color="currentColor" />
                                        </button>
                                        <button className="action-btn view" title="查看">
                                            <ViewIcon size={14} color="currentColor" />
                                        </button>
                                        <button className="action-btn delete" title="删除">
                                            <DeleteIcon size={14} color="currentColor" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredVideos.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">◎</div>
                        <p>暂无符合条件的视频</p>
                    </div>
                )}
            </div>
        </div>
    );
}
