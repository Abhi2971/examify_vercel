import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const collegeAdminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/college/dashboard/stats')
    return extractData(response)
  },

  getAnalytics: async () => {
    const response = await api.get('/college/analytics')
    return extractData(response)
  },

  getExams: async (params = {}) => {
    const response = await api.get('/college/exams', { params })
    return response.data
  },

  getExamDetail: async (examId) => {
    const response = await api.get(`/college/exams/${examId}`)
    return extractData(response)
  },

  getTeachers: async (params = {}) => {
    const response = await api.get('/college/teachers', { params })
    return response.data
  },

  createTeacher: async (data) => {
    const response = await api.post('/college/teachers', data)
    return extractData(response)
  },

  updateTeacher: async (teacherId, data) => {
    const response = await api.put(`/college/teachers/${teacherId}`, data)
    return extractData(response)
  },

  deleteTeacher: async (teacherId) => {
    const response = await api.delete(`/college/teachers/${teacherId}`)
    return extractData(response)
  },

  resetTeacherPassword: async (teacherId) => {
    const response = await api.post(`/college/teachers/${teacherId}/reset-password`)
    return extractData(response)
  },

  getStudents: async (params = {}) => {
    const response = await api.get('/college/students', { params })
    return response.data
  },

  createStudent: async (data) => {
    const response = await api.post('/college/students', data)
    return extractData(response)
  },

  updateStudent: async (studentId, data) => {
    const response = await api.put(`/college/students/${studentId}`, data)
    return extractData(response)
  },

  resetStudentPassword: async (studentId) => {
    const response = await api.post(`/college/students/${studentId}/reset-password`)
    return extractData(response)
  },

  getSubjects: async () => {
    const response = await api.get('/college/subjects')
    return extractData(response)
  },

  createSubject: async (data) => {
    const response = await api.post('/college/subjects', data)
    return extractData(response)
  },

  getSubscription: async () => {
    const response = await api.get('/college/subscription')
    return extractData(response)
  },

  getSettings: async () => {
    const response = await api.get('/college/settings')
    return extractData(response)
  },

  updateSettings: async (data) => {
    const response = await api.put('/college/settings', data)
    return extractData(response)
  },

  getProfile: async () => {
    const response = await api.get('/college/profile')
    return extractData(response)
  },

  updateProfile: async (data) => {
    const response = await api.put('/college/profile', data)
    return extractData(response)
  },

  getTickets: async (params = {}) => {
    const response = await api.get('/college/tickets', { params })
    return extractData(response)
  },

  createTicket: async (data) => {
    const response = await api.post('/college/tickets', data)
    return extractData(response)
  },

  getTicketDetail: async (ticketId) => {
    const response = await api.get(`/college/tickets/${ticketId}`)
    return extractData(response)
  },

  replyToTicket: async (ticketId, message) => {
    const response = await api.post(`/college/tickets/${ticketId}/reply`, { message })
    return extractData(response)
  },

  getAnnouncements: async (params = {}) => {
    const response = await api.get('/college/announcements', { params })
    return extractData(response)
  },

  createAnnouncement: async (data) => {
    const response = await api.post('/college/announcements', data)
    return extractData(response)
  },

  getAuditLogs: async (params = {}) => {
    const response = await api.get('/college/audit-logs', { params })
    return extractData(response)
  }
}
