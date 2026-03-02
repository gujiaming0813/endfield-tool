/**
 * 通知组件
 * 包含 Toast 消息和确认对话框
 */

import { useNotification } from '../contexts/NotificationContext';

// Toast 图标
const ToastIcons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
};

// Toast 颜色
const ToastColors: Record<string, string> = {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
};

/**
 * Toast 消息容器
 */
export function ToastContainer() {
    const { toasts } = useNotification();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="toast-message"
                    style={{ borderLeftColor: ToastColors[toast.type] }}
                >
                    <span className="toast-icon" style={{ color: ToastColors[toast.type] }}>
                        {ToastIcons[toast.type]}
                    </span>
                    <span className="toast-text">{toast.message}</span>
                </div>
            ))}
        </div>
    );
}

/**
 * 确认对话框
 */
export function ConfirmDialog() {
    const { confirmState, closeConfirm } = useNotification();

    if (!confirmState || !confirmState.isOpen) return null;

    return (
        <div className="modal-overlay" onClick={closeConfirm}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-header">
                    <h3>{confirmState.title}</h3>
                </div>
                <div className="confirm-body">
                    <p>{confirmState.message}</p>
                </div>
                <div className="confirm-footer">
                    <button className="btn-secondary" onClick={confirmState.onCancel}>
                        取消
                    </button>
                    <button className="btn-danger" onClick={confirmState.onConfirm}>
                        确认
                    </button>
                </div>
            </div>
        </div>
    );
}
