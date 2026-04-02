import { useEffect, useState } from 'react'
import { supportApi } from '../../../api/supportApi'
import { Modal } from '../../../components/ui/Modal'
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

/**
 * L3EscalationQueuePage - Escalation management
 * Manage pending escalations with review, resolve, and reject actions
 */
export function L3EscalationQueuePage() {
  const [escalations, setEscalations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedEscalation, setSelectedEscalation] = useState(null)
  const [reviewStatus, setReviewStatus] = useState('reviewed')
  const [reviewNotes, setReviewNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadEscalations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await supportApi.l3.getEscalationQueue({ status: statusFilter, priority: priorityFilter !== 'all' ? priorityFilter : null })
        setEscalations(response || [])
      } catch (err) {
        console.error('Failed to load escalations:', err)
        setError('Failed to load escalations')
      } finally {
        setLoading(false)
      }
    }

    loadEscalations()
  }, [statusFilter, priorityFilter])

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-500/20 text-red-400',
      high: 'bg-orange-500/20 text-orange-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-gray-500/20 text-gray-400'
    }
    return colors[priority] || colors.low
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-blue-500/20 text-blue-400',
      reviewed: 'bg-purple-500/20 text-purple-400',
      resolved: 'bg-emerald-500/20 text-emerald-400',
      rejected: 'bg-red-500/20 text-red-400'
    }
    return colors[status] || colors.pending
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getTimeAgo = (date) => {
    if (!date) return 'N/A'
    const now = new Date()
    const then = new Date(date)
    const seconds = Math.floor((now - then) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const openReviewModal = (escalation, newStatus) => {
    setSelectedEscalation(escalation)
    setReviewStatus(newStatus)
    setReviewNotes('')
    setShowReviewModal(true)
  }

  const closeReviewModal = () => {
    setShowReviewModal(false)
    setSelectedEscalation(null)
    setReviewStatus('reviewed')
    setReviewNotes('')
  }

  const handleReview = async () => {
    if (!selectedEscalation) return

    try {
      setSubmitting(true)
      await supportApi.l3.reviewEscalation(selectedEscalation.id || selectedEscalation._id, {
        status: reviewStatus,
        review_notes: reviewNotes
      })

      // Update local state
      setEscalations(prev =>
        prev.map(e => e.id === selectedEscalation.id || e._id === selectedEscalation._id
          ? { ...e, status: reviewStatus, review_notes: reviewNotes }
          : e
        ).filter(e => statusFilter === 'all' || e.status === statusFilter)
      )

      closeReviewModal()
    } catch (err) {
      console.error('Failed to review escalation:', err)
      alert('Failed to review escalation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && escalations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="text-red-400" size={20} />
        <span className="text-red-400">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Escalation Queue</h1>
        <p className="text-white/70">Review and manage pending escalations ({escalations.length})</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All Status</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent Only</option>
          <option value="high">High Only</option>
          <option value="medium">Medium Only</option>
          <option value="low">Low Only</option>
        </select>
      </div>

      {/* Escalations List */}
      {escalations.length > 0 ? (
        <div className="space-y-4">
          {escalations.map((escalation, idx) => (
            <div
              key={escalation.id || escalation._id || idx}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <p className="text-white/70 text-sm">Escalation ID</p>
                      <p className="font-mono text-purple-400 font-medium">
                        #{(escalation.id || escalation._id || '').toString().slice(0, 8)}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(escalation.priority)}`}>
                        {escalation.priority || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(escalation.status)}`}>
                        {escalation.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/80">
                    <span className="text-white/60">Ticket: </span>
                    <span className="font-mono text-cyan-400">#{(escalation.ticket_id || '').toString().slice(0, 8)}</span>
                  </p>
                  <p className="text-white/80 text-sm mt-2">
                    <span className="text-white/60">Reason: </span>{escalation.reason || 'Not specified'}
                  </p>
                </div>
                <div className="text-sm text-white/70 space-y-2">
                  <p>
                    <span className="text-white/60">Created: </span>{formatDate(escalation.created_at)}{' '}
                    <span className="text-white/50">({getTimeAgo(escalation.created_at)})</span>
                  </p>
                  {escalation.reviewed_at && (
                    <p>
                      <span className="text-white/60">Reviewed: </span>{formatDate(escalation.reviewed_at)}
                    </p>
                  )}
                  {escalation.resolved_at && (
                    <p>
                      <span className="text-white/60">Resolved: </span>{formatDate(escalation.resolved_at)}
                    </p>
                  )}
                  {escalation.notes && (
                    <p className="bg-white/5 rounded px-3 py-2">
                      <span className="text-white/60 block text-xs mb-1">Notes:</span>
                      {escalation.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {escalation.status === 'pending' && (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => openReviewModal(escalation, 'reviewed')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    Review
                  </button>
                  <button
                    onClick={() => openReviewModal(escalation, 'resolved')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    Resolve
                  </button>
                  <button
                    onClick={() => openReviewModal(escalation, 'rejected')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <AlertCircle size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/70">No escalations found</p>
        </div>
      )}

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={closeReviewModal} title="Review Escalation">
        <div className="space-y-4">
          {selectedEscalation && (
            <>
              <div className="text-white/80 text-sm">
                <p>Ticket: <span className="font-mono text-cyan-400">#{(selectedEscalation.ticket_id || '').toString().slice(0, 8)}</span></p>
                <p>Current Status: <span className="font-medium capitalize">{selectedEscalation.status}</span></p>
                <p>Priority: <span className="font-medium capitalize">{selectedEscalation.priority}</span></p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">New Status</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
                >
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows="4"
                  placeholder="Add notes about this escalation..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={closeReviewModal}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReview}
              disabled={submitting}
              className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors"
            >
              {submitting ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
