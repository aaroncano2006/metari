import axios from "axios"

export const axiosConnection = axios.create({
  baseURL: "/api",
})

axiosConnection.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosConnection.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.dispatchEvent(new CustomEvent("authChange"))
    }
    return Promise.reject(error)
  }
)
