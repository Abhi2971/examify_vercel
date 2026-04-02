import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supportApi } from '../../../api/supportApi'
import { 
  Users, MessageSquare, Clock, CheckCircle, AlertTriangle,
  TrendingUp, ArrowRight, BarChart3
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function L2Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [teamView, setTeamView] = useState(null)
  const [agentPerformance, setAgentPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [statsData, teamData, perfData] = await Promise.all([
          supportApi.l2.getDashboardStats().catch(() => null),
          supportApi.l2.getTeamView().catch(() => null),
          supportApi.l2.getReportsAgentPerformance().catch(() => null)
        ])

        setStats(statsData || {})
        setTeamView(teamData || {})
        setAgentPerformance(perfData || {})
      } catch (err) {
        console.error('Failed to load L2 dashboard:', err)
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
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
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

  const StatCard = ({ icon: Icon, label, value, subtext, color = 'purple', warning = false }) => {
    const colorClasses = {
      purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
      cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
      emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
      orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20',
      red: 'from-red-500/20 to-red-600/10 border-red-500/20'
    }

    const iconColors = {
      purple: 'text-purple-400',
      cyan: 'text-cyan-400',
      emerald: 'text-emerald-400',
      orange: 'text-orange-400',
      red: 'text-red-400'
    }

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5 ${warning ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/70 text-sm">{label}</p>
          <Icon className={iconColors[color]} size={20} />
        </div>
        <p className={`text-3xl font-bold ${warning ? 'text-red-300' : 'text-white'}`}>
          {value ?? 0}
        </p>
        {subtext && <p className="text-white/50 text-xs mt-1">{subtext}</p>}
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'busy': return 'bg-orange-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const agents = teamView?.agents || []
  const topPerformers = (agentPerformance?.agents || []).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          L2 Supervisor Dashboard
        </h1>
        <p className="text-white/70">Team overview and performance metrics</p>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={MessageSquare}
          label="Total Tickets"
          value={stats?.total_tickets || 0}
          color="purple"
        />
        <StatCard
          icon={MessageSquare}
          label="Open Tickets"
          value={stats?.open_tickets || 0}
          color="cyan"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={stats?.in_progress_tickets || 0}
          color="orange"
        />
        <StatCard
          icon={CheckCircle}
          label="Resolved Today"
          value={stats?.resolved_today || 0}
          color="emerald"
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending Escalations"
          value={stats?.pending_escalations || 0}
          color="orange"
        />
        <StatCard
          icon={AlertTriangle}
          label="SLA Breaches"
          value={stats?.sla_breaches || 0}
          color="red"
          warning={(stats?.sla_breaches || 0) > 0}
        />
      </div>

      {/* L1 Agents Team View */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="text-cyan-400" size={20} />
            L1 Agents ({agents.length})
          </h2>
          <button
            onClick={() => navigate('/support/l2/team-view')}
            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            No L1 agents found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Agent</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Open Tickets</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.agent_id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                          <span className="text-purple-300 text-sm font-medium">
                            {agent.agent_name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{agent.agent_name}</p>
                          <p className="text-white/50 text-xs">{agent.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                        <span className="text-white/70 text-sm capitalize">{agent.status || 'offline'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {agent.open_tickets || 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${agent.avg_satisfaction || 0}%` }}
                          />
                        </div>
                        <span className="text-white/70 text-sm">{agent.avg_satisfaction || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Agent Performance */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={20} />
            Top Performers
          </h2>
          <button
            onClick={() => navigate('/support/l2/reports')}
            className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1 transition-colors"
          >
            View Reports <ArrowRight size={16} />
          </button>
        </div>

        {topPerformers.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            No performance data available
          </div>
        ) : (
          <div className="space-y-3">
            {topPerformers.map((agent, index) => (
              <div key={agent.agent_id} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-sm">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{agent.agent_name}</p>
                  <p className="text-white/50 text-sm">{agent.tickets_resolved || 0} tickets resolved</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">{agent.customer_satisfaction_avg || 0}%</p>
                  <p className="text-white/50 text-xs">satisfaction</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/support/l2/tickets')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left transition-all group"
        >
          <BarChart3 className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-white font-semibold mb-1">All Tickets</h3>
          <p className="text-white/60 text-sm">View and manage team tickets</p>
        </button>
        <button
          onClick={() => navigate('/support/l2/team-view')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left transition-all group"
        >
          <Users className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-white font-semibold mb-1">Team View</h3>
          <p className="text-white/60 text-sm">Monitor L1 agent activity</p>
        </button>
        <button
          onClick={() => navigate('/support/l2/reports')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left transition-all group"
        >
          <TrendingUp className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-white font-semibold mb-1">Reports</h3>
          <p className="text-white/60 text-sm">View team performance reports</p>
        </button>
      </div>
    </div>
  )
}