/**
 * 标签相关 API 服务
 */

import apiClient from './config';
import type {
    CreateTagInputDto,
    UpdateTagInputDto,
    DeleteTagInputDto,
    QueryTagInputDto,
    VTagModel,
    ReturnDataResponse,
} from './types';

const TAGS_BASE_URL = '/api/Tags';

/**
 * 获取所有标签
 */
export async function getTagListApi(): Promise<ReturnDataResponse<VTagModel[]>> {
    return apiClient.post(`${TAGS_BASE_URL}/GetTagList`);
}

/**
 * 获取标签详情
 */
export async function getTagByIdApi(data: QueryTagInputDto): Promise<ReturnDataResponse<VTagModel>> {
    return apiClient.post(`${TAGS_BASE_URL}/GetTagById`, data);
}

/**
 * 创建标签
 */
export async function createTagApi(data: CreateTagInputDto): Promise<ReturnDataResponse<VTagModel>> {
    return apiClient.post(`${TAGS_BASE_URL}/CreateTag`, data);
}

/**
 * 更新标签
 */
export async function updateTagApi(data: UpdateTagInputDto): Promise<ReturnDataResponse<VTagModel>> {
    return apiClient.post(`${TAGS_BASE_URL}/UpdateTag`, data);
}

/**
 * 删除标签（软删除）
 */
export async function deleteTagApi(data: DeleteTagInputDto): Promise<ReturnDataResponse<void>> {
    return apiClient.post(`${TAGS_BASE_URL}/DeleteTag`, data);
}
