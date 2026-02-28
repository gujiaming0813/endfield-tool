/**
 * 项目常量定义
 */

import type { LocationKey } from '../types';

// 地区映射
export const LOCATION_MAP: Record<LocationKey, string> = {
    loc_hub: '枢纽区',
    loc_lab: '源石研究园',
    loc_mine: '矿脉园区',
    loc_energy: '供能高地',
    loc_city: '武陵城'
};

// 星级权重（用于排序）
export const STAR_WEIGHT: Record<string, number> = {
    '六': 6, '6': 6,
    '五': 5, '5': 5,
    '四': 4, '4': 4
};

// 星级转换函数
export const getStarMode = (rawStar: string): string => {
    const s = String(rawStar).trim();
    if (s === '六' || s === '6') return '六';
    if (s === '五' || s === '5') return '五';
    return '四';
};
