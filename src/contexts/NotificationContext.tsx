/**
 * 通知上下文
 * 提供 Toast 消息和确认对话框功能
 */

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Toast 类型
type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast 消息
interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

// 确认对话框状态
interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

// 上下文类型
interface NotificationContextType {
    showToast: (message: string, type?: ToastType) => void;
    showConfirm: (title: string, message: string) => Promise<boolean>;
    toasts: ToastMessage[];
    confirmState: ConfirmState | null;
    closeConfirm: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

let toastId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);

        // 3秒后自动移除
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const showConfirm = useCallback((title: string, message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                title,
                message,
                onConfirm: () => {
                    setConfirmState(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmState(null);
                    resolve(false);
                },
            });
        });
    }, []);

    const closeConfirm = useCallback(() => {
        if (confirmState) {
            confirmState.onCancel();
        }
    }, [confirmState]);

    return (
        <NotificationContext.Provider value={{ showToast, showConfirm, toasts, confirmState, closeConfirm }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
