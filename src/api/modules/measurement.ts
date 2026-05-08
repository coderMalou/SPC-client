/**
 * 测量数据API模块
 */
import request from '../request'

/**
 * 单个测量数据
 */
interface Measurement {
    id: string
    taskId: string
    value: number
    subgroup: number
    sequence: number
    timestamp: string
    operator: string
    isAbnormal: boolean
}

/**
 * 测量数据列表响应
 */
interface MeasurementListResponse {
    list: Measurement[]
    total: number
}

/**
 * 测量数据请求
 */
interface CreateMeasurementData {
    value: number
    subgroup: number
    sequence: number
    operator: string
}

/**
 * 获取任务的测量数据
 * @param taskId - 任务ID
 * @returns Promise<MeasurementListResponse>
 */
export async function getMeasurements(taskId: string): Promise<MeasurementListResponse> {
    return await request.get(`/measurement/task/${taskId}`) as unknown as Promise<MeasurementListResponse>
}

/**
 * 创建测量数据
 * @param taskId - 任务ID
 * @param data - 测量数据
 * @returns Promise<Measurement>
 */
export async function createMeasurement(taskId: string, data: CreateMeasurementData): Promise<Measurement> {
    return await request.post(`/measurement/task/${taskId}`, data) as unknown as Promise<Measurement>
}