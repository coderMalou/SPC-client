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
 * 工单树节点
 */
export interface WorkOrderTreeNode {
    id: string
    orderNo: string
    children?: TaskTreeNode[]
}

/**
 * 任务树节点
 */
export interface TaskTreeNode {
    id: string
    taskNo: string
    processName: string
    qualityChar: string
}

/**
 * 获取任务控制图数据
 * @param taskId - 任务ID
 * @returns Promise<{code: number, msg: string, data: ControlChartResponse}>
 */
export async function getControlChart(taskId: string): Promise<{code: number, msg: string, data: ControlChartResponse}> {
    return await request.get(`/api/control-chart/task/${taskId}`) as unknown as Promise<{code: number, msg: string, data: ControlChartResponse}>
}

/**
 * 获取工单树（包含任务列表）
 * @returns Promise<{code: number, data: WorkOrderTreeNode[]}>
 */
export async function getWorkOrderTree(): Promise<{code: number, data: WorkOrderTreeNode[]}> {
    return await request.get('/api/work-orders/tree') as unknown as Promise<{code: number, data: WorkOrderTreeNode[]}>
}