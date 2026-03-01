/**
 * 调试工具
 */

const API_BASE_URL = 'http://localhost:5186';

/**
 * 测试登录接口
 */
export async function testLogin(username: string, password: string): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const text = await response.text();
        console.log('=== 登录接口响应 ===');
        console.log('状态码:', response.status);
        console.log('响应头:', JSON.stringify(Object.fromEntries(response.headers.entries())));
        console.log('响应内容:', text);

        return JSON.parse(text);
    } catch (error) {
        console.error('登录请求失败:', error);
        return null;
    }
}

/**
 * 测试获取当前用户接口
 */
export async function testGetCurrentUser(): Promise<any> {
    const token = localStorage.getItem('auth_token');
    console.log('当前 Token:', token);

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/Auth/GetCurrentUser`, {
            method: 'POST',
            headers,
        });

        const text = await response.text();
        console.log('=== 获取当前用户接口响应 ===');
        console.log('状态码:', response.status);
        console.log('响应头:', JSON.stringify(Object.fromEntries(response.headers.entries())));
        console.log('响应内容:', text);

        return JSON.parse(text);
    } catch (error) {
        console.error('获取用户请求失败:', error);
        return null;
    }
}

/**
 * 测试获取标签列表接口
 */
export async function testGetTagList(): Promise<any> {
    const token = localStorage.getItem('auth_token');
    console.log('当前 Token:', token);

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/Tags/GetTagList`, {
            method: 'POST',
            headers,
        });

        const text = await response.text();
        console.log('=== 获取标签列表接口响应 ===');
        console.log('状态码:', response.status);
        console.log('响应头:', JSON.stringify(Object.fromEntries(response.headers.entries())));
        console.log('响应内容:', text);

        return JSON.parse(text);
    } catch (error) {
        console.error('获取标签列表请求失败:', error);
        return null;
    }
}

/**
 * 测试创建标签接口
 */
export async function testCreateTag(name: string, code: string): Promise<any> {
    const token = localStorage.getItem('auth_token');
    console.log('当前 Token:', token);

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/Tags/CreateTag`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: name,
                code: code,
                description: '',
                sortOrder: 0,
            }),
        });

        const text = await response.text();
        console.log('=== 创建标签接口响应 ===');
        console.log('状态码:', response.status);
        console.log('响应头:', JSON.stringify(Object.fromEntries(response.headers.entries())));
        console.log('响应内容:', text);

        return JSON.parse(text);
    } catch (error) {
        console.error('创建标签请求失败:', error);
        return null;
    }
}

/**
 * 清除本地认证信息
 */
export function clearAuth() {
    console.log('=== 清除本地认证信息 ===');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_authenticated');
    console.log('已清除');
}
