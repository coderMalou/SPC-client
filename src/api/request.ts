import axios from 'axios'
import storage from '@/utils/storage'

const req = axios.create({
    timeout: 3000,
    headers: {},
    paramsSerializer: {
        serialize(params) {
            console.log('params')
            console.log(params)
            const searchParams = new URLSearchParams()
            for (const key in params) {
                const value = params[key]
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value))
                }
            }
            return searchParams.toString()
        }
    }
})

req.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {}
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'
        }
        const token = storage.get('token','session')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

req.interceptors.response.use(
    (response) => {
        return response.data
    },

    (error) => {
        return Promise.reject(error)
    }
)

export default req