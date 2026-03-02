/**
 * 格式化工具函数
 */

/**
 * 格式化时长（秒 -> mm:ss 或 MM:SS）
 * @param seconds 秒数
 * @param padMinutes 是否始终显示两位分钟数
 */
export function formatDuration(seconds: number, padMinutes = false): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (padMinutes) {
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化数字（137374 -> 13.7万）
 * @param count 数字
 */
export function formatCount(count: number): string {
    if (count >= 10000) {
        return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
}

/**
 * 格式化发布时间为相对时间
 * @param isoString ISO 8601 格式的时间字符串
 */
export function formatPublishTime(isoString: string): string {
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

/**
 * 格式化日期为本地格式（YYYY/MM/DD）
 * @param isoString ISO 8601 格式的时间字符串
 */
export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN');
}
