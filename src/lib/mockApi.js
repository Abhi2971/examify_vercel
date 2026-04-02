import users from '../api/mockData/users.json'
import institutes from '../api/mockData/institutes.json'
import exams from '../api/mockData/exams.json'
import plans from '../api/mockData/plans.json'
import attempts from '../api/mockData/attempts.json'
import notifications from '../api/mockData/notifications.json'
import tickets from '../api/mockData/tickets.json'
import certificates from '../api/mockData/certificates.json'
import ebooks from '../api/mockData/ebooks.json'
import bundles from '../api/mockData/bundles.json'
import questions from '../api/mockData/questions.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  async login(email, password) {
    await delay(500)
    const user = users.find(u => u.email === email) || users[0]
    return { token: 'mock-jwt-token', user }
  },

  async getUsers(role) {
    await delay(300)
    return role ? users.filter(u => u.role === role) : users
  },

  async getInstitutes() {
    await delay(300)
    return institutes
  },

  async getExams(filters = {}) {
    await delay(300)
    let result = [...exams]
    if (filters.status) result = result.filter(e => e.status === filters.status)
    if (filters.scope) result = result.filter(e => e.scope === filters.scope)
    return result
  },

  async getExamById(id) {
    await delay(200)
    return exams.find(e => e.id === id)
  },

  async getPlans() {
    await delay(200)
    return plans
  },

  async getSuperAdminStats() {
    await delay(300)
    return {
      totalInstitutes: 15,
      totalStudents: 5000,
      totalTeachers: 120,
      monthlyRevenue: 125000,
      activeSubscriptions: 12,
      revenueData: [
        { month: 'Jan', revenue: 80000 },
        { month: 'Feb', revenue: 95000 },
        { month: 'Mar', revenue: 110000 },
        { month: 'Apr', revenue: 125000 },
      ]
    }
  },

  async getCollegeAdminStats() {
    await delay(300)
    return {
      totalTeachers: 15,
      totalStudents: 500,
      totalExams: 45,
      avgScore: 68.5,
      activeSubscriptions: 1,
    }
  },

  async getTeacherStats() {
    await delay(300)
    return {
      totalExams: 8,
      totalStudents: 45,
      activeExams: 2,
      avgScore: 72.5,
    }
  },

  async getStudentCollegeStats() {
    await delay(300)
    return {
      availableExams: 5,
      completedExams: 12,
      avgScore: 75.2,
      certificates: 3,
    }
  },

  async getStudentPublicStats() {
    await delay(300)
    return {
      bundleExams: 10,
      aiQueriesUsed: 45,
      aiQueriesLimit: 100,
      walletBalance: 500,
      certificates: 5,
    }
  },

  async getSupportStats() {
    await delay(300)
    return {
      openTickets: 8,
      inProgressTickets: 5,
      resolvedToday: 3,
      avgResponseTime: '2h',
    }
  },

  async getNotifications() {
    await delay(200)
    return notifications
  },

  async getTickets() {
    await delay(300)
    return tickets
  },

  async getCertificates() {
    await delay(200)
    return certificates
  },

  async getEbooks() {
    await delay(200)
    return ebooks
  },

  async getBundles() {
    await delay(200)
    return bundles
  },

  async getAttempts() {
    await delay(300)
    return attempts
  },

  async getQuestions() {
    await delay(300)
    return questions
  },
}
