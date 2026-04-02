import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const studentPublicApi = {
  getDashboardStats: async () => {
    const response = await api.get('/student/dashboard')
    return extractData(response)
  },

  getEbooks: async (params = {}) => {
    const response = await api.get('/student/ebooks', { params })
    return response.data
  },

  getBundles: async (params = {}) => {
    const response = await api.get('/student/bundles/available', { params })
    return response.data
  },

  getPurchasedBundles: async () => {
    const response = await api.get('/student/bundles/purchased')
    return extractData(response)
  },

  getWalletBalance: async () => {
    const response = await api.get('/student/wallet/balance')
    return extractData(response)
  },

  getWalletTransactions: async (params = {}) => {
    const response = await api.get('/student/wallet/transactions', { params })
    return response.data
  },

  addWalletBalance: async (data) => {
    const response = await api.post('/student/wallet/add', data)
    return extractData(response)
  },

  getCertificates: async () => {
    const response = await api.get('/student/certificates')
    return extractData(response)
  },

  getAICoachStats: async () => {
    const response = await api.get('/student/ai-coach/stats')
    return extractData(response)
  },

  askAICoach: async (data) => {
    const response = await api.post('/student/ai-coach/ask', data)
    return extractData(response)
  },

  getRecentActivity: async () => {
    const response = await api.get('/student/activity/recent')
    return extractData(response)
  },

  getLearningProgress: async () => {
    const response = await api.get('/student/progress')
    return extractData(response)
  }
}
