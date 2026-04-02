import { useEffect, useState } from 'react'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { 
  MessageSquare, Plus, Search, Filter, Send, Clock, User, 
  CheckCircle, AlertTriangle, Eye, ChevronLeft, ChevronRight, 
  Ticket, XCircle
} from 'lucide-react'

const ITEMS_PER_PAGE = 10

const statusConfig = {
  open: { label: 'Open', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  closed: { label: 'Closed', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
}

export function CollegeTicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 })
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketDetail, setTicketDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [replying, setReplying] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  })
  const [createErrors, setCreateErrors] = useState({})
  const [creating, setCreating] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchTickets()
  }, [pagination.page, searchQuery, statusFilter])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }
      const data = await collegeAdminApi.getTickets(params)
      setTickets(data.data || [])
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / ITEMS_PER_PAGE)
      }))
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket)
    setDetailLoading(true)
    try {
      const data = await collegeAdminApi.getTicketDetail(ticket.id)
      setTicketDetail(data)
    } catch (error) {
      console.error('Failed to fetch ticket details:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return
    try {
      setReplying(true)
      await collegeAdminApi.replyToTicket(selectedTicket.id, replyMessage)
      setReplyMessage('')
      handleViewTicket(selectedTicket)
      fetchTickets()
    } catch (error) {
      console.error('Failed to send reply:', error)
    } finally {
      setReplying(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!createFormData.subject.trim()) errors.subject = 'Subject is required'
    if (!createFormData.description.trim()) errors.description = 'Description is required'

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors)
      return
    }

    try {
      setCreating(true)
      await collegeAdminApi.createTicket(createFormData)
      setIsCreateModalOpen(false)
      setCreateFormData({ subject: '', description: '', priority: 'medium' })
      setCreateErrors({})
      fetchTickets()
    } catch (error) {
      console.error('Failed to create ticket:', error)
      setCreateErrors({ submit: error.response?.data?.message || 'Failed to create ticket' })
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatTimeAgo = (date) => {
    if (!date) return ''
    const now = new Date()
    const d = new Date(date)
    const diff = now - d
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.open
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const filteredTickets = tickets.filter(ticket => {
    if (!searchInput) return true
    const searchLower = searchInput.toLowerCase()
    return (
      ticket.subject?.toLowerCase().includes(searchLower) ||
      ticket.description?.toLowerCase().includes(searchLower) ||
      ticket.raised_by_name?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage support tickets from students and teachers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create Ticket
        </Button>
      </div>

      <Card>
        <CardBody className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tickets..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Raised By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No tickets found</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{ticket.subject}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{ticket.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{ticket.raised_by_name || 'Unknown'}</span>
                      </div>
                      {ticket.raised_by_role && (
                        <Badge variant="secondary" size="sm" className="mt-1">{ticket.raised_by_role}</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.assigned_to_name ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">{ticket.assigned_to_name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(ticket.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && tickets.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((pagination.page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} tickets
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!selectedTicket}
        onClose={() => {
          setSelectedTicket(null)
          setTicketDetail(null)
          setReplyMessage('')
        }}
        title="Ticket Details"
        size="lg"
      >
        {detailLoading ? (
          <div className="p-8 text-center">
            <Skeleton className="h-32 mx-auto w-full max-w-md" />
          </div>
        ) : ticketDetail ? (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedTicket?.status === 'open' ? 'bg-red-100 dark:bg-red-900/30' :
                selectedTicket?.status === 'in_progress' ? 'bg-amber-100 dark:bg-amber-900/30' :
                'bg-emerald-100 dark:bg-emerald-900/30'
              }`}>
                <MessageSquare className={`w-6 h-6 ${
                  selectedTicket?.status === 'open' ? 'text-red-600' :
                  selectedTicket?.status === 'in_progress' ? 'text-amber-600' :
                  'text-emerald-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {getStatusBadge(ticketDetail.status || selectedTicket?.status)}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {ticketDetail.subject || selectedTicket?.subject}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  #{ticketDetail.id || selectedTicket?.id} • Created {formatDate(ticketDetail.created_at || selectedTicket?.created_at)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 mb-2">Description</p>
              <p className="text-slate-900 dark:text-white">
                {ticketDetail.description || selectedTicket?.description}
              </p>
            </div>

            {ticketDetail.raised_by && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Raised By
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Name</p>
                    <p className="font-medium text-slate-900 dark:text-white">{ticketDetail.raised_by.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{ticketDetail.raised_by.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Role</p>
                    <Badge variant="secondary" size="sm">{ticketDetail.raised_by.role}</Badge>
                  </div>
                </div>
              </div>
            )}

            {ticketDetail.assigned_to && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Assigned To
                </p>
                <p className="text-slate-900 dark:text-white">{ticketDetail.assigned_to.name}</p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Conversation ({ticketDetail.messages?.length || 0})
              </p>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {ticketDetail.messages?.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-xl ${
                    msg.sender_role === 'admin' || msg.sender_role === 'college_admin' 
                      ? 'bg-blue-50 dark:bg-blue-900/20' : 
                      'bg-slate-50 dark:bg-slate-800/50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-900 dark:text-white">{msg.sender_name}</span>
                        <Badge variant={msg.sender_role === 'admin' || msg.sender_role === 'college_admin' ? 'primary' : 'secondary'} size="sm">
                          {msg.sender_role}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400">{formatTimeAgo(msg.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{msg.message}</p>
                  </div>
                ))}
                {(!ticketDetail.messages || ticketDetail.messages.length === 0) && (
                  <p className="text-sm text-slate-400 text-center py-4">No messages yet</p>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Reply
              </p>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleReply} 
                  disabled={!replyMessage.trim()} 
                  loading={replying}
                >
                  <Send className="w-4 h-4 mr-2" /> Send Reply
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setCreateFormData({ subject: '', description: '', priority: 'medium' })
          setCreateErrors({})
        }}
        title="Create New Ticket"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Subject"
            placeholder="Enter ticket subject"
            value={createFormData.subject}
            onChange={(e) => setCreateFormData({ ...createFormData, subject: e.target.value })}
            error={createErrors.subject}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Describe your issue in detail..."
              value={createFormData.description}
              onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
            />
            {createErrors.description && (
              <p className="mt-1.5 text-sm text-red-500">{createErrors.description}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Priority
            </label>
            <select
              value={createFormData.priority}
              onChange={(e) => setCreateFormData({ ...createFormData, priority: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          {createErrors.submit && (
            <p className="text-sm text-red-500">{createErrors.submit}</p>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setCreateFormData({ subject: '', description: '', priority: 'medium' })
                setCreateErrors({})
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
