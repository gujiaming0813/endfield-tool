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