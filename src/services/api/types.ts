/**
 * API 类型定义
 * 与后端 DTO 和 ViewModel 对应的 TypeScript 类型
 */

// ==================== 统一响应格式 ====================

/** 返回数据码 */
export const ReturnDataCode = {
    Success: 200,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    BusinessError: 500,
} as const;

export type ReturnDataCodeType = typeof ReturnDataCode[keyof typeof ReturnDataCode];

/** 统一响应模型 */
export interface ReturnDataResponse<T = unknown> {
    success: boolean;
    message?: string;
    data: T;
    code: ReturnDataCodeType;
}

/** 分页响应模型 */
export interface BasePagingViewModel<T> {
    total: number;
    page: number;
    pageSize: number;
    rows: T[];
}

// ==================== 认证相关 ====================

/** 登录请求参数 */
export interface LoginInputDto {
    username: string;
    password: string;
}

/** 用户信息（简化版，用于前端显示） */
export interface VUserInfoModel {
    id: number;
    username: string;
    nickname?: string;
    email?: string;
}

/** 用户信息（完整版，含后端字段） */
export interface VUserInfoFullModel {
    id: number;
    username: string;
    nickname?: string;
    email?: string;
    isActive: boolean;
}

/** 登录响应数据 */
export interface LoginResponseData {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: VUserInfoModel;
}

/** 登录结果 */
export interface VLoginResultModel {
    token: string;
    user: VUserInfoModel;
}

// ==================== 标签相关 ====================

/** 标签信息（简化版，用于视频响应中） */
export interface VTagInfoModel {
    id: number;
    name: string;
    code: string;
}

/** 标签信息（完整版） */
export interface VTagModel {
    id: number;
    name: string;
    code: string;
    description?: string;
    sortOrder: number;
    videoCount: number;
}

/** 创建标签请求参数 */
export interface CreateTagInputDto {
    name: string;
    code: string;
    description?: string;
    sortOrder: number;
}

/** 更新标签请求参数 */
export interface UpdateTagInputDto {
    tagId: number;
    name: string;
    description?: string;
    sortOrder: number;
}

/** 删除标签请求参数 */
export interface DeleteTagInputDto {
    tagId: number;
}

/** 查询标签请求参数 */
export interface QueryTagInputDto {
    tagId?: number;
}

/** 获取标签列表请求参数 */
export interface GetTagListInputDto {
    // 无需参数
}

// ==================== 视频相关 ====================

/** 视频信息（完整版） */
export interface VVideoInfoModel {
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

/** 导入视频请求参数 */
export interface ImportVideoInputDto {
    input: string;
    tagIds?: number[];
}

/** 更新视频请求参数 */
export interface UpdateVideoInputDto {
    videoId: number;
    refreshInfo: boolean;
    tagIds?: number[];
}

/** 查询视频列表请求参数 */
export interface QueryVideoListInputDto {
    keyword?: string;
    tagIds?: number[];
    page: number;
    pageSize: number;
}

/** 删除视频请求参数 */
export interface DeleteVideoInputDto {
    videoId: number;
}

/** 获取视频详情请求参数 */
export interface GetVideoByIdInputDto {
    videoId: number;
}
