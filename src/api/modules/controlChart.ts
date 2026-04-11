/**
 * 控制图API模块
 */
import request from '../request'

/**
 * 控制图数据点
 */
interface ControlChartPoint {
    subgroup: number
    value: number
    ucl: number
    lcl: number
    cl: number
    isAbnormal: boolean
    ruleViolations?: string[]
}

/**
 * 控制图响应
 */
interface ControlChartResponse {
    taskId: string
    chartType: string
    points: ControlChartPoint[]
    ucl: number
    lcl: number
    cl: number
}

/**
 * 获取任务控制图数据
 * @param taskId - 任务ID
 * @returns Promise<ControlChartResponse>
 */
export async function getControlChart(taskId: string): Promise<ControlChartResponse> {
    return await request.get(`/api/controlChart/task/${taskId}`) as unknown as Promise<ControlChartResponse>
}