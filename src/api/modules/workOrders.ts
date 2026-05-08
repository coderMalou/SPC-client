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
    orderNo: string
    status: number
    createdAt: string
    closedAt?: string
}

/**
 * 工单列表响应（包含标准响应结构）
 */
interface WorkOrderListResponse {
    code: number
    data: WorkOrder[]
    message?: string
}

/**
 * 获取工单列表
 * @param params - 查询参数
 * @returns Promise<WorkOrderListResponse>
 */
export async function getWorkOrders(params?: WorkOrderParams): Promise<WorkOrderListResponse> {
    return await request.get('/api/work-orders', { params }) as unknown as Promise<WorkOrderListResponse>
}

/**
 * 启用工单
 * @param id - 工单ID
 * @returns Promise<any>
 */
export async function enableWorkOrder(id: string): Promise<any> {
    return await request.put(`/api/work-orders/${id}/enable`) as unknown as Promise<any>
}

/**
 * 关闭工单
 * @param id - 工单ID
 * @returns Promise<any>
 */
export async function closeWorkOrder(id: string): Promise<any> {
    return await request.put(`/api/work-orders/${id}/close`) as unknown as Promise<any>
}

/**
 * 创建工单
 * @param orderNo - 工单编号
 * @returns Promise<ApiResponse<{ id: number, orderNo: string, status: number, createdAt: string }>>
 */
export async function createWorkOrder(orderNo: string): Promise<{ code: number; data: { id: number; orderNo: string; status: number; createdAt: string }; msg?: string }> {
    return await request.post('/api/work-orders', { orderNo }) as unknown as Promise<{ code: number; data: { id: number; orderNo: string; status: number; createdAt: string }; msg?: string }>
}