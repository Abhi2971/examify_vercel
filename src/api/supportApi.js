import api from './axios'

const extractData = (response) => response.data?.data || response.data

export const supportApi = {
  getDashboardStats: async () => {
    const response = await api.get('/support/dashboard/stats')
    return extractData(response)
  },

  getMyTickets: async (params = {}) => {
    const response = await api.get('/support/tickets', { params })
    return extractData(response)
  },

  getAllTickets: async (params = {}) => {
    const response = await api.get('/support/tickets/all', { params })
    return extractData(response)
  },

  getEscalatedTickets: async () => {
    const response = await api.get('/support/tickets/escalated')
    return extractData(response)
  },

  getTicketDetail: async (ticketId) => {
    const response = await api.get(`/support/tickets/${ticketId}`)
    return extractData(response)
  },

  replyToTicket: async (ticketId, message, isInternal = false) => {
    const response = await api.post(`/support/tickets/${ticketId}/reply`, { message, is_internal: isInternal })
    return extractData(response)
  },

  updateTicketStatus: async (ticketId, status) => {
    const response = await api.put(`/support/tickets/${ticketId}/status`, { status })
    return extractData(response)
  },

  updateTicketPriority: async (ticketId, priority) => {
    const response = await api.put(`/support/tickets/${ticketId}/priority`, { priority })
    return extractData(response)
  },

  assignToSelf: async (ticketId) => {
    const response = await api.post(`/support/tickets/${ticketId}/assign`)
    return extractData(response)
  },

  escalateTicket: async (ticketId, escalateTo, reason = '') => {
    const response = await api.post(`/support/tickets/${ticketId}/escalate`, { escalate_to: escalateTo, reason })
    return extractData(response)
  },

  getKnowledgeBase: async () => {
    const response = await api.get('/support/knowledge-base')
    return extractData(response)
  },

  getInstitutes: async () => {
    const response = await api.get('/support/institutes')
    return extractData(response)
  },

  getPerformance: async () => {
    const response = await api.get('/support/performance')
    return extractData(response)
  },

  getProfile: async () => {
    const response = await api.get('/support/profile')
    return extractData(response)
  },

  updateProfile: async (data) => {
    const response = await api.put('/support/profile', data)
    return extractData(response)
  },

  sendAnnouncement: async (data) => {
    const response = await api.post('/support/announcements', data)
    return extractData(response)
  },

  verifyPayment: async (paymentId) => {
    const response = await api.get(`/support/verify/payment/${paymentId}`)
    return extractData(response)
  },

  verifyUser: async (userId) => {
    const response = await api.get(`/support/verify/user/${userId}`)
    return extractData(response)
  },

  verifyInstitute: async (instituteId) => {
    const response = await api.get(`/support/verify/institute/${instituteId}`)
    return extractData(response)
  },

  submitFeedback: async (ticketId, data) => {
    const response = await api.post(`/support/tickets/${ticketId}/feedback`, data)
    return extractData(response)
  },

  resolveTicket: async (ticketId, data) => {
    const response = await api.post(`/support/tickets/${ticketId}/resolve`, data)
    return extractData(response)
  },

  mergeTickets: async (sourceId, targetId, reason) => {
    const response = await api.post('/support/tickets/merge', {
      source_ticket_id: sourceId,
      target_ticket_id: targetId,
      reason
    })
    return extractData(response)
  },

  getMergeCandidates: async (ticketId) => {
    const response = await api.get(`/support/tickets/${ticketId}/merge-candidates`)
    return extractData(response)
  },

  updateTags: async (ticketId, tags) => {
    const response = await api.put(`/support/tickets/${ticketId}/tags`, { tags })
    return extractData(response)
  },

  getAllTags: async () => {
    const response = await api.get('/support/tags')
    return extractData(response)
  },

  getFeedbackStats: async () => {
    const response = await api.get('/support/feedback/stats')
    return extractData(response)
  },

  autoEscalate: async () => {
    const response = await api.post('/support/escalate/auto')
    return extractData(response)
  },

  getEscalationHistory: async (params = {}) => {
    const response = await api.get('/support/escalations/history', { params })
    return extractData(response)
  },

  uploadAttachment: async (ticketId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post(`/support/tickets/${ticketId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return extractData(response)
  },

  deleteAttachment: async (ticketId, filename) => {
    const response = await api.delete(`/support/tickets/${ticketId}/attachments/${filename}`)
    return extractData(response)
  },

  getReportsOverview: async (days = 30) => {
    const response = await api.get('/support/reports/overview', { params: { days } })
    return extractData(response)
  },

  getAgentPerformance: async (days = 30) => {
    const response = await api.get('/support/reports/agent-performance', { params: { days } })
    return extractData(response)
  },

  getCategoryAnalysis: async (days = 30) => {
    const response = await api.get('/support/reports/category-analysis', { params: { days } })
    return extractData(response)
  },

  exportReport: async (days = 30, format = 'csv') => {
    const response = await api.get('/support/reports/export', { 
        params: { days, format },
        responseType: 'blob'
    })
    return response
  },

  getCannedResponses: async (params = {}) => {
    const response = await api.get('/support/canned-responses', { params })
    return extractData(response)
  },

  createCannedResponse: async (data) => {
    const response = await api.post('/support/canned-responses', data)
    return extractData(response)
  },

  updateCannedResponse: async (id, data) => {
    const response = await api.put(`/support/canned-responses/${id}`, data)
    return extractData(response)
  },

  deleteCannedResponse: async (id) => {
    const response = await api.delete(`/support/canned-responses/${id}`)
    return extractData(response)
  },

  useCannedResponse: async (id) => {
    const response = await api.post(`/support/canned-responses/${id}/use`)
    return extractData(response)
  },

  bulkAction: async (action, ticketIds, value) => {
    const response = await api.post('/support/tickets/bulk-action', {
        action,
        ticket_ids: ticketIds,
        value
    })
    return extractData(response)
  },

  getAgents: async () => {
    const response = await api.get('/support/agents')
    return extractData(response)
  },

  updateAgentTier: async (agentId, tier) => {
    const response = await api.put(`/support/agents/${agentId}/tier`, { tier })
    return extractData(response)
  },

  toggleAvailability: async (agentId) => {
    const response = await api.put(`/support/agents/${agentId}/availability`)
    return extractData(response)
  },

  getUnassignedTickets: async () => {
    const response = await api.get('/support/unassigned')
    return extractData(response)
  },

  getEscalatedTickets: async () => {
    const response = await api.get('/support/escalated')
    return extractData(response)
  },

  claimTicket: async (ticketId) => {
    const response = await api.post(`/support/claim/${ticketId}`)
    return extractData(response)
  },

  reassignTicket: async (ticketId, agentId) => {
    const response = await api.put(`/support/reassign/${ticketId}`, { agent_id: agentId })
    return extractData(response)
  },

  reassignToLowerTier: async (ticketId, targetTier) => {
    const response = await api.post(`/support/tickets/${ticketId}/reassign-to-tier`, { target_tier: targetTier })
    return extractData(response)
  },

  getTicketHistory: async (ticketId) => {
    const response = await api.get(`/support/tickets/${ticketId}/history`)
    return extractData(response)
  },

  autoAssignSingle: async (ticketId) => {
    const response = await api.post(`/support/auto-assign/${ticketId}`)
    return extractData(response)
  },

  autoAssignAll: async (ticketIds = null) => {
    const response = await api.post('/support/auto-assign-all', { ticket_ids: ticketIds })
    return extractData(response)
  },

  getAvailableAgents: async (tier = null) => {
    const params = tier ? { tier } : {}
    const response = await api.get('/support/available-agents', { params })
    return extractData(response)
  },

  manualAssign: async (ticketId, agentId) => {
    const response = await api.put(`/support/reassign/${ticketId}`, { agent_id: agentId })
    return extractData(response)
  },

  l1: {
    // Dashboard
    getDashboardStats: async () => {
      const response = await api.get('/support/l1/dashboard/stats')
      return extractData(response)
    },

    // Tickets
    getTickets: async (filters = {}) => {
      const response = await api.get('/support/l1/tickets', { params: filters })
      return extractData(response)
    },

    // Knowledge Base
    getKnowledgeBase: async (filters = {}) => {
      const response = await api.get('/support/l1/knowledge-base', { params: filters })
      return extractData(response)
    },

    // Canned Responses
    getCannedResponses: async (category = '') => {
      const params = category ? { category } : {}
      const response = await api.get('/support/l1/canned-responses', { params })
      return extractData(response)
    },

    // Profile
    getProfile: async () => {
      const response = await api.get('/support/l1/profile')
      return extractData(response)
    },

    updateProfile: async (data) => {
      const response = await api.put('/support/l1/profile', data)
      return extractData(response)
    },

    escalateTicket: async (ticketId, reason, notes) => {
      const response = await api.post(`/support/l1/tickets/${ticketId}/escalate`, {
        reason,
        notes
      })
      return extractData(response)
    }
  },

   l2: {
     // Dashboard
     getDashboardStats: async () => {
       const response = await api.get('/support/l2/dashboard/stats')
       return extractData(response)
     },

     // Tickets with filtering
     getTickets: async (filters = {}) => {
       const params = new URLSearchParams()
       if (filters.status) params.append('status', filters.status)
       if (filters.priority) params.append('priority', filters.priority)
       if (filters.page) params.append('page', filters.page)
       if (filters.limit) params.append('limit', filters.limit)
       if (filters.search) params.append('search', filters.search)
       const queryString = params.toString()
       const url = `/support/l2/tickets${queryString ? '?' + queryString : ''}`
       const response = await api.get(url)
       return extractData(response)
     },

     // Reports - Overview
     getReportsOverview: async () => {
       const response = await api.get('/support/l2/reports/overview')
       return extractData(response)
     },

     // Reports - Agent Performance
     getReportsAgentPerformance: async () => {
       const response = await api.get('/support/l2/reports/agent-performance')
       return extractData(response)
     },

     // Reports - Category Analysis
     getReportsCategoryAnalysis: async () => {
       const response = await api.get('/support/l2/reports/category-analysis')
       return extractData(response)
     },

     // Team View
     getTeamView: async () => {
       const response = await api.get('/support/l2/team-view')
       return extractData(response)
     },

     // Canned Responses
     getCannedResponses: async () => {
       const response = await api.get('/support/l2/canned-responses')
       return extractData(response)
     },

     createCannedResponse: async (data) => {
       const response = await api.post('/support/l2/canned-responses', data)
       return extractData(response)
     },

     // Reassign ticket
     reassignTicket: async (ticketId, newAgentId) => {
       const response = await api.put(`/support/l2/tickets/${ticketId}/reassign`, { new_agent_id: newAgentId })
       return extractData(response)
     },

      // Escalate ticket
      escalateTicket: async (ticketId, reason, notes = '') => {
        const response = await api.post(`/support/l2/tickets/${ticketId}/escalate`, { reason, notes })
        return extractData(response)
      },

      // Escalate to L3
      escalateToL3: async (ticketId, reason, notes) => {
        const response = await api.post(`/support/l2/tickets/${ticketId}/escalate`, {
          reason,
          notes
        })
        return extractData(response)
      }
   },

   l3: {
     // Dashboard & Reporting (4 methods)
     getDashboardStats: async () => {
       const response = await api.get('/support/l3/dashboard/stats')
       return extractData(response)
     },

     getExecutiveSummary: async (startDate, endDate) => {
       const params = new URLSearchParams()
       if (startDate) params.append('start_date', startDate)
       if (endDate) params.append('end_date', endDate)
       const queryString = params.toString()
       const url = `/support/l3/reports/executive-summary${queryString ? '?' + queryString : ''}`
       const response = await api.get(url)
       return extractData(response)
     },

      getPerformanceTrends: async (params = {}) => {
        const response = await api.post('/support/l3/reports/performance-trends', params)
        return extractData(response)
      },

     getEscalationAnalysis: async (startDate, endDate) => {
       const params = new URLSearchParams()
       if (startDate) params.append('start_date', startDate)
       if (endDate) params.append('end_date', endDate)
       const queryString = params.toString()
       const url = `/support/l3/reports/escalation-analysis${queryString ? '?' + queryString : ''}`
       const response = await api.get(url)
       return extractData(response)
     },

     // Team Management (5 methods)
      getTeamMembers: async (filters = {}) => {
        const response = await api.get('/support/l3/team/members', { params: filters })
        return extractData(response)
      },

     createTeamMember: async (data) => {
       const response = await api.post('/support/l3/team/members', data)
       return extractData(response)
     },

     updateTeamMember: async (memberId, data) => {
       const response = await api.put(`/support/l3/team/members/${memberId}`, data)
       return extractData(response)
     },

     deleteTeamMember: async (memberId) => {
       const response = await api.delete(`/support/l3/team/members/${memberId}`)
       return extractData(response)
     },

     getTeamPerformance: async (dateRange, tier) => {
       const params = new URLSearchParams()
       if (dateRange) params.append('date_range', dateRange)
       if (tier) params.append('tier', tier)
       const queryString = params.toString()
       const url = `/support/l3/team/performance${queryString ? '?' + queryString : ''}`
       const response = await api.get(url)
       return extractData(response)
     },

     // Escalation & Configuration (3 methods)
      getEscalationsQueue: async (filters = {}) => {
        const response = await api.get('/support/l3/escalations/queue', { params: filters })
        return extractData(response)
      },

     updateEscalation: async (escalationId, data) => {
       const response = await api.put(`/support/l3/escalations/${escalationId}`, data)
       return extractData(response)
     },

      getAutoAssignConfig: async () => {
        const response = await api.get('/support/l3/config/auto-assign')
        return extractData(response)
      },

      escalateToSuperAdmin: async (ticketId, reason, notes) => {
        const response = await api.post(`/support/l3/escalations/${ticketId}/escalate`, {
          reason,
          notes
        })
        return extractData(response)
      }
    }
  }
