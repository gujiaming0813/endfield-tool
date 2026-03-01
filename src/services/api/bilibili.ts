/**
 * B站视频相关 API 服务
 */

import apiClient from './config';
import type {
    ImportVideoInputDto,
    UpdateVideoInputDto,
    QueryVideoListInputDto,
    DeleteVideoInputDto,
    GetVideoByIdInputDto,
    VVideoInfoModel,
    BasePagingViewModel,
    ReturnDataResponse,
} from './types';

const BILIBILI_BASE_URL = '/api/Bilibili';

/**
 * 导入视频
 */
export async function importVideoApi(data: ImportVideoInputDto): Promise<ReturnDataResponse<VVideoInfoModel>> {
    return apiClient.post(`${BILIBILI_BASE_URL}/ImportVideo`, data);
}

/**
 * 更新视频
 */
export async function updateVideoApi(data: UpdateVideoInputDto): Promise<ReturnDataResponse<VVideoInfoModel>> {
    return apiClient.post(`${BILIBILI_BASE_URL}/UpdateVideo`, data);
}

/**
 * 分页查询视频列表
 */
export async function queryVideoListApi(data: QueryVideoListInputDto): Promise<ReturnDataResponse<BasePagingViewModel<VVideoInfoModel>>> {
    return apiClient.post(`${BILIBILI_BASE_URL}/QueryVideoList`, data);
}

/**
 * 获取视频详情
 */
export async function getVideoByIdApi(data: GetVideoByIdInputDto): Promise<ReturnDataResponse<VVideoInfoModel>> {
    return apiClient.post(`${BILIBILI_BASE_URL}/GetVideoById`, data);
}

/**
 * 删除视频（软删除）
 */
export async function deleteVideoApi(data: DeleteVideoInputDto): Promise<ReturnDataResponse<void>> {
    return apiClient.post(`${BILIBILI_BASE_URL}/DeleteVideo`, data);
}
