/**
 * 标签管理页面
 * 管理视频分类标签
 */

import { useState, useEffect } from 'react';
import { post } from '../../utils/request';

interface VTagModel {
    id: number;
    name: string;
    code: string;
    description?: string;
    sortOrder: number;
    videoCount: number;
}

// 预设颜色
const PRESET_COLORS = [
    '#ffc107', '#00bcd4', '#4caf50', '#f44336',
    '#9c27b0', '#ff9800', '#2196f3', '#e91e63'
];

export function TagManagementPage() {
    const [tags, setTags] = useState<VTagModel[]>([]);
    const [loading, setLoading] = useState(false);

    const [newTagName, setNewTagName] = useState('');
    const [newTagCode, setNewTagCode] = useState('');
    const [newTagDescription, setNewTagDescription] = useState('');
    const [newTagSortOrder, setNewTagSortOrder] = useState(0);

    const [editingTag, setEditingTag] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editCode, setEditCode] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editSortOrder, setEditSortOrder] = useState(0);

    // 加载标签列表
    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        setLoading(true);
        try {
            const result = await post<{ success: boolean; data?: VTagModel[] }>('/api/Tags/GetTagList');
            if (result.success && result.data) {
                setTags(result.data);
            }
        } catch (error) {
            console.error('加载标签失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 添加标签
    const handleAddTag = async () => {
        if (!newTagName.trim() || !newTagCode.trim()) {
            alert('请填写标签名称和编码');
            return;
        }
        try {
            const result = await post<{ success: boolean; message?: string }>(
                '/api/Tags/CreateTag',
                {
                    name: newTagName.trim(),
                    code: newTagCode.trim(),
                    description: newTagDescription.trim() || undefined,
                    sortOrder: newTagSortOrder,
                }
            );
            if (result.success) {
                setNewTagName('');
                setNewTagCode('');
                setNewTagDescription('');
                setNewTagSortOrder(0);
                loadTags();
            } else {
                alert(result.message || '创建标签失败');
            }
        } catch (error) {
            console.error('创建标签失败:', error);
            alert('创建标签失败，请稍后重试');
        }
    };

    // 删除标签
    const handleDeleteTag = async (tagId: number, tagName: string) => {
        if (!confirm(`确定删除标签 "${tagName}" 吗？`)) return;
        try {
            const result = await post<{ success: boolean; message?: string }>('/api/Tags/DeleteTag', { tagId });
            if (result.success) {
                loadTags();
            } else {
                alert(result.message || '删除标签失败');
            }
        } catch (error) {
            console.error('删除标签失败:', error);
            alert('删除标签失败，请稍后重试');
        }
    };

    // 开始编辑
    const startEdit = (tag: VTagModel) => {
        setEditingTag(tag.id);
        setEditName(tag.name);
        setEditCode(tag.code);
        setEditDescription(tag.description || '');
        setEditSortOrder(tag.sortOrder);
    };

    // 保存编辑
    const saveEdit = async (tagId: number) => {
        if (!editName.trim() || !editCode.trim()) {
            alert('请填写标签名称和编码');
            return;
        }
        try {
            const result = await post<{ success: boolean; message?: string }>(
                '/api/Tags/UpdateTag',
                {
                    tagId: tagId,
                    name: editName.trim(),
                    description: editDescription.trim() || undefined,
                    sortOrder: editSortOrder,
                }
            );
            if (result.success) {
                setEditingTag(null);
                loadTags();
            } else {
                alert(result.message || '更新标签失败');
            }
        } catch (error) {
            console.error('更新标签失败:', error);
            alert('更新标签失败，请稍后重试');
        }
    };

    // 取消编辑
    const cancelEdit = () => {
        setEditingTag(null);
    };

    // 根据排序获取颜色（保持一致性）
    const getTagColor = (index: number) => PRESET_COLORS[index % PRESET_COLORS.length];

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
                        placeholder="标签名称..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="tag-input"
                    />
                    <input
                        type="text"
                        placeholder="标签编码（英文）..."
                        value={newTagCode}
                        onChange={(e) => setNewTagCode(e.target.value)}
                        className="tag-input"
                    />
                    <input
                        type="number"
                        placeholder="排序权重（数字）..."
                        value={newTagSortOrder}
                        onChange={(e) => setNewTagSortOrder(Number(e.target.value))}
                        className="tag-input"
                    />
                    <input
                        type="text"
                        placeholder="描述（可选）..."
                        value={newTagDescription}
                        onChange={(e) => setNewTagDescription(e.target.value)}
                        className="tag-input"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <button className="btn-primary" onClick={handleAddTag}>
                        添加标签
                    </button>
                </div>
            </div>

            {/* 标签列表 */}
            <div className="tags-section">
                <h2>现有标签 ({tags.length})</h2>
                <div className="tags-grid">
                    {tags.map((tag, index) => (
                        <div key={tag.id} className="tag-card">
                            {editingTag === tag.id ? (
                                // 编辑模式
                                <div className="tag-edit-form">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="tag-input small"
                                        placeholder="标签名称"
                                    />
                                    <input
                                        type="text"
                                        value={editCode}
                                        onChange={(e) => setEditCode(e.target.value)}
                                        className="tag-input small"
                                        placeholder="标签编码"
                                    />
                                    <input
                                        type="number"
                                        value={editSortOrder}
                                        onChange={(e) => setEditSortOrder(Number(e.target.value))}
                                        className="tag-input small"
                                        placeholder="排序权重"
                                    />
                                    <input
                                        type="text"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="tag-input small"
                                        placeholder="描述"
                                    />
                                    <div className="edit-actions">
                                        <button
                                            className="btn-small btn-save"
                                            onClick={() => saveEdit(tag.id)}
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
                                            style={{ backgroundColor: getTagColor(index) }}
                                        />
                                        <span className="tag-name">{tag.name}</span>
                                        <span className="tag-code">{tag.code}</span>
                                    </div>
                                    <div className="tag-stats">
                                        <span className="tag-count">{tag.videoCount} 个视频</span>
                                        <span className="tag-sort">排序: {tag.sortOrder}</span>
                                    </div>
                                    {tag.description && (
                                        <div className="tag-description">{tag.description}</div>
                                    )}
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
                                            onClick={() => handleDeleteTag(tag.id, tag.name)}
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

                {loading && tags.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">◈</div>
                        <p>加载中...</p>
                    </div>
                )}

                {!loading && tags.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">◈</div>
                        <p>暂无标签，请添加新标签</p>
                    </div>
                )}
            </div>
        </div>
    );
}
