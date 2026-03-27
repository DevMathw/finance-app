import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fz_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fz_token')
      localStorage.removeItem('fz_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default axiosClient