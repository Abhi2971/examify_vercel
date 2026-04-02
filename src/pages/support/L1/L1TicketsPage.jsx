import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supportApi } from '../../../api/supportApi'
import { MessageSquare, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

export function L1TicketsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalTickets, setTotalTickets] = useState(0)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build filter params
        const params = {
          page: currentPage,
          limit: pageSize,
          search: searchTerm || undefined
        }
        
        if (statusFilter !== 'all') {
          params.status = statusFilter
        }
        
        if (priorityFilter !== 'all') {
          params.priority = priorityFilter
        }
        
        const response = await supportApi.l1.getTickets(params)
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
  }, [currentPage, pageSize, statusFilter, priorityFilter, searchTerm])

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

  if (loading) {
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
        <h1 className="text-3xl font-bold text-white mb-2">My Tickets</h1>
        <p className="text-white/70">Tickets assigned to you ({totalTickets} total)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search tickets..."
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
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-white/40 mb-4" />
          <p className="text-white/70">No tickets found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const ticketKey = ticket._id || ticket.id || ticket.ticket_id
            return (
              <div
                key={ticketKey}
                onClick={() => navigate(`/support/l1/tickets/${ticketKey}`)}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 hover:border-[#00C4B4]/50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white/60 text-sm font-mono">#{ticket.ticket_id || ticket.id}</span>
                      <h3 className="text-white font-semibold truncate">{ticket.subject || ticket.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-white/60 text-sm">
                      {ticket.category && (
                        <span className="px-2 py-1 bg-white/10 rounded text-xs">{ticket.category}</span>
                      )}
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {tickets.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-white/70 text-sm">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalTickets)} of {totalTickets} tickets
          </div>
          <div className="flex gap-2">
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
    </div>
  )
}
