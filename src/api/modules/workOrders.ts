/**
 * 工单API模块
 */
import request from '../request'

/**
 * 工单查询参数
 */
interface WorkOrderParams {
    companyId?: string
    status?: string
    page?: number
    pageSize?: number
}

/**
 * 工单数据
 */
interface WorkOrder {
    id: string
    companyId: string
    companyName: string
    status: string
    createdAt: string
    updatedAt: string
}

/**
 * 工单列表响应（包含标准响应结构）
 */
interface WorkOrderListResponse {
    code: number
    data: {
        list: WorkOrder[]
        total: number
    }
    message?: string
}

/**
 * 获取工单列表
 * @param params - 查询参数
 * @returns Promise<WorkOrderListResponse>
 */
export async function getWorkOrders(params?: WorkOrderParams): Promise<WorkOrderListResponse> {
    return await request.get('/api/workOrders', { params }) as unknown as Promise<WorkOrderListResponse>
}

/**
 * 启用工单
 * @param id - 工单ID
 * @returns Promise<any>
 */
export async function enableWorkOrder(id: string): Promise<any> {
    return await request.put(`/api/workOrders/${id}/enable`) as unknown as Promise<any>
}

/**
 * 关闭工单
 * @param id - 工单ID
 * @returns Promise<any>
 */
export async function closeWorkOrder(id: string): Promise<any> {
    return await request.put(`/workOrders/${id}/close`) as unknown as Promise<any>
}