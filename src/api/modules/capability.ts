/**
 * 过程能力API模块
 */
import request from '../request'

/**
 * 过程能力指数
 */
interface CapabilityIndices {
    cp?: number
    cpk?: number
    pp?: number
    ppk?: number
    ca?: number
}

/**
 * 过程能力响应
 */
interface CapabilityResponse {
    taskId: string
    indices: CapabilityIndices
    usl?: number
    lsl?: number
    target?: number
    mean?: number
    std?: number
}

/**
 * 获取任务的过程能力数据
 * @param taskId - 任务ID
 * @returns Promise<CapabilityResponse>
 */
export async function getCapability(taskId: string): Promise<CapabilityResponse> {
    return await request.get(`/api/capability/task/${taskId}`) as unknown as Promise<CapabilityResponse>
}