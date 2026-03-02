/**
 * 类型守卫和运行时验证工具
 */

import type { AppData, CharacterData } from '../types';

/**
 * 检查值是否为非空对象
 */
function isNonNullObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

/**
 * 检查值是否为数组
 */
function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

/**
 * 检查值是否为字符串
 */
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * 验证 WeaponData 结构
 */
function isWeaponData(value: unknown): boolean {
    if (!isNonNullObject(value)) return false;
    const obj = value as Record<string, unknown>;
    return (
        isString(obj.basic) &&
        isString(obj.extra) &&
        isString(obj.skill) &&
        isString(obj.name) &&
        isString(obj.star) &&
        isString(obj.type) &&
        isArray(obj.roleList) &&
        typeof obj.loc_hub === 'number' &&
        typeof obj.loc_lab === 'number' &&
        typeof obj.loc_mine === 'number' &&
        typeof obj.loc_energy === 'number' &&
        typeof obj.loc_city === 'number'
    );
}

/**
 * 验证 AppData 结构
 */
export function isAppData(value: unknown): value is AppData {
    if (!isNonNullObject(value)) return false;
    const obj = value as Record<string, unknown>;

    // 检查 allRoles
    if (!isArray(obj.allRoles) || !obj.allRoles.every(isString)) {
        return false;
    }

    // 检查 items
    if (!isArray(obj.items) || !obj.items.every(isWeaponData)) {
        return false;
    }

    return true;
}

/**
 * 验证 CharacterItem 结构
 */
function isCharacterItem(value: unknown): boolean {
    if (!isNonNullObject(value)) return false;
    const obj = value as Record<string, unknown>;
    return (
        isString(obj.name) &&
        isString(obj.engName) &&
        isString(obj.race) &&
        isString(obj.faction) &&
        isString(obj.remark) &&
        isString(obj.profession)
    );
}

/**
 * 验证 CharacterData 结构
 */
export function isCharacterData(value: unknown): value is CharacterData {
    if (!isNonNullObject(value)) return false;
    const obj = value as Record<string, unknown>;

    // 检查 items
    if (!isArray(obj.items) || !obj.items.every(isCharacterItem)) {
        return false;
    }

    return true;
}

/**
 * 安全地解析 JSON 数据，带类型验证
 */
export function parseWithValidation<T>(
    data: unknown,
    validator: (value: unknown) => value is T,
    errorMessage: string
): T {
    if (!validator(data)) {
        throw new Error(errorMessage);
    }
    return data;
}
