/**
 * 登录认证API模块
 */
import request from '../request'

/**
 * 登录凭证
 */
interface LoginCredentials {
    username: string
    password: string
}

/**
 * 登录响应
 */
interface LoginResponse {
    token: string
    user: {
        id: string
        username: string
        companyId: string
        companyName: string
    }
}

/**
 * 登录
 * @param credentials - 登录凭证
 * @returns Promise<LoginResponse>
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    return await request.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password
    }) as unknown as Promise<LoginResponse>
}

/**
 * 公司项
 */
export interface CompanyItem {
    id: number
    name: string
}

/**
 * 公司列表响应
 */
export interface CompanyListResponse {
    list: CompanyItem[]
}

/**
 * 获取公司列表（模拟数据，等待后续开发落实）
 * @returns Promise<CompanyListResponse>
 */
export async function getCompanyList(): Promise<CompanyListResponse> {
    return {
        list: [
            { id: 1, name: '深圳公司1' },
            { id: 2, name: '深圳公司2' }
        ]
    }
}