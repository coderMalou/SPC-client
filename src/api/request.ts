import axios from 'axios'
import qs from 'qs'
import storage from '@/utils/storage'

const req = axios.create({
    timeout: 3000,
    headers: {},
    paramsSerializer: {
        serialize(params) {
            console.log('params')
            console.log(params)
            return qs.stringify(params, {allowDots: true})
        }
    }
})

req.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {}

        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'
        }

        if (storage.get('token')) config.headers.token = storage.get('token')
        
        return config
    },

    (error) => {
        return Promise.reject(error)
    }
)

req.interceptors.response.use(
    (response) => {
        return response
    },

    (error) => {
        return Promise.resolve(null)
    }
)

export default req