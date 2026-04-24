/**
 * 过程能力API模块
 */
import request from '../request'

export interface CapabilityResponse {
    cp: number
    cpk: number
    pp: number
    ppk: number
    ppm: number
    sigmaLevel: number
    mean: number
    sigma: number
    totalN: number
    outOfSpec: number
}

/**
 * 获取任务的过程能力数据
 * @param taskId - 任务ID
 * @returns Promise<{code: number, msg: string, data: CapabilityResponse}>
 */
export async function getCapability(taskId: string): Promise<{code: number, msg: string, data: CapabilityResponse}> {
    return await request.get(`/api/capability/task/${taskId}`) as unknown as Promise<{code: number, msg: string, data: CapabilityResponse}>
}