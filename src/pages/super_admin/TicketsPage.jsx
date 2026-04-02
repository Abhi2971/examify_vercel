import { useState, useEffect } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { 
  MessageSquare, 
  Search, 
  User,
  HeadphonesIcon,
  Clock, 
  ArrowRight,
  CheckCircle,
  XCircle,
  UserCheck,
  AlertTriangle,
  Ticket,
  Calendar,
  Star,
  Eye,
  Zap,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  ArrowUpCircle,
  PlayCircle,
  Archive,
  RotateCcw
} from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'
import { Select } from '../../components/ui/Select'

const priorityConfig = {
  urgent: { label: 'Urgent', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
  high: { label: 'High', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
  medium: { label: 'Medium', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
  low: { label: 'Low', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400' },
}

const statusConfig = {
  open: { label: 'Open', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
  in_progress: { label: 'In Progress', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  escalated: { label: 'Escalated', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  resolved: { label: 'Resolved', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
  closed: { label: 'Closed', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
}

const TAGS_CONFIG = {
  'urgent-fix-needed': { color: 'bg-red-100 text-red-700' },
  'recurring-issue': { color: 'bg-orange-100 text-orange-700' },
  'customer-frustrated': { color: 'bg-pink-100 text-pink-700' },
  'ui-bug': { color: 'bg-blue-100 text-blue-700' },
  'api-issue': { color: 'bg-purple-100 text-purple-700' },
  'performance': { color: 'bg-yellow-100 text-yellow-700' },
  'security': { color: 'bg-red-100 text-red-700' },
  'billing-error': { color: 'bg-green-100 text-green-700' },
  'data-loss': { color: 'bg-red-100 text-red-700' },
  'documentation-needed': { color: 'bg-gray-100 text-gray-700' },
  'feature-request': { color: 'bg-indigo-100 text-indigo-700' },
  'enhancement': { color: 'bg-cyan-100 text-cyan-700' },
  'duplicate': { color: 'bg-gray-100 text-gray-700' },
}

export function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({})
  const [agentStats, setAgentStats] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketDetail, setTicketDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [ticketHistory, setTicketHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  
  const [escalatedTickets, setEscalatedTickets] = useState([])
  const [escalatedLoading, setEscalatedLoading] = useState(false)
  const [showEscalatedOnly, setShowEscalatedOnly] = useState(false)
  
  const [resolveModal, setResolveModal] = useState({ isOpen: false, ticket: null })
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [resolutionCategory, setResolutionCategory] = useState('fixed')
  const [rootCause, setRootCause] = useState('')
  const [resolving, setResolving] = useState(false)
  
  const [reassignModal, setReassignModal] = useState({ isOpen: false, ticket: null })
  const [selectedAgent, setSelectedAgent] = useState('')
  const [reassigning, setReassigning] = useState(false)

  useEffect(() => { fetchTickets() }, [statusFilter, priorityFilter, agentFilter])
  useEffect(() => { fetchEscalatedTickets() }, [])
  useEffect(() => { fetchAgents() }, [])

  const fetchAgents = async () => {
    try {
      const data = await superAdminApi.getSupportAgents()
      setAgents(data || [])
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (priorityFilter !== 'all') params.priority = priorityFilter
      if (agentFilter !== 'all') params.assigned_to = agentFilter
      
      const data = await superAdminApi.getTickets(params)
      
      if (statusFilter === 'all' && priorityFilter === 'all' && agentFilter === 'all') {
        setStats(data)
        setAgentStats(data?.agent_stats || [])
      }
      
      setTickets(data?.tickets || data?.data || [])
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchEscalatedTickets = async () => {
    setEscalatedLoading(true)
    try {
      const data = await superAdminApi.getEscalatedTickets()
      setEscalatedTickets(data?.data || data || [])
    } catch (error) {
      console.error('Failed to fetch escalated tickets:', error)
    } finally {
      setEscalatedLoading(false)
    }
  }
  
  const handleResolveEscalated = async () => {
    if (!resolutionNotes.trim()) return
    setResolving(true)
    try {
      await superAdminApi.resolveEscalatedTicket(resolveModal.ticket._id, {
        resolution_notes: resolutionNotes,
        resolution_category: resolutionCategory,
        root_cause: rootCause || undefined
      })
      setResolveModal({ isOpen: false, ticket: null })
      setResolutionNotes('')
      setResolutionCategory('fixed')
      setRootCause('')
      fetchEscalatedTickets()
      fetchTickets()
    } catch (error) {
      console.error('Failed to resolve ticket:', error)
      alert(error.response?.data?.message || 'Failed to resolve ticket')
    } finally {
      setResolving(false)
    }
  }
  
  const openResolveModal = (ticket) => {
    setResolveModal({ isOpen: true, ticket })
    setResolutionNotes('')
    setResolutionCategory('fixed')
    setRootCause('')
  }

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket)
    setDetailLoading(true)
    setTicketHistory([])
    try {
      const data = await superAdminApi.getTicketDetail(ticket._id)
      setTicketDetail(data)
      
      // Fetch ticket history
      setHistoryLoading(true)
      try {
        const historyData = await superAdminApi.getTicketHistory(ticket._id)
        setTicketHistory(historyData?.history || historyData || [])
      } catch (histError) {
        console.warn('History not available:', histError)
        setTicketHistory([])
      }
      setHistoryLoading(false)
    } catch (error) {
      console.error('Failed to fetch ticket detail:', error)
      setTicketDetail(ticket)
    } finally {
      setDetailLoading(false)
    }
  }
  
  const handleReassign = async () => {
    if (!selectedAgent) return
    setReassigning(true)
    try {
      await superAdminApi.reassignTicket(reassignModal.ticket._id, selectedAgent)
      setReassignModal({ isOpen: false, ticket: null })
      setSelectedAgent('')
      fetchTickets()
      fetchEscalatedTickets()
    } catch (error) {
      console.error('Failed to reassign ticket:', error)
      alert(error.response?.data?.message || 'Failed to reassign ticket')
    } finally {
      setReassigning(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      ticket.subject?.toLowerCase().includes(searchLower) ||
      ticket.description?.toLowerCase().includes(searchLower) ||
      ticket.user_name?.toLowerCase().includes(searchLower) ||
      ticket.user_email?.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getTimeAgo = (date) => {
    if (!date) return ''
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor support requests and agent performance</p>
        </div>
        <div className="flex items-center gap-2">
          {(stats?.open_count || 0) > 0 && (
            <Badge variant="danger" className="px-3 py-1">
              <AlertTriangle className="w-4 h-4 mr-1" /> {(stats?.open_count || 0)} Open
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="cursor-pointer" onClick={() => setStatusFilter('open')}>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Open</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.open_count || 0}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${(stats?.open_count || 0) > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                <XCircle className={`w-5 h-5 ${(stats?.open_count || 0) > 0 ? 'text-red-600' : 'text-slate-400'}`} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card hover className="cursor-pointer" onClick={() => setStatusFilter('in_progress')}>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.in_progress_count || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card hover className="cursor-pointer" onClick={() => setStatusFilter('resolved')}>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Resolved</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.resolved_count || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Unassigned</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.unassigned_count || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Escalated Tickets Section */}
      {(escalatedTickets.length > 0 || showEscalatedOnly) && (
        <Card className="border-red-200 dark:border-red-900">
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Escalated Tickets Requiring Resolution ({escalatedTickets.length})
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowEscalatedOnly(!showEscalatedOnly)}
              >
                {showEscalatedOnly ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {(showEscalatedOnly || escalatedTickets.length > 0) && (
              <div className="space-y-3">
                {escalatedLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : escalatedTickets.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No escalated tickets</p>
                ) : (
                  escalatedTickets.map((ticket) => (
                    <div 
                      key={ticket._id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          ticket.priority === 'urgent' ? 'bg-red-100' : 'bg-orange-100'
                        }`}>
                          <Zap className={`w-5 h-5 ${ticket.priority === 'urgent' ? 'text-red-600' : 'text-orange-600'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {ticket.priority?.toUpperCase()}
                            </span>
                            {ticket.escalation_reason && (
                              <span className="text-xs text-red-600 dark:text-red-400 max-w-xs truncate">
                                {ticket.escalation_reason}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{ticket.subject}</p>
                          <p className="text-xs text-slate-500">
                            By: {ticket.assigned_to_name || 'Unknown'} | {ticket.escalated_at ? formatDateTime(ticket.escalated_at) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => openResolveModal(ticket)}
                        >
                          <Check className="w-4 h-4 mr-1" /> Resolve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Agent Stats */}
      {agentStats.length > 0 && (
        <Card>
          <CardBody className="p-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <HeadphonesIcon className="w-4 h-4" /> Support Agents Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {agentStats.map(agent => (
                <div key={agent.agent_id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{agent.agent_name?.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{agent.agent_name}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-emerald-600 font-medium">{agent.resolved} resolved</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-amber-600 font-medium">{agent.open + agent.in_progress} active</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search tickets..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select 
              value={agentFilter} 
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Agents</option>
              <option value="unassigned">Unassigned</option>
              {agentStats.map(agent => (
                <option key={agent.agent_id} value={agent.agent_id}>{agent.agent_name}</option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Tickets List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardBody className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket._id} hover className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleViewTicket(ticket)}>
              <CardBody className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    ticket.status === 'open' ? 'bg-red-100 dark:bg-red-900/30' :
                    ticket.status === 'in_progress' ? 'bg-amber-100 dark:bg-amber-900/30' :
                    'bg-emerald-100 dark:bg-emerald-900/30'
                  }`}>
                    <MessageSquare className={`w-6 h-6 ${
                      ticket.status === 'open' ? 'text-red-600' :
                      ticket.status === 'in_progress' ? 'text-amber-600' : 'text-emerald-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[ticket.priority]?.color || ''}`}>
                        {priorityConfig[ticket.priority]?.label || ticket.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[ticket.status]?.color || ''}`}>
                        {statusConfig[ticket.status]?.label || ticket.status}
                      </span>
                      {ticket.sla_breached && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> SLA Breach
                        </span>
                      )}
                      {ticket.tags?.length > 0 && ticket.tags.map(tag => (
                        <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${TAGS_CONFIG[tag]?.color || 'bg-slate-100 text-slate-600'}`}>
                          {tag}
                        </span>
                      ))}
                      {ticket.assigned_to_name ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> {ticket.assigned_to_name}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400">
                          Unassigned
                        </span>
                      )}
                      <span className="text-xs text-slate-400">#{ticket._id?.slice(-6)}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1">{ticket.subject}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {ticket.user_name || 'Anonymous'}
                      </span>
                      <span className="text-slate-400">{ticket.user_email}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(ticket.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {getTimeAgo(ticket.created_at)}
                      </span>
                      {ticket.feedback?.rating && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-3 h-3" /> {ticket.feedback.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <Ticket className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No tickets found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search query</p>
          </CardBody>
        </Card>
      )}

      {/* Ticket Detail Modal - Read Only */}
      <Modal isOpen={!!selectedTicket} onClose={() => { setSelectedTicket(null); setTicketDetail(null) }} title="Ticket Details" size="2xl">
        {detailLoading ? (
          <div className="p-8 text-center"><Skeleton className="h-32 mx-auto w-full max-w-md" /></div>
        ) : ticketDetail ? (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                ticketDetail.status === 'open' ? 'bg-red-100 dark:bg-red-900/30' :
                ticketDetail.status === 'in_progress' ? 'bg-amber-100 dark:bg-amber-900/30' :
                'bg-emerald-100 dark:bg-emerald-900/30'
              }`}>
                <MessageSquare className={`w-6 h-6 ${
                  ticketDetail.status === 'open' ? 'text-red-600' :
                  ticketDetail.status === 'in_progress' ? 'text-amber-600' : 'text-emerald-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[ticketDetail.priority]?.color || ''}`}>
                    {priorityConfig[ticketDetail.priority]?.label || ticketDetail.priority}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[ticketDetail.status]?.color || ''}`}>
                    {statusConfig[ticketDetail.status]?.label || ticketDetail.status}
                  </span>
                  {ticketDetail.sla_breached && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> SLA Breach
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{ticketDetail.subject}</h3>
                <p className="text-sm text-slate-500">#{ticketDetail._id} • Created {formatDate(ticketDetail.created_at)}</p>
              </div>
            </div>

            {/* Tags */}
            {ticketDetail.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ticketDetail.tags.map(tag => (
                  <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${TAGS_CONFIG[tag]?.color || 'bg-slate-100 text-slate-600'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Escalation Info */}
            {ticketDetail.escalated && (
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-2">
                  <ArrowUpCircle className="w-5 h-5" />
                  <span className="font-medium">Escalated Ticket</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-orange-600 dark:text-orange-400">From:</span>
                    <span className="ml-1 font-medium text-slate-900 dark:text-white">
                      {ticketDetail.escalated_from?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-orange-600 dark:text-orange-400">To:</span>
                    <span className="ml-1 font-medium text-slate-900 dark:text-white">
                      {ticketDetail.escalated_to?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                {ticketDetail.escalated_reason && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Reason:</strong> {ticketDetail.escalated_reason}
                  </p>
                )}
                {ticketDetail.escalated_at && (
                  <p className="text-xs text-slate-500 mt-1">
                    Escalated: {formatDateTime(ticketDetail.escalated_at)}
                  </p>
                )}
              </div>
            )}

            {/* SLA Warning */}
            {ticketDetail.sla_breached && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">SLA Breach Detected</span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  {ticketDetail.sla_breach_type === 'first_response' ? 'First response SLA breached' : 'Resolution SLA breached'}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 mb-2">Description</p>
              <p className="text-slate-900 dark:text-white">{ticketDetail.description}</p>
            </div>

            {/* User & Institute Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1">Raised By</p>
                <p className="font-medium text-slate-900 dark:text-white">{ticketDetail.user_name || 'Anonymous'}</p>
                <p className="text-xs text-slate-500">{ticketDetail.user_email}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <p className="font-medium text-slate-900 dark:text-white capitalize">{ticketDetail.category || 'General'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                <p className="font-medium text-slate-900 dark:text-white">{ticketDetail.assigned_to_name || 'Unassigned'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1">Resolution</p>
                <p className="font-medium text-slate-900 dark:text-white capitalize">{ticketDetail.resolution_category || 'Pending'}</p>
              </div>
            </div>

            {/* Resolved By Info */}
            {ticketDetail.resolved_by_name && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white font-bold">{ticketDetail.resolved_by_name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Resolved By</p>
                    <p className="font-semibold text-emerald-900 dark:text-emerald-100">{ticketDetail.resolved_by_name}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">{ticketDetail.resolved_by === 'super_admin' ? 'Super Admin' : 'Support Agent'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resolution Notes */}
            {ticketDetail.resolution_notes && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Resolution Notes
                </p>
                <p className="text-slate-900 dark:text-white text-sm">{ticketDetail.resolution_notes}</p>
                {ticketDetail.root_cause && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <strong>Root Cause:</strong> {ticketDetail.root_cause}
                  </p>
                )}
                {ticketDetail.resolved_at && (
                  <p className="text-xs text-slate-500 mt-2">Resolved on: {formatDateTime(ticketDetail.resolved_at)}</p>
                )}
              </div>
            )}

            {/* Feedback */}
            {ticketDetail.feedback && (
              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Customer Feedback
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-yellow-400">{'★'.repeat(ticketDetail.feedback.rating)}</span>
                  <span className="text-slate-500">({ticketDetail.feedback.rating}/5)</span>
                </div>
                {ticketDetail.feedback.comment && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">"{ticketDetail.feedback.comment}"</p>
                )}
              </div>
            )}

            {/* Read Only Notice */}
            {ticketDetail?.escalated_to ? (
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="primary" onClick={() => openResolveModal(ticketDetail)}>
                  <Check className="w-4 h-4 mr-1" /> Resolve Escalated Ticket
                </Button>
                <Button variant="outline" onClick={() => setReassignModal({ isOpen: true, ticket: ticketDetail })}>
                  <UserCheck className="w-4 h-4 mr-1" /> Reassign
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={() => setReassignModal({ isOpen: true, ticket: ticketDetail })}>
                  <UserCheck className="w-4 h-4 mr-1" /> Reassign
                </Button>
              </div>
            )}
            
            {/* Ticket History/Timeline */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Activity History
              </h4>
              {historyLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : ticketHistory.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {ticketHistory.map((entry, idx) => {
                    const isEscalation = entry.new_status === 'escalated' || (entry.reason && entry.reason.toLowerCase().includes('escalated'))
                    return (
                      <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isEscalation ? 'bg-orange-100 dark:bg-orange-900/30' :
                          entry.new_status === 'resolved' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                          entry.new_status === 'in_progress' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {isEscalation ? (
                            <ArrowUpCircle className={`w-3 h-3 text-orange-600`} />
                          ) : entry.new_status === 'resolved' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : entry.new_status === 'in_progress' ? (
                            <PlayCircle className="w-3 h-3 text-amber-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-900 dark:text-white">
                              {isEscalation ? (
                                <span className="text-orange-600 dark:text-orange-400">{entry.reason || 'Escalated'}</span>
                              ) : (
                                <span>{entry.old_status} → {entry.new_status}</span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400">{getTimeAgo(entry.timestamp)}</span>
                          </div>
                          {entry.changed_by_name && (
                            <p className="text-[10px] text-slate-500">by {entry.changed_by_name}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No history available</p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Resolve Escalated Ticket Modal */}
      <Modal 
        isOpen={resolveModal.isOpen} 
        onClose={() => setResolveModal({ isOpen: false, ticket: null })} 
        title="Resolve Escalated Ticket"
        size="lg"
      >
        {resolveModal.ticket && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{resolveModal.ticket.subject}</p>
              <p className="text-xs text-slate-500 mt-1">
                Priority: {resolveModal.ticket.priority?.toUpperCase()} | 
                Escalation: {resolveModal.ticket.escalation_reason || 'Manual escalation'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Resolution Category *
              </label>
              <select
                value={resolutionCategory}
                onChange={(e) => setResolutionCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="fixed">Fixed - Issue resolved</option>
                <option value="wonfix">Won't Fix - Working as intended</option>
                <option value="duplicate">Duplicate - Already reported</option>
                <option value="info">Information - Provided guidance</option>
                <option value="escalated">Escalated - Handed to higher authority</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Resolution Notes *
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe how this issue was resolved..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Root Cause (Optional)
              </label>
              <Input
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="e.g., Configuration issue, Third-party API error"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button 
                variant="secondary" 
                onClick={() => setResolveModal({ isOpen: false, ticket: null })}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleResolveEscalated}
                disabled={!resolutionNotes.trim() || resolving}
              >
                {resolving ? 'Resolving...' : 'Resolve Ticket'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reassign Modal */}
      <Modal 
        isOpen={reassignModal.isOpen} 
        onClose={() => { setReassignModal({ isOpen: false, ticket: null }); setSelectedAgent('') }} 
        title="Reassign Ticket"
        size="md"
      >
        {reassignModal.ticket && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{reassignModal.ticket.subject}</p>
              <p className="text-xs text-slate-500 mt-1">
                Currently assigned to: {reassignModal.ticket.assigned_to_name || 'Unassigned'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Assign To *
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Select an agent...</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name} ({agent.support_tier?.toUpperCase()}) - {agent.current_ticket_count || 0} tickets
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button 
                variant="secondary" 
                onClick={() => { setReassignModal({ isOpen: false, ticket: null }); setSelectedAgent('') }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleReassign}
                disabled={!selectedAgent || reassigning}
              >
                {reassigning ? 'Reassigning...' : 'Reassign Ticket'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
