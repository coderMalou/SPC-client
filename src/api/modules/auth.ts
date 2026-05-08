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