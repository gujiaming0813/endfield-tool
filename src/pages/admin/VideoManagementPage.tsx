/**
 * 视频管理页面
 * 管理已添加的视频内容
 */

import { useState, useEffect, useCallback } from 'react';
import { ViewIcon, DeleteIcon, SearchIcon, EditIcon } from '../../components/Icons';
import { post } from '../../utils/request';

interface VTagInfoModel {
    id: number;
    name: string;
    code: string;
}

interface VTagModel {
    id: number;
    name: string;
    code: string;
    description?: string;
    sortOrder: number;
    videoCount: number;
}

interface VVideoInfoModel {
    id: number;
    bvid: string;
    title: string;
    cover: string;
    description?: string;
    duration: number;
    ownerName: string;
    url: string;
    viewCount: number;
    likeCount: number;
    publishTime: string;
    tags: VTagInfoModel[];
}

interface VideoListResponse {
    total: number;
    page: number;
    pageSize: number;
    rows: VVideoInfoModel[];
}

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

// 格式化时长（秒 -> MM:SS）
function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function VideoManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [selectedVideos, setSelectedVideos] = useState<Set<number>>(new Set());
    const [videos, setVideos] = useState<VVideoInfoModel[]>([]);
    const [tags, setTags] = useState<VTagModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVideoInput, setNewVideoInput] = useState('');
    const [newVideoTagIds, setNewVideoTagIds] = useState<number[]>([]);

    // 编辑视频状态
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState<VVideoInfoModel | null>(null);
    const [editTagIds, setEditTagIds] = useState<number[]>([]);
    const [editRefreshInfo, setEditRefreshInfo] = useState(false);

    // 加载标签列表
    const loadTags = useCallback(async () => {
        try {
            const result = await post<{ success: boolean; data?: VTagModel[] }>('/api/Tags/GetTagList');
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
            const result = await post<{ success: boolean; data?: VideoListResponse }>(
                '/api/Bilibili/QueryVideoList',
                {
                    keyword: searchQuery || undefined,
                    tagIds: selectedTagId ? [selectedTagId] : undefined,
                    page: currentPage,
                    pageSize,
                }
            );
            if (result.success && result.data) {
                setVideos(result.data.rows);
                setTotalCount(result.data.total);
            }
        } catch (error) {
            console.error('加载视频列表失败:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedTagId, currentPage, pageSize]);

    // 初始化时加载标签
    useEffect(() => {
        loadTags();
    }, [loadTags]);

    // 当依赖变化时加载视频
    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    // 搜索处理
    const handleSearch = () => {
        setCurrentPage(1);
        loadVideos();
    };

    // 导入视频
    const handleImportVideo = async () => {
        if (!newVideoInput.trim()) return;
        try {
            const result = await post<{ success: boolean; message?: string }>(
                '/api/Bilibili/ImportVideo',
                {
                    input: newVideoInput,
                    tagIds: newVideoTagIds.length > 0 ? newVideoTagIds : undefined,
                }
            );
            if (result.success) {
                setShowAddModal(false);
                setNewVideoInput('');
                setNewVideoTagIds([]);
                loadVideos();
            } else {
                alert(result.message || '导入失败');
            }
        } catch (error) {
            console.error('导入视频失败:', error);
            alert('导入失败，请稍后重试');
        }
    };

    // 删除视频
    const handleDeleteVideo = async (videoId: number) => {
        if (!confirm('确定删除此视频吗？')) return;
        try {
            const result = await post<{ success: boolean; message?: string }>('/api/Bilibili/DeleteVideo', { videoId });
            if (result.success) {
                loadVideos();
            } else {
                alert(result.message || '删除失败');
            }
        } catch (error) {
            console.error('删除视频失败:', error);
            alert('删除失败，请稍后重试');
        }
    };

    // 打开编辑弹窗
    const openEditModal = (video: VVideoInfoModel) => {
        setEditingVideo(video);
        setEditTagIds(video.tags.map(t => t.id));
        setEditRefreshInfo(false);
        setShowEditModal(true);
    };

    // 更新视频
    const handleUpdateVideo = async () => {
        if (!editingVideo) return;
        try {
            const result = await post<{ success: boolean; message?: string }>(
                '/api/Bilibili/UpdateVideo',
                {
                    videoId: editingVideo.id,
                    refreshInfo: editRefreshInfo,
                    tagIds: editTagIds.length > 0 ? editTagIds : undefined,
                }
            );
            if (result.success) {
                setShowEditModal(false);
                setEditingVideo(null);
                loadVideos();
            } else {
                alert(result.message || '更新失败');
            }
        } catch (error) {
            console.error('更新视频失败:', error);
            alert('更新失败，请稍后重试');
        }
    };

    // 批量删除
    const handleBatchDelete = async () => {
        if (selectedVideos.size === 0) return;
        if (!confirm(`确定删除选中的 ${selectedVideos.size} 个视频吗？`)) return;
        try {
            for (const videoId of selectedVideos) {
                await post('/api/Bilibili/DeleteVideo', { videoId });
            }
            setSelectedVideos(new Set());
            loadVideos();
        } catch (error) {
            console.error('批量删除失败:', error);
            alert('批量删除失败，请稍后重试');
        }
    };

    // 全选/取消全选
    const handleSelectAll = () => {
        if (selectedVideos.size === videos.length) {
            setSelectedVideos(new Set());
        } else {
            setSelectedVideos(new Set(videos.map(v => v.id)));
        }
    };

    // 切换单个选中
    const toggleSelect = (videoId: number) => {
        const newSet = new Set(selectedVideos);
        if (newSet.has(videoId)) {
            newSet.delete(videoId);
        } else {
            newSet.add(videoId);
        }
        setSelectedVideos(newSet);
    };

    // 获取标签名称
    const getTagName = useCallback((tagId: number) => {
        const tag = tags.find(t => t.id === tagId);
        return tag?.name || '';
    }, [tags]);

    const totalPages = Math.ceil(totalCount / pageSize);

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
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="admin-search-input"
                        />
                        {searchQuery && (
                            <button
                                className="search-clear"
                                onClick={() => { setSearchQuery(''); handleSearch(); }}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* 标签筛选 */}
                    <select
                        className="category-select"
                        value={selectedTagId ?? 'all'}
                        onChange={(e) => setSelectedTagId(e.target.value === 'all' ? null : Number(e.target.value))}
                    >
                        <option value="all">全部标签</option>
                        {tags.map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name} ({tag.videoCount})</option>
                        ))}
                    </select>
                </div>

                <div className="toolbar-right">
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <span className="btn-icon">+</span>
                        添加视频
                    </button>
                    {selectedVideos.size > 0 && (
                        <button className="btn-danger" onClick={handleBatchDelete}>
                            <span className="btn-icon">×</span>
                            删除选中 ({selectedVideos.size})
                        </button>
                    )}
                </div>
            </div>

            {/* 统计信息 */}
            <div className="list-info">
                共 <span className="highlight">{totalCount}</span> 个视频
                {selectedTagId && ` · ${getTagName(selectedTagId)}`}
                {searchQuery && ` · 搜索: "${searchQuery}"`}
            </div>

            {/* 视频列表 */}
            <div className="video-table-container">
                {loading ? (
                    <div className="empty-state">加载中...</div>
                ) : (
                    <table className="video-table">
                        <thead>
                            <tr>
                                <th className="col-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedVideos.size === videos.length && videos.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="col-cover">封面</th>
                                <th className="col-title">标题</th>
                                <th className="col-author">UP主</th>
                                <th className="col-tags">标签</th>
                                <th className="col-stats">播放/点赞</th>
                                <th className="col-date">发布时间</th>
                                <th className="col-actions">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map(video => (
                                <tr key={video.id} className={selectedVideos.has(video.id) ? 'selected' : ''}>
                                    <td className="col-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedVideos.has(video.id)}
                                            onChange={() => toggleSelect(video.id)}
                                        />
                                    </td>
                                    <td className="col-cover">
                                        <img
                                            src={video.cover}
                                            alt={video.title}
                                            className="table-thumb"
                                            referrerPolicy="no-referrer"
                                        />
                                    </td>
                                    <td className="col-title">
                                        <div className="title-cell">
                                            <span className="title-text">{video.title}</span>
                                            <span className="bvid-text">{video.bvid}</span>
                                        </div>
                                    </td>
                                    <td className="col-author">{video.ownerName}</td>
                                    <td className="col-tags">
                                        {video.tags.map(tag => (
                                            <span key={tag.id} className="category-badge">{tag.name}</span>
                                        ))}
                                    </td>
                                    <td className="col-stats">
                                        <div className="stats-cell">
                                            <span>▶ {formatCount(video.viewCount)}</span>
                                            <span>♡ {formatCount(video.likeCount)}</span>
                                            <span>⏱ {formatDuration(video.duration)}</span>
                                        </div>
                                    </td>
                                    <td className="col-date">{formatDate(video.publishTime)}</td>
                                    <td className="col-actions">
                                        <div className="action-buttons">
                                            <a
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="action-btn view"
                                                title="查看"
                                            >
                                                <ViewIcon size={14} color="currentColor" />
                                            </a>
                                            <button
                                                className="action-btn edit"
                                                title="编辑"
                                                onClick={() => openEditModal(video)}
                                            >
                                                <EditIcon size={14} color="currentColor" />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                title="删除"
                                                onClick={() => handleDeleteVideo(video.id)}
                                            >
                                                <DeleteIcon size={14} color="currentColor" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && videos.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">◎</div>
                        <p>暂无符合条件的视频</p>
                    </div>
                )}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        上一页
                    </button>
                    <span className="pagination-info">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        下一页
                    </button>
                </div>
            )}

            {/* 添加视频弹窗 */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>添加视频</h2>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">BV号或视频链接</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newVideoInput}
                                    onChange={(e) => setNewVideoInput(e.target.value)}
                                    placeholder="BV1xx411c7mD 或 https://www.bilibili.com/video/..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">选择标签</label>
                                <div className="tag-checkbox-group">
                                    {tags.map(tag => (
                                        <label key={tag.id} className="tag-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={newVideoTagIds.includes(tag.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewVideoTagIds([...newVideoTagIds, tag.id]);
                                                    } else {
                                                        setNewVideoTagIds(newVideoTagIds.filter(id => id !== tag.id));
                                                    }
                                                }}
                                            />
                                            <span>{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowAddModal(false)}>取消</button>
                            <button className="btn-primary" onClick={handleImportVideo}>添加</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 编辑视频弹窗 */}
            {showEditModal && editingVideo && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>编辑视频</h2>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">视频标题</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editingVideo.title}
                                    disabled
                                    style={{ opacity: 0.7 }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">BV号</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editingVideo.bvid}
                                    disabled
                                    style={{ opacity: 0.7 }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">选择标签</label>
                                <div className="tag-checkbox-group">
                                    {tags.map(tag => (
                                        <label key={tag.id} className="tag-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={editTagIds.includes(tag.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setEditTagIds([...editTagIds, tag.id]);
                                                    } else {
                                                        setEditTagIds(editTagIds.filter(id => id !== tag.id));
                                                    }
                                                }}
                                            />
                                            <span>{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="tag-checkbox" style={{ cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editRefreshInfo}
                                        onChange={(e) => setEditRefreshInfo(e.target.checked)}
                                    />
                                    <span>同时刷新视频信息（从B站重新获取标题、播放量等）</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowEditModal(false)}>取消</button>
                            <button className="btn-primary" onClick={handleUpdateVideo}>保存</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
