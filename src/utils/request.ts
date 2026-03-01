/**
 * 统一的 HTTP 请求工具
 * 自动处理 token 和错误
 */

const API_BASE_URL = '';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: HeadersInit;
}

// 获取 Token
const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// 触发 401 事件，供 AdminLayout 监听
function triggerUnauthorized(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_authenticated');
    window.dispatchEvent(new CustomEvent('unauthorized'));
}

// 统一请求函数
export async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const token = getToken();

    const config: RequestInit = {
        method: options.method || 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    const data = await response.json();

    // 处理 HTTP 401 或 body 中 code 为 401 的情况
    if (response.status === 401 || data.code === 401) {
        triggerUnauthorized();
        throw new Error('未授权，请重新登录');
    }

    if (!response.ok) {
        throw new Error(data.message || `请求失败: ${response.status}`);
    }

    return data as T;
}

// GET 请求
export async function get<T = any>(url: string, headers?: HeadersInit): Promise<T> {
    return request<T>(url, { method: 'POST', headers });
}

// POST 请求
export async function post<T = any>(url: string, body?: any, headers?: HeadersInit): Promise<T> {
    return request<T>(url, { method: 'POST', body, headers });
}
