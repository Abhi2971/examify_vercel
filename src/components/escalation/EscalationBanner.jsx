import { AlertTriangle } from 'lucide-react'

export function EscalationBanner({ escalation, className = '' }) {
  if (!escalation) return null

  const tierColors = {
    l2: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
    l3: 'from-orange-500/20 to-red-500/20 border-orange-500/50',
    super_admin: 'from-red-500/20 to-purple-500/20 border-red-500/50'
  }

  const tierIcons = {
    l2: '→ L2',
    l3: '→ L3',
    super_admin: '→ Admin'
  }

  const tierIconColors = {
    l2: 'text-yellow-400',
    l3: 'text-orange-400',
    super_admin: 'text-red-400'
  }

  const targetTier = escalation.escalated_to_tier || escalation.target_tier

  return (
    <div className={`bg-gradient-to-r ${tierColors[targetTier] || tierColors.l2} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`flex-shrink-0 ${tierIconColors[targetTier]}`} size={20} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Ticket Escalated {tierIcons[targetTier]}</span>
          </div>
          {escalation.reason && (
            <p className="text-white/70 text-sm mt-1">
              <span className="font-medium">Reason:</span> {escalation.reason}
            </p>
          )}
          {escalation.created_at && (
            <p className="text-white/50 text-xs mt-1">
              Escalated on {new Date(escalation.created_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
