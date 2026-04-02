import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supportApi } from '../../api/supportApi'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeft, Clock, User, Building2, Mail, Phone,
  Send, Paperclip, MoreVertical, AlertTriangle, 
  CheckCircle2, XCircle, ArrowUpRight, Tag, History,
  MessageSquare, ChevronDown, Shield, Zap, ArrowUp, Lock
} from 'lucide-react'
import { EscalateModal } from '../../../components/escalation/EscalateModal'
import { EscalationBanner } from '../../../components/escalation/EscalationBanner'

const PRIORITY_CONFIG = {
  urgent: { color: 'bg-[#FF5733]', text: 'text-[#FF5733]', border: 'border-[#FF5733]', label: 'Urgent' },
  high: { color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', label: 'High' },
  medium: { color: 'bg-[#FFB800]', text: 'text-[#FFB800]', border: 'border-[#FFB800]', label: 'Medium' },
  low: { color: 'bg-green-500', text: 'text-green-400', border: 'border-green-500', label: 'Low' }
}

const STATUS_CONFIG = {
  open: { color: 'bg-blue-500', text: 'text-blue-400', label: 'Open' },
  in_progress: { color: 'bg-[#FFB800]', text: 'text-[#FFB800]', label: 'In Progress' },
  waiting_customer: { color: 'bg-purple-500', text: 'text-purple-400', label: 'Waiting for Customer' },
  resolved: { color: 'bg-green-500', text: 'text-green-400', label: 'Resolved' },
  closed: { color: 'bg-gray-500', text: 'text-gray-400', label: 'Closed' }
}

const TIER_LABELS = { l1: 'L1', l2: 'L2', l3: 'L3', super_admin: 'Super Admin' }

export function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [showEscalate, setShowEscalate] = useState(false)
  const [escalateReason, setEscalateReason] = useState('')
  const [cannedResponses, setCannedResponses] = useState([])
  const [showCanned, setShowCanned] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showEscalateModal, setShowEscalateModal] = useState(false)
  const [isEscalating, setIsEscalating] = useState(false)

  const myTier = user?.support_tier || 'l1'
  const ticketTier = ticket?.support_tier_required || ticket?.current_tier || 'l1'
  
  // Check if current user can operate on this ticket
  const canOperate = () => {
    if (!ticket) return false
    // If ticket is escalated to higher tier, lower tiers cannot operate
    const tierOrder = { l1: 1, l2: 2, l3: 3, super_admin: 4 }
    const myLevel = tierOrder[myTier] || 1
    const ticketLevel = tierOrder[ticketTier] || 1
    return myLevel >= ticketLevel
  }

  // Escalate button only visible when ticket is in_progress
  const canEscalate = () => {
    if (!ticket) return false
    return ticket.status === 'in_progress' && canOperate()
  }

  const getNextEscalationTier = () => {
    if (myTier === 'l1') return 'l2'
    if (myTier === 'l2') return 'l3'
    if (myTier === 'l3') return 'super_admin'
    return null
  }

  useEffect(() => {
    loadTicket()
    loadCannedResponses()
  }, [id])

  const loadTicket = async () => {
    try {
      setLoading(true)
      const data = await supportApi.getTicketDetail(id)
      setTicket(data)
    } catch (err) {
      console.error('Failed to load ticket:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCannedResponses = async () => {
    try {
      const data = await supportApi.getCannedResponses()
      setCannedResponses(Array.isArray(data) ? data : data.responses || [])
    } catch (err) {
      console.error('Failed to load canned responses:', err)
    }
  }

  const loadHistory = async () => {
    try {
      const data = await supportApi.getTicketHistory(id)
      setHistory(Array.isArray(data) ? data : data.history || [])
      setShowHistory(true)
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  const handleEscalate = async ({ ticketId, reason, notes, targetTier }) => {
    try {
      setIsEscalating(true)
      const currentTier = user?.support_tier || 'l1'
      
      if (currentTier === 'l1') {
        await supportApi.l1.escalateTicket(ticketId, reason, notes)
      } else if (currentTier === 'l2') {
        await supportApi.l2.escalateToL3(ticketId, reason, notes)
      } else if (currentTier === 'l3') {
        await supportApi.l3.escalateToSuperAdmin(ticketId, reason, notes)
      }
      
      toast.success(`Ticket escalated to ${targetTier}`)
      setShowEscalateModal(false)
      loadTicket()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to escalate ticket')
    } finally {
      setIsEscalating(false)
    }
  }

  const canEscalate = () => {
    const tier = user?.support_tier || 'l1'
    const ticketTier = ticket?.escalated_to || 'l1'
    return ticketTier === tier || !ticketTier
  }

  const getNextTier = () => {
    const tier = user?.support_tier || 'l1'
    const tierMap = { l1: 'l2', l2: 'l3', l3: 'super_admin' }
    return tierMap[tier] || 'l2'
  }

  const handleReply = async () => {
    if (!reply.trim() || !canOperate()) return
    try {
      setSending(true)
      await supportApi.replyToTicket(id, reply, isInternal)
      setReply('')
      setIsInternal(false)
      loadTicket()
    } catch (err) {
      console.error('Failed to send reply:', err)
    } finally {
      setSending(false)
    }
  }

  const handleStatusChange = async (status) => {
    if (!canOperate()) return
    try {
      await supportApi.updateTicketStatus(id, status)
      loadTicket()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleEscalate = async () => {
    if (!canEscalate()) return
    const nextTier = getNextEscalationTier()
    if (!nextTier) return
    
    try {
      await supportApi.escalateTicket(id, nextTier, escalateReason)
      setShowEscalate(false)
      setEscalateReason('')
      loadTicket()
    } catch (err) {
      console.error('Failed to escalate:', err)
    }
  }

  const insertCannedResponse = async (response) => {
    setReply(prev => prev + (prev ? '\n\n' : '') + response.content)
    setShowCanned(false)
    try {
      await supportApi.useCannedResponse(response._id || response.id)
    } catch (err) {}
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <XCircle className="w-16 h-16 text-[#FF5733]/50 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-[#F0F6FF]">Ticket not found</h2>
        <Link to="/support/tickets" className="text-[#00C4B4] hover:underline mt-2 inline-block">
          Back to tickets
        </Link>
      </div>
    )
  }

  const priority = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium
  const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
  const isReadOnly = !canOperate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F0F6FF]/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#F0F6FF]/50">#{ticket.ticket_number || id.slice(-8)}</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color} text-white`}>
                {status.label}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${priority.border} ${priority.text}`}>
                {priority.label}
              </span>
              {ticket.escalated_to && (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#FF5733]/20 text-[#FF5733] border border-[#FF5733]/30 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Escalated to {TIER_LABELS[ticket.escalated_to]}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-[#F0F6FF] mt-2">{ticket.subject}</h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {canEscalate() && (
            <button
              onClick={() => setShowEscalate(true)}
              className="px-4 py-2 bg-[#FF5733]/20 text-[#FF5733] border border-[#FF5733]/30 rounded-xl hover:bg-[#FF5733]/30 transition-colors flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              Escalate to {TIER_LABELS[getNextEscalationTier()]}
            </button>
          )}
          
          <button
            onClick={loadHistory}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F0F6FF]/70 transition-colors"
            title="View History"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Read-only warning */}
      {isReadOnly && (
        <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#FFB800]" />
          <p className="text-[#FFB800] text-sm">
            This ticket has been escalated to {TIER_LABELS[ticketTier]}. You can view but not modify it.
          </p>
        </div>
      )}

      {ticket?.escalated_to && (
        <EscalationBanner 
          escalation={{
            escalated_to_tier: ticket.escalated_to,
            reason: ticket.escalation_reason,
            created_at: ticket.escalated_at
          }} 
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Message */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C4B4] to-[#00E5FF] flex items-center justify-center text-[#081120] font-bold">
                {ticket.user_name?.[0] || ticket.user_email?.[0] || 'U'}
              </div>
              <div>
                <p className="font-medium text-[#F0F6FF]">{ticket.user_name || 'User'}</p>
                <p className="text-xs text-[#F0F6FF]/50">{formatDate(ticket.created_at)}</p>
              </div>
            </div>
            <div className="text-[#F0F6FF]/80 whitespace-pre-wrap">{ticket.description || ticket.message}</div>
          </div>

          <div className="flex gap-2 mt-4">
            {canEscalate() && (
              <button
                onClick={() => setShowEscalateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg text-yellow-300 transition-colors"
              >
                <ArrowUp size={16} />
                Escalate to {getNextTier().toUpperCase()}
              </button>
            )}
            
            {ticket?.escalated_to && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-white/60">
                <Lock size={16} />
                <span className="text-sm">Escalated to {ticket.escalated_to.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Responses */}
          {ticket.responses?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#F0F6FF]/50 uppercase tracking-wider">Responses</h3>
              {ticket.responses.map((response, idx) => (
                <div 
                  key={idx}
                  className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 ${
                    response.is_internal 
                      ? 'border-[#FFB800]/30 bg-[#FFB800]/5' 
                      : 'border-white/10'
                  }`}
                >
                  {response.is_internal && (
                    <span className="text-xs text-[#FFB800] font-medium mb-2 block">Internal Note</span>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      response.is_agent 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' 
                        : 'bg-gradient-to-br from-[#00C4B4] to-[#00E5FF] text-[#081120]'
                    }`}>
                      {response.agent_name?.[0] || response.user_name?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-[#F0F6FF]">
                        {response.agent_name || response.user_name || 'Agent'}
                        {response.is_agent && <span className="text-xs text-purple-400 ml-2">Support Agent</span>}
                      </p>
                      <p className="text-xs text-[#F0F6FF]/50">{formatDate(response.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-[#F0F6FF]/80 whitespace-pre-wrap">{response.message}</div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Box */}
          {!isReadOnly && ticket.status !== 'closed' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#F0F6FF]">Reply</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#FFB800] focus:ring-[#FFB800]"
                    />
                    <span className="text-sm text-[#FFB800]">Internal Note</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCanned(!showCanned)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#F0F6FF]/70 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      Canned
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {showCanned && cannedResponses.length > 0 && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-[#0d1829] border border-white/10 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                        {cannedResponses.map(cr => (
                          <button
                            key={cr._id || cr.id}
                            onClick={() => insertCannedResponse(cr)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0"
                          >
                            <p className="font-medium text-[#F0F6FF] text-sm">{cr.title}</p>
                            <p className="text-xs text-[#F0F6FF]/50 truncate">{cr.content}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F0F6FF] placeholder:text-[#F0F6FF]/30 focus:outline-none focus:border-[#00C4B4]/50 resize-none"
              />
              
              <div className="flex items-center justify-between mt-4">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#F0F6FF]/70 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReply}
                  disabled={!reply.trim() || sending}
                  className="px-6 py-2 bg-gradient-to-r from-[#00C4B4] to-[#00E5FF] text-[#081120] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00C4B4]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold text-[#F0F6FF] mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#F0F6FF]/50" />
                <span className="text-[#F0F6FF]">{ticket.user_name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F0F6FF]/50" />
                <span className="text-[#F0F6FF] text-sm">{ticket.user_email || 'N/A'}</span>
              </div>
              {ticket.institute_name && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-[#F0F6FF]/50" />
                  <span className="text-[#F0F6FF] text-sm">{ticket.institute_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Actions */}
          {!isReadOnly && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[#F0F6FF] mb-4">Update Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(key)}
                    disabled={ticket.status === key}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      ticket.status === key
                        ? `${cfg.color} text-white border-transparent`
                        : 'bg-white/5 border-white/10 text-[#F0F6FF]/70 hover:bg-white/10'
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ticket Info */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold text-[#F0F6FF] mb-4">Ticket Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#F0F6FF]/50">Created</span>
                <span className="text-[#F0F6FF]">{formatDate(ticket.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F0F6FF]/50">Category</span>
                <span className="text-[#F0F6FF]">{ticket.category || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F0F6FF]/50">Assigned To</span>
                <span className="text-[#F0F6FF]">{ticket.assigned_to_name || 'Unassigned'}</span>
              </div>
              {ticket.tags?.length > 0 && (
                <div>
                  <span className="text-[#F0F6FF]/50 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-white/10 text-[#F0F6FF]/70 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Escalate Modal */}
      {showEscalate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1829] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-[#F0F6FF] mb-4">
              Escalate to {TIER_LABELS[getNextEscalationTier()]}
            </h3>
            <p className="text-sm text-[#F0F6FF]/50 mb-4">
              Once escalated, you will no longer be able to modify this ticket.
            </p>
            <textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="Reason for escalation (optional)..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F0F6FF] placeholder:text-[#F0F6FF]/30 focus:outline-none focus:border-[#00C4B4]/50 resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEscalate(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[#F0F6FF]/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                className="px-4 py-2 bg-[#FF5733] hover:bg-[#FF5733]/80 text-white font-semibold rounded-xl transition-colors"
              >
                Escalate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1829] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#F0F6FF]">Ticket History</h3>
              <button onClick={() => setShowHistory(false)} className="text-[#F0F6FF]/50 hover:text-[#F0F6FF]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-[#F0F6FF]/50 text-center py-8">No history available</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00C4B4] mt-2" />
                    <div>
                      <p className="text-sm text-[#F0F6FF]">{item.action || item.description}</p>
                      <p className="text-xs text-[#F0F6FF]/50">{formatDate(item.created_at || item.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <EscalateModal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        onEscalate={handleEscalate}
        ticketId={ticket?._id || ticket?.id}
        currentTier={(user?.support_tier || 'l1').toUpperCase()}
        targetTier={getNextTier().toUpperCase()}
        isLoading={isEscalating}
      />
    </div>
  )
}
