import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const platformAdminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/platform/dashboard/stats')
    return extractData(response)
  },

  getExams: async (params = {}) => {
    const response = await api.get('/platform/exams', { params })
    return response.data
  },

  getExamDetail: async (examId) => {
    const response = await api.get(`/platform/exams/${examId}`)
    return extractData(response)
  },

  createExam: async (data) => {
    const response = await api.post('/platform/exams', data)
    return extractData(response)
  },

  updateExam: async (examId, data) => {
    const response = await api.put(`/platform/exams/${examId}`, data)
    return extractData(response)
  },

  getEbooks: async (params = {}) => {
    const response = await api.get('/platform/ebooks', { params })
    return response.data
  },

  createEbook: async (data) => {
    const response = await api.post('/platform/ebooks', data)
    return extractData(response)
  },

  getPdfs: async (params = {}) => {
    const response = await api.get('/platform/pdfs', { params })
    return response.data
  },

  getBundles: async (params = {}) => {
    const response = await api.get('/platform/bundles', { params })
    return response.data
  },

  createBundle: async (data) => {
    const response = await api.post('/platform/bundles', data)
    return extractData(response)
  },

  getRecentActivity: async () => {
    const response = await api.get('/platform/activity')
    return extractData(response)
  },

  getTopExams: async () => {
    const response = await api.get('/platform/exams/top')
    return extractData(response)
  }
}
