import api from './axios'

export const examApi = {
  getTeacherExams: async () => {
    const response = await api.get('/teacher/exams')
    return response.data
  },
  
  createExam: async (data) => {
    const response = await api.post('/teacher/exams', data)
    return response.data
  },
  
  publishExam: async (examId) => {
    const response = await api.post(`/teacher/exams/${examId}/publish`)
    return response.data
  },
  
  getAvailableExams: async () => {
    const response = await api.get('/student-college/exams/available')
    return response.data
  },
  
  startExam: async (examId, password) => {
    const response = await api.post(`/student-college/exams/${examId}/start`, { password })
    return response.data
  },
  
  getExamQuestions: async (examId) => {
    const response = await api.get(`/student-college/exams/${examId}/questions`)
    return response.data
  },
  
  saveAnswer: async (attemptId, data) => {
    const response = await api.post(`/student-college/attempts/${attemptId}/save-answer`, data)
    return response.data
  },
  
  submitExam: async (attemptId) => {
    const response = await api.post(`/student-college/attempts/${attemptId}/submit`)
    return response.data
  }
}
