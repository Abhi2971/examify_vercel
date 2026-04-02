import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return extractData(response)
  },
  
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return extractData(response)
  },
  
  verifyOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp })
    return extractData(response)
  },
  
  sendOtp: async (email) => {
    const response = await api.post('/auth/send-otp', { email })
    return extractData(response)
  }
}
