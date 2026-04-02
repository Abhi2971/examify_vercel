import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supportApi } from '../../api/supportApi'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { toast } from 'react-hot-toast'
import {
  Search, Ticket, Filter, UserCheck, RefreshCw, CheckSquare, Square,
  ArrowUpCircle, Loader2, Users
} from 'lucide-react'

const priorityConfig = {
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', dot: 'bg-slate-400' },
}

const categoryConfig = {
  technical: { label: 'Technical', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  billing: { label: 'Billing', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
  general: { label: 'General', color: 'text-slate-600 bg-slate-100 dark:bg-slate-700' },
  exam: { label: 'Exam', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  login: { label: 'Login', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function AssignmentQueuePage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedTickets, setSelectedTickets] = useState([])
  const [agents, setAgents] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showManualAssignModal, setShowManualAssignModal] = useState(false)
  const [bulkAssigning, setBulkAssigning] = useState(false)
  const [autoAssigning, setAutoAssigning] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const data = await supportApi.getUnassignedTickets()
      setTickets(data || [])
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const data = await supportApi.getAgents()
      setAgents(data || [])
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  useEffect(() => {
    fetchTickets()
    fetchAgents()
  }, [])

  useEffect(() => {
    setShowBulkActions(selectedTickets.length > 0)
  }, [selectedTickets])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = search === '' || 
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.requester_name?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.ticket_id?.toString().includes(search)
    
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    
    return matchesSearch && matchesPriority && matchesCategory
  })

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([])
    } else {
      setSelectedTickets(filteredTickets.map(t => t.ticket_id))
    }
  }

  const handleAutoAssign = async (ticketId) => {
    try {
      setAutoAssigning(ticketId)
      await supportApi.autoAssignSingle(ticketId)
      toast.success('Ticket auto-assigned successfully')
      fetchTickets()
      setSelectedTickets(prev => prev.filter(id => id !== ticketId))
    } catch (error) {
      console.error('Auto assign failed:', error)
      toast.error(error.response?.data?.message || 'Failed to auto-assign ticket')
    } finally {
      setAutoAssigning(null)
    }
  }

  const handleAutoAssignAll = async () => {
    try {
      setBulkAssigning(true)
      const result = await supportApi.autoAssignAll(selectedTickets.length > 0 ? selectedTickets : null)
      toast.success(`Auto-assigned ${result.assigned_count || selectedTickets.length} tickets`)
      fetchTickets()
      setSelectedTickets([])
    } catch (error) {
      console.error('Auto assign all failed:', error)
      toast.error(error.response?.data?.message || 'Failed to auto-assign tickets')
    } finally {
      setBulkAssigning(false)
    }
  }

  const handleManualAssign = async (ticketId, agentId) => {
    try {
      await supportApi.manualAssign(ticketId, agentId)
      toast.success('Ticket assigned successfully')
      fetchTickets()
      setSelectedTickets(prev => prev.filter(id => id !== ticketId))
      setOpenDropdown(null)
    } catch (error) {
      console.error('Manual assign failed:', error)
      toast.error(error.response?.data?.message || 'Failed to assign ticket')
    }
  }

  const handleBulkManualAssign = async (agentId) => {
    try {
      setBulkAssigning(true)
      for (const ticketId of selectedTickets) {
        await supportApi.manualAssign(ticketId, agentId)
      }
      toast.success(`Assigned ${selectedTickets.length} tickets`)
      fetchTickets()
      setSelectedTickets([])
      setShowManualAssignModal(false)
    } catch (error) {
      console.error('Bulk manual assign failed:', error)
      toast.error(error.response?.data?.message || 'Failed to assign tickets')
    } finally {
      setBulkAssigning(false)
    }
  }

  const groupedAgents = {
    l2: agents.filter(a => a.support_tier === 'l2'),
    l1: agents.filter(a => a.support_tier === 'l1' || !a.support_tier),
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Assignment Queue</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">{tickets.length} unassigned tickets</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="general">General</option>
            <option value="exam">Exam</option>
            <option value="login">Login</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="gap-2"
          >
            {selectedTickets.length === filteredTickets.length ? <Square className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchTickets}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500">
            <Ticket className="w-12 h-12 mb-2 text-slate-300" />
            <p>No unassigned tickets</p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const priority = priorityConfig[ticket.priority] || priorityConfig.medium
            const category = categoryConfig[ticket.category] || categoryConfig.general
            const isSelected = selectedTickets.includes(ticket.ticket_id)
            
            return (
              <div
                key={ticket.ticket_id}
                className={`bg-white dark:bg-slate-800 border rounded-lg p-4 transition-all ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleSelectTicket(ticket.ticket_id)}
                    className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isSelected ? <CheckSquare className="w-5 h-5 text-blue-500" /> : <Square className="w-5 h-5" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priority.color}`}>
                        {priority.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${category.color} text-slate-700 dark:text-slate-300`}>
                        {category.label}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">
                        {formatTimeAgo(ticket.created_at)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1 truncate">
                      {ticket.subject}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {ticket.requester_name} {ticket.requester_email && `(${ticket.requester_email})`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3 ml-8">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAutoAssign(ticket.ticket_id)}
                    disabled={autoAssigning === ticket.ticket_id}
                    className="gap-1"
                  >
                    {autoAssigning === ticket.ticket_id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <ArrowUpCircle className="w-3 h-3" />
                    )}
                    Auto Assign
                  </Button>
                  
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOpenDropdown(openDropdown === ticket.ticket_id ? null : ticket.ticket_id)}
                      className="gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      Manual Assign
                    </Button>
                    
                    {openDropdown === ticket.ticket_id && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 py-1">
                        {agents.length === 0 ? (
                          <p className="px-3 py-2 text-xs text-slate-500">No agents available</p>
                        ) : (
                          <>
                            {groupedAgents.l2.length > 0 && (
                              <div className="px-3 py-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase">L2 Agents</p>
                              </div>
                            )}
                            {groupedAgents.l2.map(agent => (
                              <button
                                key={agent.id}
                                onClick={() => handleManualAssign(ticket.ticket_id, agent.id)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                              >
                                <span className="text-slate-900 dark:text-white">{agent.name}</span>
                                <span className="text-xs text-slate-400">
                                  {agent.current_tickets || 0} tickets
                                </span>
                              </button>
                            ))}
                            {groupedAgents.l1.length > 0 && (
                              <div className="px-3 py-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase">L1 Agents</p>
                              </div>
                            )}
                            {groupedAgents.l1.map(agent => (
                              <button
                                key={agent.id}
                                onClick={() => handleManualAssign(ticket.ticket_id, agent.id)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                              >
                                <span className="text-slate-900 dark:text-white">{agent.name}</span>
                                <span className="text-xs text-slate-400">
                                  {agent.current_tickets || 0} tickets
                                </span>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {showBulkActions && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
          <span className="text-sm font-medium">{selectedTickets.length} selected</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAutoAssignAll}
            disabled={bulkAssigning}
            className="gap-1 bg-slate-700 hover:bg-slate-600 border-slate-600"
          >
            {bulkAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpCircle className="w-4 h-4" />}
            Auto Assign All ({selectedTickets.length})
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowManualAssignModal(true)}
            disabled={bulkAssigning}
            className="gap-1 bg-slate-700 hover:bg-slate-600 border-slate-600"
          >
            <UserCheck className="w-4 h-4" />
            Manual Assign All
          </Button>
          <button
            onClick={() => setSelectedTickets([])}
            className="p-1 hover:bg-slate-700 rounded"
          >
            ✕
          </button>
        </div>
      )}

      <Modal
        isOpen={showManualAssignModal}
        onClose={() => setShowManualAssignModal(false)}
        title="Manual Assign All"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Assign {selectedTickets.length} tickets to an agent:
          </p>
          
          {agents.length === 0 ? (
            <p className="text-sm text-slate-500">No agents available</p>
          ) : (
            <>
              {groupedAgents.l2.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">L2 Agents</h4>
                  <div className="space-y-2">
                    {groupedAgents.l2.map(agent => (
                      <button
                        key={agent.id}
                        onClick={() => handleBulkManualAssign(agent.id)}
                        disabled={bulkAssigning}
                        className="w-full px-4 py-3 text-left border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between disabled:opacity-50"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{agent.name}</p>
                          <p className="text-xs text-slate-500">{agent.email}</p>
                        </div>
                        <Badge variant="secondary">{agent.current_tickets || 0} tickets</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {groupedAgents.l1.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">L1 Agents</h4>
                  <div className="space-y-2">
                    {groupedAgents.l1.map(agent => (
                      <button
                        key={agent.id}
                        onClick={() => handleBulkManualAssign(agent.id)}
                        disabled={bulkAssigning}
                        className="w-full px-4 py-3 text-left border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between disabled:opacity-50"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{agent.name}</p>
                          <p className="text-xs text-slate-500">{agent.email}</p>
                        </div>
                        <Badge variant="secondary">{agent.current_tickets || 0} tickets</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {bulkAssigning && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm text-slate-500">Assigning tickets...</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
