import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const superAdminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/superadmin/dashboard/stats')
    return extractData(response)
  },

  // Institutes
  getInstitutes: async (params = {}) => {
    const response = await api.get('/superadmin/institutes', { params })
    return extractData(response)
  },
  createInstitute: async (data) => {
    const response = await api.post('/superadmin/institutes', data)
    return extractData(response)
  },
  updateInstitute: async (id, data) => {
    const response = await api.put(`/superadmin/institutes/${id}`, data)
    return extractData(response)
  },
  toggleInstituteStatus: async (id) => {
    const response = await api.post(`/superadmin/institutes/${id}/toggle-status`)
    return extractData(response)
  },

  // Platform Admins
  getPlatformAdmins: async () => {
    const response = await api.get('/superadmin/platform-admins')
    return extractData(response)
  },
  createPlatformAdmin: async (data) => {
    const response = await api.post('/superadmin/platform-admins', data)
    return extractData(response)
  },
  updatePlatformAdmin: async (id, data) => {
    const response = await api.put(`/superadmin/platform-admins/${id}`, data)
    return extractData(response)
  },

  // Support Agents
  getSupportAgents: async () => {
    const response = await api.get('/superadmin/support-agents')
    return extractData(response)
  },
  createSupportAgent: async (data) => {
    const response = await api.post('/superadmin/support-agents', data)
    return extractData(response)
  },
  updateSupportAgent: async (id, data) => {
    const response = await api.put(`/superadmin/support-agents/${id}`, data)
    return extractData(response)
  },
  updateSupportAgentTier: async (id, tier) => {
    const response = await api.put(`/superadmin/support-agents/${id}/tier`, { support_tier: tier })
    return extractData(response)
  },
  toggleSupportAgentAvailability: async (id) => {
    const response = await api.post(`/superadmin/support-agents/${id}/toggle-availability`)
    return extractData(response)
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await api.get('/superadmin/users', { params })
    return extractData(response)
  },
  createUser: async (data) => {
    const response = await api.post('/superadmin/users', data)
    return extractData(response)
  },
  toggleUserStatus: async (id) => {
    const response = await api.post(`/superadmin/users/${id}/toggle-status`)
    return extractData(response)
  },

  // Plans
  getPlans: async () => {
    const response = await api.get('/superadmin/plans')
    return extractData(response)
  },
  createPlan: async (data) => {
    const response = await api.post('/superadmin/plans', data)
    return extractData(response)
  },
  updatePlan: async (id, data) => {
    const response = await api.put(`/superadmin/plans/${id}`, data)
    return extractData(response)
  },
  deletePlan: async (id) => {
    const response = await api.delete(`/superadmin/plans/${id}`)
    return extractData(response)
  },

  // Exams
  getExams: async (params = {}) => {
    const response = await api.get('/superadmin/exams', { params })
    return extractData(response)
  },
  getExamAnalytics: async (id) => {
    const response = await api.get(`/superadmin/exams/${id}/analytics`)
    return extractData(response)
  },
  flagExam: async (id, reason) => {
    const response = await api.post(`/superadmin/exams/${id}/flag`, { reason })
    return extractData(response)
  },

  // Payments
  getPayments: async (params = {}) => {
    const response = await api.get('/superadmin/payments', { params })
    return extractData(response)
  },
  getPaymentDetails: async (id) => {
    const response = await api.get(`/superadmin/payments/${id}`)
    return extractData(response)
  },

  // Audit Logs
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/superadmin/audit-logs', { params })
    return extractData(response)
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/superadmin/analytics', { params })
    return extractData(response)
  },

  // Settings
  getSettings: async () => {
    const response = await api.get('/superadmin/settings')
    return extractData(response)
  },
  updateSettings: async (data) => {
    const response = await api.put('/superadmin/settings', data)
    return extractData(response)
  },

  // Support Tickets
  getTickets: async (params = {}) => {
    const response = await api.get('/superadmin/tickets', { params })
    return extractData(response)
  },
  getTicketDetail: async (ticketId) => {
    const response = await api.get(`/superadmin/tickets/${ticketId}`)
    return extractData(response)
  },
  updateTicketStatus: async (ticketId, status) => {
    const response = await api.put(`/superadmin/tickets/${ticketId}/status`, { status })
    return extractData(response)
  },
  updateTicketPriority: async (ticketId, priority) => {
    const response = await api.put(`/superadmin/tickets/${ticketId}/priority`, { priority })
    return extractData(response)
  },
  assignTicket: async (ticketId, agentId) => {
    const response = await api.post(`/superadmin/tickets/${ticketId}/assign`, { agent_id: agentId })
    return extractData(response)
  },
  resolveTicket: async (ticketId, data) => {
    const response = await api.post(`/superadmin/tickets/${ticketId}/resolve`, data)
    return extractData(response)
  },
  escalateTicket: async (ticketId, data) => {
    const response = await api.post(`/superadmin/tickets/${ticketId}/escalate`, data)
    return extractData(response)
  },
  updateTicketTags: async (ticketId, tags) => {
    const response = await api.put(`/superadmin/tickets/${ticketId}/tags`, { tags })
    return extractData(response)
  },
  getEscalatedTickets: async (params = {}) => {
    const response = await api.get('/superadmin/escalations', { params })
    return extractData(response)
  },
  resolveEscalatedTicket: async (ticketId, data) => {
    const response = await api.post(`/superadmin/escalations/${ticketId}/resolve`, data)
    return extractData(response)
  },
  autoEscalate: async () => {
    const response = await api.post('/superadmin/escalate/auto')
    return extractData(response)
  },
  getTicketHistory: async (ticketId) => {
    const response = await api.get(`/superadmin/tickets/${ticketId}/history`)
    return extractData(response)
  },
  reassignTicket: async (ticketId, agentId) => {
    const response = await api.post(`/superadmin/tickets/${ticketId}/assign`, { agent_id: agentId })
    return extractData(response)
  },

  // Announcements
  sendAnnouncement: async (data) => {
    const response = await api.post('/superadmin/announcements', data)
    return extractData(response)
  },

  // System Health
  getSystemHealth: async () => {
    const response = await api.get('/superadmin/system/health')
    return extractData(response)
  },

  // Recent Activity (for dashboard)
  getRecentActivity: async () => {
    const response = await api.get('/superadmin/audit-logs', { params: { per_page: 10 } })
    return extractData(response)
  }
}
