/**
 * 任务API模块
 */
import request from '../request'

/**
 * 任务查询参数
 */
interface TaskParams {
    workOrderId?: string
    companyId?: string
    status?: string
    page?: number
    pageSize?: number
}

/**
 * 任务数据
 */
interface Task {
    id: string
    workOrderId: string
    companyId: string
    productName: string
    processName: string
    spec: string
    status: string
    createdAt: string
    updatedAt: string
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
interface TaskDetailResponse extends Task {
    measurements: any[]
    controlChart: any
    capability: any
}

/**
 * 创建任务请求数据
 */
interface CreateTaskData {
    workOrderId: string
    productName: string
    processName: string
    spec: string
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
 * @returns Promise<Task>
 */
export async function createTask(data: CreateTaskData): Promise<Task> {
    return await request.post('/api/tasks', data) as unknown as Promise<Task>
}