import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

const ESCALATION_REASONS = {
  'technical-issue': 'Technical Issue - Requires deeper technical investigation',
  'customer-request': 'Customer Request - Customer specifically requested escalation',
  'system-change': 'System Change - Requires infrastructure/code change',
  'billing-issue': 'Billing Issue - Requires billing/administrative access',
  'critical-bug': 'Critical Bug - Affects multiple customers',
  'other': 'Other - See notes for details'
}

export function EscalateModal({ 
  isOpen, 
  onClose, 
  onEscalate, 
  ticketId,
  currentTier,
  targetTier,
  isLoading = false 
}) {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason) return
    onEscalate({ ticketId, reason, notes, targetTier })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <AlertTriangle className="text-yellow-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Escalate Ticket</h2>
            <p className="text-white/60 text-sm">
              {currentTier} → {targetTier}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Reason for Escalation *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              required
            >
              <option value="">Select a reason...</option>
              {Object.entries(ESCALATION_REASONS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any additional context for the receiving tier..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 resize-none"
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-200 text-sm">
              After escalation, you will be able to view but not modify this ticket.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason || isLoading}
              className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-500/50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
            >
              {isLoading ? 'Escalating...' : 'Escalate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}