/**
 * 任务API模块
 */
import request from '../request'

/**
 * 任务查询参数
 */
interface TaskParams {
    workOrderId?: string
    status?: number
    page?: number
    pageSize?: number
}

/**
 * 任务数据
 */
interface Task {
    id: string
    orderNo: string
    workOrderId: string
    taskNo: string
    lineNo: number
    productCode: string
    productName: string
    spec: string
    unit: string
    processRouteName: string
    processName: string
    processSequence: string
    qualityChar: string
    targetValue: number
    usl: number
    lsl: number
    subgroupSize: number
    totalSampleSize: number
    equipmentCode: string | null
    instrumentCode: string | null
    status: number
    enabledAt: string | null
    createdAt: string
}

/**
 * 标准API响应
 */
interface ApiResponse<T> {
    code: number
    msg: string
    message?: string
    data: T
}

/**
 * 任务列表响应（包含标准响应结构）
 */
interface TaskListResponse {
    code: number
    data: Task[]
    message?: string
}

/**
 * 任务详情响应
 */
interface TaskDetailResponse {
    code: number
    msg: string
    message?: string
    data: Task & {
        measurements: any[]
        controlChart: any
        capability: any
    }
}

/**
 * 创建任务请求数据
 */
interface CreateTaskData {
    workOrderId: number
    taskNo?: string
    lineNo?: number
    productCode?: string
    productName?: string
    spec?: string
    unit?: string
    processRouteName?: string
    processName?: string
    processSequence?: string
    qualityChar?: string
    targetValue?: number
    usl?: number
    lsl?: number
    subgroupSize?: number
    totalSampleSize?: number
    equipmentCode?: string
    instrumentCode?: string
}

/**
 * 获取任务列表
 * @param params - 查询参数
 * @returns Promise<TaskListResponse>
 */
export async function getTasks(params?: TaskParams): Promise<TaskListResponse> {
    return await request.get('/api/tasks', { params }) as unknown as Promise<TaskListResponse>
}

/**
 * 获取任务详情
 * @param id - 任务ID
 * @returns Promise<TaskDetailResponse>
 */
export async function getTaskDetail(id: string): Promise<TaskDetailResponse> {
    return await request.get(`/api/tasks/${id}`) as unknown as Promise<TaskDetailResponse>
}

/**
 * 创建任务
 * @param data - 任务数据
 * @returns Promise<ApiResponse<Task>>
 */
export async function createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    return await request.post('/api/tasks', data) as unknown as Promise<ApiResponse<Task>>
}

/**
 * 更新任务
 * @param id - 任务ID
 * @param data - 更新数据
 * @returns Promise<ApiResponse<null>>
 */
export async function updateTask(id: string, data: Partial<Task>): Promise<ApiResponse<null>> {
    return await request.put(`/api/tasks/${id}`, data) as unknown as Promise<ApiResponse<null>>
}

/**
 * 更新任务状态
 * @param id - 任务ID
 * @param status - 状态值 0|1
 * @returns Promise<ApiResponse<null>>
 */
export async function updateTaskStatus(id: string, status: 0 | 1): Promise<ApiResponse<null>> {
    return await request.put(`/api/tasks/${id}/status`, { status }) as unknown as Promise<ApiResponse<null>>
}

/**
 * 删除任务
 * @param id - 任务ID
 * @returns Promise<ApiResponse<null>>
 */
export async function deleteTask(id: string): Promise<ApiResponse<null>> {
    return await request.delete(`/api/tasks/${id}`) as unknown as Promise<ApiResponse<null>>
}

/**
 * 恢复任务
 * @param id - 任务ID
 * @returns Promise<ApiResponse<null>>
 */
export async function restoreTask(id: string): Promise<ApiResponse<null>> {
    return await request.put(`/api/tasks/${id}/restore`) as unknown as Promise<ApiResponse<null>>
}
