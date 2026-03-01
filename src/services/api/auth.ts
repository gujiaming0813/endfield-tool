/**
 * 认证相关 API 服务
 */

import apiClient from './config';
import type {
    LoginInputDto,
    VLoginResultModel,
    VUserInfoModel,
    ReturnDataResponse,
} from './types';

const AUTH_BASE_URL = '/api/Auth';

/**
 * 用户登录
 */
export async function loginApi(data: LoginInputDto): Promise<ReturnDataResponse<VLoginResultModel>> {
    return apiClient.post(`${AUTH_BASE_URL}/Login`, data);
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUserApi(): Promise<ReturnDataResponse<VUserInfoModel>> {
    return apiClient.post(`${AUTH_BASE_URL}/GetCurrentUser`);
}

/**
 * 注销登录
 */
export async function logoutApi(): Promise<ReturnDataResponse<void>> {
    return apiClient.post(`${AUTH_BASE_URL}/Logout`);
}
