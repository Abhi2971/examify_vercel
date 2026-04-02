import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const studentCollegeApi = {
  getDashboardStats: async () => {
    const response = await api.get('/student-college/dashboard')
    return extractData(response)
  },

  getAvailableExams: async (params = {}) => {
    const response = await api.get('/student-college/exams/available', { params })
    return response.data
  },

  startExam: async (examId, data = {}) => {
    const response = await api.post(`/student-college/exams/${examId}/start`, data)
    return extractData(response)
  },

  getExamQuestions: async (examId) => {
    const response = await api.get(`/student-college/exams/${examId}/questions`)
    return extractData(response)
  },

  saveAnswer: async (attemptId, data) => {
    const response = await api.post(`/student-college/attempts/${attemptId}/save-answer`, data)
    return extractData(response)
  },

  submitExam: async (attemptId) => {
    const response = await api.post(`/student-college/attempts/${attemptId}/submit`)
    return extractData(response)
  },

  getResults: async (params = {}) => {
    const response = await api.get('/student-college/results', { params })
    return response.data
  },

  getResultDetail: async (attemptId) => {
    const response = await api.get(`/student-college/results/${attemptId}`)
    return extractData(response)
  },

  getCertificates: async () => {
    const response = await api.get('/student-college/certificates')
    return extractData(response)
  },

  getUpcomingExams: async () => {
    const response = await api.get('/student-college/exams/upcoming')
    return extractData(response)
  },

  getRecentResults: async () => {
    const response = await api.get('/student-college/results/recent')
    return extractData(response)
  },

  getPerformanceBySubject: async () => {
    const response = await api.get('/student-college/analytics/subjects')
    return extractData(response)
  }
}
