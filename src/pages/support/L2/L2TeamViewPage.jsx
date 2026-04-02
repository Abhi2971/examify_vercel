import { useEffect, useState } from 'react'
import { supportApi } from '../../../api/supportApi'
import { Users, Clock, TrendingUp, Star, AlertCircle } from 'lucide-react'

export function L2TeamViewPage() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch team data on component mount
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setError(null)
        const data = await supportApi.l2.getTeamView()
        setTeam(data.team || [])
      } catch (err) {
        console.error('Failed to load team view:', err)
        setError('Failed to load team data. Please try again.')
        setTeam([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  // Calculate summary stats
  const teamSize = team.length
  const totalTickets = team.reduce((sum, agent) => sum + (agent.assigned_tickets || 0), 0)
  const openTickets = team.reduce((sum, agent) => sum + (agent.open_tickets || 0), 0)
  const avgSatisfaction = teamSize > 0
    ? (team.reduce((sum, agent) => sum + (agent.avg_satisfaction || 0), 0) / teamSize).toFixed(1)
    : 0

  // Get max assigned tickets for workload chart normalization
  const maxTickets = team.length > 0 ? Math.max(...team.map(a => a.assigned_tickets || 0)) : 1

  // Get satisfaction color (green >4, yellow 3-4, red <3)
  const getSatisfactionColor = (satisfaction) => {
    if (satisfaction >= 4) return 'text-green-400'
    if (satisfaction >= 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400 border border-green-500/50',
      inactive: 'bg-gray-500/20 text-gray-400 border border-gray-500/50',
      offline: 'bg-red-500/20 text-red-400 border border-red-500/50',
      away: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
    }
    return colors[status] || colors.inactive
  }

  // Stat card component
  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="p-3 bg-[#00C4B4]/10 rounded-xl">
          <Icon size={24} className="text-[#00C4B4]" />
        </div>
      </div>
    </div>
  )

  if (loading && team.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team View</h1>
        <p className="text-white/70">L1 Agent performance and workload</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Summary Stats */}
      {team.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Team Size" value={teamSize} icon={Users} />
          <StatCard title="Total Tickets" value={totalTickets} icon={Clock} />
          <StatCard title="Open Tickets" value={openTickets} icon={TrendingUp} />
          <StatCard title="Avg Satisfaction" value={`${avgSatisfaction}⭐`} icon={Star} />
        </div>
      )}

      {/* Team Members Table */}
      {team.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 bg-white/5 px-6 py-4 border-b border-white/10 text-white/70 text-sm font-semibold sticky top-0">
            <div className="col-span-3">Agent</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-1 text-center">Assigned</div>
            <div className="col-span-1 text-center">Open</div>
            <div className="col-span-1 text-center">Resolved</div>
            <div className="col-span-2">Satisfaction</div>
            <div className="col-span-1">Status</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {team.map((agent, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                {/* Agent Name */}
                <div className="col-span-3">
                  <span className="text-white font-semibold">{agent.agent_name || 'N/A'}</span>
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <span className="text-white/60 text-sm">{agent.email || 'N/A'}</span>
                </div>

                {/* Assigned Tickets */}
                <div className="col-span-1 text-center">
                  <span className="text-white font-medium">{agent.assigned_tickets || 0}</span>
                </div>

                {/* Open Tickets */}
                <div className="col-span-1 text-center">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
                    {agent.open_tickets || 0}
                  </span>
                </div>

                {/* Resolved Tickets */}
                <div className="col-span-1 text-center">
                  <span className="text-white font-medium">{agent.tickets_resolved || 0}</span>
                </div>

                {/* Satisfaction Rating */}
                <div className="col-span-2">
                  <span className={`font-semibold ${getSatisfactionColor(agent.avg_satisfaction || 0)}`}>
                    {(agent.avg_satisfaction || 0).toFixed(1)} ⭐
                  </span>
                </div>

                {/* Status Badge */}
                <div className="col-span-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(agent.status)}`}>
                    {agent.status ? agent.status.charAt(0).toUpperCase() + agent.status.slice(1) : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Users size={48} className="mx-auto text-white/40 mb-4" />
            <p className="text-white/70">No team members found</p>
          </div>
        )
      )}

      {/* Workload Distribution Chart */}
      {team.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Workload Distribution</h2>
          <div className="space-y-4">
            {team.map((agent, idx) => {
              const percentage = maxTickets > 0 ? (agent.assigned_tickets / maxTickets) * 100 : 0
              return (
                <div key={idx} className="flex items-center gap-4">
                  {/* Agent Name */}
                  <div className="w-32 flex-shrink-0">
                    <p className="text-white font-medium text-sm truncate">{agent.agent_name || 'N/A'}</p>
                  </div>

                  {/* Bar */}
                  <div className="flex-1">
                    <div className="h-8 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00C4B4] to-cyan-400 rounded-lg transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Ticket Count */}
                  <div className="w-20 text-right flex-shrink-0">
                    <p className="text-white font-semibold">
                      {agent.assigned_tickets || 0} tickets
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
