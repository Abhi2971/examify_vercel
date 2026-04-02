import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supportApi } from '../../../api/supportApi'
import { Modal } from '../../../components/ui/Modal'
import { MessageSquare, Search, Filter, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

export function L2TicketsPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalTickets, setTotalTickets] = useState(0)

  // Reassignment modal state
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [reassigningTicketId, setReassigningTicketId] = useState(null)
  const [reassignError, setReassignError] = useState(null)
  const [reassignSuccess, setReassignSuccess] = useState(false)

  // Debounce search to avoid too many API calls
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
      closed: 'bg-gray-500/20 text-gray-400'
    }
    return colors[status] || colors.open
  }

  const formatStatus = (status) => {
    return status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
  }

  const formatPriority = (priority) => {
    return priority?.charAt(0).toUpperCase() + priority?.slice(1) || 'Unknown'
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
    setReassigningTicketId(null)
  }

  const handleReassign = async () => {
    if (!selectedAgent) {
      setReassignError('Please select an agent')
      return
    }

    try {
      setReassignError(null)
      setReassignSuccess(false)
      setReassigningTicketId(selectedTicket.id)

      await supportApi.l2.reassignTicket(selectedTicket.id, selectedAgent)

      setReassignSuccess(true)

      // Reset modal after brief delay to show success message
      setTimeout(() => {
        closeReassignModal()
        // Refresh ticket list
        setCurrentPage(1)
      }, 1000)
    } catch (error) {
      console.error('Failed to reassign ticket:', error)
      setReassignError(error.response?.data?.message || 'Failed to reassign ticket. Please try again.')
      setReassigningTicketId(null)
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

        const response = await supportApi.l2.getTickets(params)
        setTickets(response?.data || response || [])
        setTotalTickets(response?.total || 0)
      } catch (error) {
        console.error('Failed to load tickets:', error)
        setError('Failed to load tickets. Please try again.')
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [currentPage, pageSize, statusFilter, priorityFilter, debouncedSearchTerm])

  // Fetch team view for agents
  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await supportApi.l2.getTeamView()
        setAgents(response?.agents || response || [])
      } catch (error) {
        console.error('Failed to load team view:', error)
      }
    }

    loadTeam()
  }, [])

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
      </div>
    )
  }

  const totalPages = Math.ceil(totalTickets / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">All Tickets</h1>
        <p className="text-white/70">View and manage all support tickets from L1 agents ({totalTickets} total)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search by ticket ID or subject..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00C4B4]"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
          <Filter size={20} className="text-white/70" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent text-white focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
          <Filter size={20} className="text-white/70" />
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent text-white focus:outline-none"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-white/40 mb-4" />
          <p className="text-white/70">No tickets found</p>
        </div>
      )}

      {/* Tickets Table */}
      {tickets.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 bg-white/5 px-6 py-4 border-b border-white/10 text-white/70 text-sm font-semibold">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Subject</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-1">Created</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {tickets.map(ticket => (
              <div key={ticket.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                {/* ID */}
                <div className="col-span-1">
                  <span className="text-white/60 text-sm font-mono">
                    {ticket.id?.substring(0, 8) || 'N/A'}
                  </span>
                </div>

                {/* Subject */}
                <div className="col-span-3">
                  <p className="text-white truncate text-sm font-medium">
                    {ticket.subject || ticket.title || 'No Subject'}
                  </p>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="text-white/60 text-sm">
                    {ticket.category || 'N/A'}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                    {formatStatus(ticket.status)}
                  </span>
                </div>

                {/* Priority Badge */}
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                    {formatPriority(ticket.priority)}
                  </span>
                </div>

                {/* Created Date */}
                <div className="col-span-1">
                  <span className="text-white/60 text-sm">
                    {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <button
                    onClick={() => openReassignModal(ticket)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-xs font-medium"
                  >
                    Reassign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {tickets.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-white/70 text-sm">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalTickets)} of {totalTickets} tickets
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#00C4B4]/50 transition-all"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="flex items-center gap-1 px-3 py-2">
              <span className="text-white/70 text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#00C4B4]/50 transition-all"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={closeReassignModal}
        title="Reassign Ticket"
        size="md"
      >
        {selectedTicket && (
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">Ticket ID</div>
              <div className="font-mono text-slate-900 dark:text-white">{selectedTicket.id}</div>
            </div>

            {/* Subject */}
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">Subject</div>
              <div className="text-slate-900 dark:text-white">{selectedTicket.subject}</div>
            </div>

            {/* Agent Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Assign to Agent
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => {
                  setSelectedAgent(e.target.value)
                  setReassignError(null)
                }}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select an agent...</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.open_tickets || 0} open tickets)
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {reassignError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {reassignError}
              </div>
            )}

            {/* Success Message */}
            {reassignSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 text-emerald-200 text-sm">
                Ticket reassigned successfully!
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeReassignModal}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
                disabled={reassigningTicketId === selectedTicket.id}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {reassigningTicketId === selectedTicket.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Reassigning...
                  </>
                ) : (
                  'Reassign'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
