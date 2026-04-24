/**
 * 测量数据API模块
 */
import request from '../request'

/**
 * 标准API响应结构
 */
interface ApiResponse<T> {
    code: number
    msg: string
    message?: string
    data: T
}

/**
 * 测量数据（分组）
 */
interface Measurement {
    id: number
    taskId: number
    groupNo: number
    measureTime: string
    sampleValues: (number | null)[]
    operator: string
    remark: string
    enabled: number
    status: number
}

/**
 * 测量数据列表响应（包含标准响应结构）
 */
interface MeasurementListResponse {
    code: number
    data: Measurement[]
    message?: string
}

/**
 * 创建测量数据请求
 */
interface CreateMeasurementData {
    groupNo?: number
    sampleValues: (number | null)[]
    measureTime?: string
    operator?: string
    remark?: string
    enabled?: number
    status?: 0 | 1
}

/**
 * 获取任务的测量数据
 * @param taskId - 任务ID
 * @param enabled - 是否启用（可选）
 * @returns Promise<MeasurementListResponse>
 */
export async function getMeasurements(taskId: string, enabled?: number): Promise<MeasurementListResponse> {
    return await request.get(`/api/measurement/task/${taskId}`, { params: { enabled } }) as unknown as Promise<MeasurementListResponse>
}

/**
 * 创建测量数据
 * @param taskId - 任务ID
 * @param data - 测量数据
 * @returns Promise<ApiResponse<Measurement>>
 */
export async function createMeasurement(taskId: string, data: CreateMeasurementData): Promise<ApiResponse<Measurement>> {
    return await request.post(`/api/measurement/task/${taskId}`, data) as unknown as Promise<ApiResponse<Measurement>>
}

/**
 * 批量导入测量数据
 * @param taskId - 任务ID
 * @param items - 测量数据数组
 * @returns Promise<ApiResponse<{ inserted: number[], errors: string[] }>>
 */
export async function createMeasurementBatch(taskId: string, items: CreateMeasurementData[]): Promise<ApiResponse<{ inserted: number[], errors: string[] }>> {
    return await request.post(`/api/measurement/task/${taskId}/batch`, items) as unknown as Promise<ApiResponse<{ inserted: number[], errors: string[] }>>
}

/**
 * 更新测量数据
 * @param id - 测量数据ID
 * @param data - 更新数据
 * @returns Promise<ApiResponse<null>>
 */
export async function updateMeasurement(id: string, data: Partial<CreateMeasurementData>): Promise<ApiResponse<null>> {
    return await request.put(`/api/measurement/${id}`, data) as unknown as Promise<ApiResponse<null>>
}

/**
 * 删除测量数据
 * @param id - 测量数据ID
 * @returns Promise<ApiResponse<null>>
 */
export async function deleteMeasurement(id: string): Promise<ApiResponse<null>> {
    return await request.delete(`/api/measurement/${id}`) as unknown as Promise<ApiResponse<null>>
}
