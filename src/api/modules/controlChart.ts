/**
 * 控制图API模块
 */
import request from '../request'

export interface ControlLimitSet {
    ucl: number
    lcl: number
    cl: number
}

export interface ControlChartLimits {
    xbar: ControlLimitSet | null
    r: ControlLimitSet | null
    s: ControlLimitSet | null
}

export interface ControlChartSeries {
    means: number[]
    ranges: number[]
    stdevs: number[]
    groupNos: number[]
}

export interface ControlChartRules {
    status: string
    message: string
    anomalies: any[]
}

export interface ControlChartResponse {
    task: any
    limits: ControlChartLimits
    series: ControlChartSeries
    rules: ControlChartRules
    overallMean: number
    overallRange: number
    lastCheck: string | null
}

/**
 * 获取任务控制图数据
 * @param taskId - 任务ID
 * @returns Promise<ControlChartResponse>
 */
export async function getControlChart(taskId: string): Promise<ControlChartResponse> {
    return await request.get(`/api/control-chart/task/${taskId}`) as unknown as Promise<ControlChartResponse>
}