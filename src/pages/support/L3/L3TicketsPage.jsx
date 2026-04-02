import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supportApi } from '../../../api/supportApi'
import { Modal } from '../../../components/ui/Modal'
import { Search, Filter, ChevronLeft, ChevronRight, AlertCircle, Zap } from 'lucide-react'

/**
 * L3TicketsPage - Leadership ticket management
 * Lists all support tickets with advanced filters and bulk actions
 * Features: search, status/priority/tier/assigned_to filters, reassign, escalate, close
 */
export function L3TicketsPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [assignedFilter, setAssignedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalTickets, setTotalTickets] = useState(0)

  // Reassignment modal state
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [reassignError, setReassignError] = useState(null)
  const [reassignSuccess, setReassignSuccess] = useState(false)

  // Action modal state
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null) // 'escalate', 'close'
  const [actionNotes, setActionNotes] = useState('')
  const [actionError, setActionError] = useState(null)

  // Debounce search
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-500/20 text-gray-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      urgent: 'bg-red-500/20 text-red-400'
    }
    return colors[priority] || colors.low
  }

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-500/20 text-blue-400',
      'in-progress': 'bg-purple-500/20 text-purple-400',
      resolved: 'bg-emerald-500/20 text-emerald-400',
      closed: 'bg-gray-500/20 text-gray-400',
      escalated: 'bg-orange-500/20 text-orange-400'
    }
    return colors[status] || colors.open
  }

  const getTierColor = (tier) => {
    const colors = {
      L1: 'bg-blue-500/20 text-blue-400',
      L2: 'bg-cyan-500/20 text-cyan-400',
      L3: 'bg-purple-500/20 text-purple-400'
    }
    return colors[tier] || 'bg-gray-500/20 text-gray-400'
  }

  const formatStatus = (status) => {
    return status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
  }

  const formatPriority = (priority) => {
    return priority?.charAt(0).toUpperCase() + priority?.slice(1) || 'Unknown'
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const openReassignModal = (ticket) => {
    setSelectedTicket(ticket)
    setSelectedAgent('')
    setReassignError(null)
    setReassignSuccess(false)
    setShowReassignModal(true)
  }

  const closeReassignModal = () => {
    setShowReassignModal(false)
    setSelectedTicket(null)
    setSelectedAgent('')
    setReassignError(null)
    setReassignSuccess(false)
  }

  const openActionModal = (ticket, action) => {
    setSelectedTicket(ticket)
    setSelectedAction(action)
    setActionNotes('')
    setActionError(null)
    setShowActionModal(true)
  }

  const closeActionModal = () => {
    setShowActionModal(false)
    setSelectedTicket(null)
    setSelectedAction(null)
    setActionNotes('')
    setActionError(null)
  }

  const handleReassign = async () => {
    if (!selectedAgent) {
      setReassignError('Please select an agent')
      return
    }

    try {
      setReassignError(null)
      setReassignSuccess(false)

      // Call L2 API to reassign (or L3 equivalent if available)
      await supportApi.l2.reassignTicket?.(selectedTicket.id, selectedAgent)
        .catch(() => supportApi.l3.updateTicket?.(selectedTicket.id, { assigned_to: selectedAgent }))

      setReassignSuccess(true)
      setTimeout(() => {
        closeReassignModal()
        setCurrentPage(1)
      }, 1000)
    } catch (error) {
      console.error('Failed to reassign ticket:', error)
      setReassignError('Failed to reassign ticket. Please try again.')
    }
  }

  const handleAction = async () => {
    if (!selectedAction) return

    try {
      setActionError(null)

      if (selectedAction === 'escalate') {
        await supportApi.l3.updateTicket?.(selectedTicket.id, {
          status: 'escalated',
          escalation_reason: actionNotes
        })
      } else if (selectedAction === 'close') {
        await supportApi.l2.closeTicket?.(selectedTicket.id, { notes: actionNotes })
      }

      closeActionModal()
      setCurrentPage(1)
    } catch (error) {
      console.error('Failed to perform action:', error)
      setActionError('Failed to perform action. Please try again.')
    }
  }

  // Fetch tickets
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = {
          page: currentPage,
          limit: pageSize
        }

        if (debouncedSearchTerm) {
          params.search = debouncedSearchTerm
        }
        if (statusFilter !== 'all') {
          params.status = statusFilter
        }
        if (priorityFilter !== 'all') {
          params.priority = priorityFilter
        }
        if (tierFilter !== 'all') {
          params.tier = tierFilter
        }
        if (assignedFilter !== 'all') {
          params.assigned_to = assignedFilter
        }

        const response = await supportApi.l2.getTickets(params)
        setTickets(response?.data || response || [])
        setTotalTickets(response?.total || response?.length || 0)
      } catch (error) {
        console.error('Failed to load tickets:', error)
        setError('Failed to load tickets. Please try again.')
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [currentPage, pageSize, statusFilter, priorityFilter, tierFilter, assignedFilter, debouncedSearchTerm])

  // Fetch team members for reassignment
  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await supportApi.l3.getTeamMembers({ status: 'active' })
        setAgents(response || [])
      } catch (error) {
        console.error('Failed to load team members:', error)
      }
    }

    loadTeam()
  }, [])

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  const totalPages = Math.ceil(totalTickets / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Support Tickets</h1>
        <p className="text-white/70">Leadership view: manage all tickets across all tiers ({totalTickets} total)</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Filter size={16} className="text-white/70" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent text-white focus:outline-none text-sm flex-1"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Filter size={16} className="text-white/70" />
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent text-white focus:outline-none text-sm flex-1"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Filter size={16} className="text-white/70" />
          <select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent text-white focus:outline-none text-sm flex-1"
          >
            <option value="all">All Tiers</option>
            <option value="L1">L1 Only</option>
            <option value="L2">L2 Only</option>
            <option value="L3">L3 Only</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Filter size={16} className="text-white/70" />
          <select
            value={assignedFilter}
            onChange={(e) => {
              setAssignedFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent text-white focus:outline-none text-sm flex-1"
          >
            <option value="all">All Agents</option>
            <option value="unassigned">Unassigned</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* No Results */}
      {!loading && tickets.length === 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/70">No tickets found matching your filters</p>
        </div>
      )}

      {/* Tickets Table */}
      {tickets.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left text-sm font-semibold text-white/70">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-purple-400 text-sm">#{ticket.id?.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {formatPriority(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTierColor(ticket.tier)}`}>
                        {ticket.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80 text-sm">{ticket.customer_name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70 text-sm">{ticket.assigned_to_name || ticket.assigned_to || 'Unassigned'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/60 text-sm">{formatDate(ticket.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/60 text-sm">{formatDate(ticket.updated_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openReassignModal(ticket)}
                          className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded text-xs font-medium transition-colors"
                        >
                          Reassign
                        </button>
                        <button
                          onClick={() => openActionModal(ticket, 'escalate')}
                          className="px-2 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded text-xs font-medium transition-colors"
                        >
                          Escalate
                        </button>
                        <button
                          onClick={() => openActionModal(ticket, 'close')}
                          className="px-2 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded text-xs font-medium transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalTickets)} of {totalTickets}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = currentPage - 2 + i
              if (pageNum < 1) pageNum = i + 1
              if (pageNum > totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pageNum === currentPage
                      ? 'bg-purple-500/30 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      <Modal isOpen={showReassignModal} onClose={closeReassignModal} title="Reassign Ticket">
        <div className="space-y-4">
          {selectedTicket && (
            <div className="text-white/80 text-sm">
              <p>Ticket: <span className="font-mono text-purple-400">#{selectedTicket.id?.slice(0, 8)}</span></p>
              <p>Current: {selectedTicket.assigned_to_name || 'Unassigned'}</p>
            </div>
          )}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Assign to Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">Select an agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name} ({agent.tier})</option>
              ))}
            </select>
          </div>
          {reassignError && (
            <div className="text-red-400 text-sm">{reassignError}</div>
          )}
          {reassignSuccess && (
            <div className="text-green-400 text-sm">Ticket reassigned successfully!</div>
          )}
          <div className="flex gap-3 justify-end">
            <button
              onClick={closeReassignModal}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReassign}
              className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 rounded-lg transition-colors"
            >
              Reassign
            </button>
          </div>
        </div>
      </Modal>

      {/* Action Modal */}
      <Modal isOpen={showActionModal} onClose={closeActionModal} title={selectedAction === 'escalate' ? 'Escalate Ticket' : 'Close Ticket'}>
        <div className="space-y-4">
          {selectedTicket && (
            <div className="text-white/80 text-sm">
              <p>Ticket: <span className="font-mono text-purple-400">#{selectedTicket.id?.slice(0, 8)}</span></p>
            </div>
          )}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Notes</label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              rows="4"
              placeholder="Enter notes for this action..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
          {actionError && (
            <div className="text-red-400 text-sm">{actionError}</div>
          )}
          <div className="flex gap-3 justify-end">
            <button
              onClick={closeActionModal}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <Zap size={16} />
              {selectedAction === 'escalate' ? 'Escalate' : 'Close'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
