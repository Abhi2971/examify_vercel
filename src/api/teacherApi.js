import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const teacherApi = {
  getDashboardStats: async () => {
    const response = await api.get('/teacher/dashboard/stats')
    return extractData(response)
  },

  getExams: async (params = {}) => {
    const response = await api.get('/teacher/exams', { params })
    return response.data
  },

  getExamDetail: async (examId) => {
    const response = await api.get(`/teacher/exams/${examId}`)
    return extractData(response)
  },

  createExam: async (data) => {
    const response = await api.post('/teacher/exams', data)
    return extractData(response)
  },

  updateExam: async (examId, data) => {
    const response = await api.put(`/teacher/exams/${examId}`, data)
    return extractData(response)
  },

  publishExam: async (examId) => {
    const response = await api.post(`/teacher/exams/${examId}/publish`)
    return extractData(response)
  },

  getQuestionBank: async (params = {}) => {
    const response = await api.get('/teacher/question-bank', { params })
    return response.data
  },

  createQuestion: async (data) => {
    const response = await api.post('/teacher/question-bank', data)
    return extractData(response)
  },

  getRecentSubmissions: async () => {
    const response = await api.get('/teacher/submissions/recent')
    return extractData(response)
  },

  getStudentPerformance: async () => {
    const response = await api.get('/teacher/analytics/students')
    return extractData(response)
  },

  getUpcomingExams: async () => {
    const response = await api.get('/teacher/exams/upcoming')
    return extractData(response)
  }
}
