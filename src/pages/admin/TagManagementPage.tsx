/**
 * 标签管理页面
 * 管理视频分类标签
 */

import { useState } from 'react';
import videoRawData from '../../data/video_data.json';
import type { VideoData } from '../../types';

const videoData = videoRawData as unknown as VideoData;

interface Tag {
    name: string;
    count: number;
    color: string;
}

// 预设颜色
const PRESET_COLORS = [
    '#ffc107', '#00bcd4', '#4caf50', '#f44336',
    '#9c27b0', '#ff9800', '#2196f3', '#e91e63'
];

export function TagManagementPage() {
    // 从视频数据中统计标签使用次数
    const [tags, setTags] = useState<Tag[]>(() => {
        const tagCount: Record<string, number> = {};
        videoData.items.forEach(video => {
            if (video.category) {
                tagCount[video.category] = (tagCount[video.category] || 0) + 1;
            }
        });

        return Object.entries(tagCount).map(([name, count], index) => ({
            name,
            count,
            color: PRESET_COLORS[index % PRESET_COLORS.length]
        }));
    });

    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
    const [editingTag, setEditingTag] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');

    // 添加标签
    const handleAddTag = () => {
        if (!newTagName.trim()) return;
        if (tags.some(t => t.name === newTagName.trim())) {
            alert('标签已存在');
            return;
        }

        setTags([...tags, {
            name: newTagName.trim(),
            count: 0,
            color: newTagColor
        }]);
        setNewTagName('');
        setNewTagColor(PRESET_COLORS[0]);
    };

    // 删除标签
    const handleDeleteTag = (name: string) => {
        if (confirm(`确定删除标签 "${name}" 吗？`)) {
            setTags(tags.filter(t => t.name !== name));
        }
    };

    // 开始编辑
    const startEdit = (tag: Tag) => {
        setEditingTag(tag.name);
        setEditName(tag.name);
        setEditColor(tag.color);
    };

    // 保存编辑
    const saveEdit = (oldName: string) => {
        if (!editName.trim()) return;

        setTags(tags.map(t => {
            if (t.name === oldName) {
                return { ...t, name: editName.trim(), color: editColor };
            }
            return t;
        }));
        setEditingTag(null);
    };

    // 取消编辑
    const cancelEdit = () => {
        setEditingTag(null);
    };

    return (
        <div className="admin-tag-management">
            <div className="page-header">
                <h1>标签管理 // TAG MANAGEMENT</h1>
                <p>管理视频分类标签</p>
            </div>

            {/* 添加新标签 */}
            <div className="add-tag-section">
                <h2>添加新标签</h2>
                <div className="add-tag-form">
                    <input
                        type="text"
                        placeholder="输入标签名称..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="tag-input"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <div className="color-picker">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                className={`color-option ${newTagColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setNewTagColor(color)}
                            />
                        ))}
                    </div>
                    <button className="btn-primary" onClick={handleAddTag}>
                        添加标签
                    </button>
                </div>
            </div>

            {/* 标签列表 */}
            <div className="tags-section">
                <h2>现有标签 ({tags.length})</h2>
                <div className="tags-grid">
                    {tags.map(tag => (
                        <div key={tag.name} className="tag-card">
                            {editingTag === tag.name ? (
                                // 编辑模式
                                <div className="tag-edit-form">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="tag-input small"
                                    />
                                    <div className="color-picker small">
                                        {PRESET_COLORS.map(color => (
                                            <button
                                                key={color}
                                                className={`color-option ${editColor === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setEditColor(color)}
                                            />
                                        ))}
                                    </div>
                                    <div className="edit-actions">
                                        <button
                                            className="btn-small btn-save"
                                            onClick={() => saveEdit(tag.name)}
                                        >
                                            保存
                                        </button>
                                        <button
                                            className="btn-small btn-cancel"
                                            onClick={cancelEdit}
                                        >
                                            取消
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // 显示模式
                                <>
                                    <div className="tag-header">
                                        <span
                                            className="tag-color-indicator"
                                            style={{ backgroundColor: tag.color }}
                                        />
                                        <span className="tag-name">{tag.name}</span>
                                    </div>
                                    <div className="tag-stats">
                                        <span className="tag-count">{tag.count} 个视频</span>
                                    </div>
                                    <div className="tag-actions">
                                        <button
                                            className="action-btn edit"
                                            onClick={() => startEdit(tag)}
                                            title="编辑"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDeleteTag(tag.name)}
                                            title="删除"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {tags.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">◈</div>
                        <p>暂无标签，请添加新标签</p>
                    </div>
                )}
            </div>
        </div>
    );
}
