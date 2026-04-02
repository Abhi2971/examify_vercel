import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supportApi } from '../../../api/supportApi'
import { 
  MessageSquare, Clock, CheckCircle, BookOpen, TrendingUp,
  ArrowRight, Star, Users
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function L1Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [profile, setProfile] = useState(null)
  const [recentTickets, setRecentTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [statsData, profileData, ticketsData] = await Promise.all([
          supportApi.l1.getDashboardStats().catch(() => null),
          supportApi.l1.getProfile().catch(() => null),
          supportApi.l1.getTickets({ limit: 5 }).catch(() => null)
        ])

        setStats(statsData || {})
        setProfile(profileData || {})
        setRecentTickets(ticketsData?.data || ticketsData || [])
      } catch (err) {
        console.error('Failed to load dashboard:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
        {error}
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, subtext, color = 'cyan' }) => {
    const colorClasses = {
      cyan: 'from-[#00C4B4]/20 to-[#00E5FF]/10 border-[#00C4B4]/20',
      emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
      yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
      blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20'
    }

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/70 text-sm">{label}</p>
          <Icon className="text-white/50" size={20} />
        </div>
        <p className="text-3xl font-bold text-white">{value ?? 0}</p>
        {subtext && <p className="text-white/50 text-xs mt-1">{subtext}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'Agent'}
        </h1>
        <p className="text-white/70">Here's your support dashboard overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MessageSquare}
          label="Open Tickets"
          value={stats?.open_tickets || 0}
          subtext="Assigned to you"
          color="cyan"
        />
        <StatCard
          icon={CheckCircle}
          label="Resolved Today"
          value={stats?.resolved_today || 0}
          subtext="Completed"
          color="emerald"
        />
        <StatCard
          icon={Clock}
          label="Avg Resolution"
          value={`${stats?.avg_resolution_time || stats?.avg_resolution_hours || 0}h`}
          subtext="Per ticket"
          color="yellow"
        />
        <StatCard
          icon={BookOpen}
          label="Knowledge Base"
          value={stats?.kb_articles || 0}
          subtext="Articles available"
          color="blue"
        />
      </div>

      {/* Agent Performance - Dynamic from Profile API */}
      {profile && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Your Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white/70 text-sm mb-2">Tickets Handled</p>
              <p className="text-3xl font-bold text-white">{profile.tickets_handled || 0}</p>
              <p className="text-white/50 text-xs mt-1">Total resolved</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-2">Avg Response Time</p>
              <p className="text-3xl font-bold text-white">{profile.avg_resolution_time || 0}h</p>
              <p className="text-white/50 text-xs mt-1">Per ticket</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-2">Customer Satisfaction</p>
              <p className="text-3xl font-bold text-white">{profile.customer_satisfaction || 0}%</p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${profile.customer_satisfaction || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tickets */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-[#00C4B4]" size={20} />
            Recent Tickets
          </h2>
          <button
            onClick={() => navigate('/support/l1/tickets')}
            className="text-[#00C4B4] hover:text-[#00E5FF] text-sm flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            No tickets assigned to you
          </div>
        ) : (
          <div className="space-y-3">
            {recentTickets.slice(0, 5).map((ticket) => (
              <div
                key={ticket._id || ticket.id}
                onClick={() => navigate(`/support/l1/tickets/${ticket._id || ticket.id}`)}
                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00C4B4]/30 rounded-lg p-4 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/60 text-sm font-mono">
                        #{ticket.ticket_id || (ticket._id || '').toString().slice(-6)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                        ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                        ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {ticket.priority || 'low'}
                      </span>
                    </div>
                    <h3 className="text-white font-medium truncate">{ticket.subject || ticket.title}</h3>
                    <p className="text-white/50 text-sm mt-1">{ticket.category || 'General'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-blue-500/20 text-blue-300' :
                      ticket.status === 'in_progress' ? 'bg-purple-500/20 text-purple-300' :
                      ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {ticket.status?.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/support/l1/knowledge-base')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left transition-all group"
        >
          <BookOpen className="text-[#00C4B4] mb-3 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-white font-semibold mb-1">Knowledge Base</h3>
          <p className="text-white/60 text-sm">Browse articles and solutions</p>
        </button>
        <button
          onClick={() => navigate('/support/l1/settings')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left transition-all group"
        >
          <Users className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-white font-semibold mb-1">Profile & Settings</h3>
          <p className="text-white/60 text-sm">Update your preferences</p>
        </button>
      </div>
    </div>
  )
}