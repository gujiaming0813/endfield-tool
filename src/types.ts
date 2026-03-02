// src/types.ts

// 1. 定义单行数据的结构
export interface WeaponData {
    basic: string;
    extra: string;
    skill: string;
    name: string;
    star: string;
    type: string;
    roleList: string[]; // 修改：这里变成了字符串数组
    // 位置数据
    loc_hub: number;
    loc_lab: number;
    loc_mine: number;
    loc_energy: number;
    loc_city: number;
}

// 2. 定义整个 JSON 文件的结构
export interface AppData {
    allRoles: string[]; // 新增：预处理好的角色列表
    items: WeaponData[]; // 武器列表
}

export interface LocationStat {
    key: keyof WeaponData;
    name: string;
    count: number;
}

export type LocationKey = 'loc_hub' | 'loc_lab' | 'loc_mine' | 'loc_energy' | 'loc_city';

// 信用商店
export interface TradeItem {
    id: string;
    name: string;
    price: number;      // 信用点价格
    stamina: number;    // 等效体力值
    note: string;       // 新增：备注信息
}

// 干员档案数据接口
export interface CharacterItem {
    name: string;
    engName: string;
    race: string;
    faction: string;
    remark: string;
    profession: string;
}

export interface CharacterData {
    items: CharacterItem[];
}

// 精品视频数据接口 - 对接后端 BilibiliVideoInfo
export interface VideoItem {
    /** 视频BV号 */
    bvid: string;
    /** 视频标题 */
    title: string;
    /** 视频封面URL */
    cover: string;
    /** 视频描述 */
    description?: string | null;
    /** 视频时长（秒） */
    duration: number;
    /** UP主昵称 */
    ownerName: string;
    /** 视频跳转链接 */
    url: string;
    /** 播放量 */
    viewCount: number;
    /** 点赞数 */
    likeCount: number;
    /** 发布时间 (ISO 8601 格式) */
    publishTime: string;
    /** 视频分类 (前端扩展字段，可选) */
    category?: string;
}

export interface VideoData {
    /** 所有分类 (前端扩展) */
    categories: string[];
    items: VideoItem[];
}

// ============================================
// API 相关类型定义
// ============================================

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string | null;
    data?: T;
    code?: number;
}

/**
 * 视频标签（简化版）
 */
export interface VideoTag {
    id: number;
    name: string;
    code: string;
}

/**
 * 视频标签（完整版，含统计）
 */
export interface VideoTagWithStats {
    id: number;
    name: string;
    code: string;
    description?: string;
    sortOrder: number;
    videoCount: number;
}

/**
 * 视频信息（与后端 API 对应）
 */
export interface VideoInfo {
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
    tags: VideoTag[];
}

/**
 * 视频列表响应
 */
export interface VideoListResponse {
    total: number;
    page: number;
    pageSize: number;
    rows: VideoInfo[];
}

/**
 * 用户信息
 */
export interface UserInfo {
    id: number;
    username: string;
    nickname?: string;
    email?: string;
}