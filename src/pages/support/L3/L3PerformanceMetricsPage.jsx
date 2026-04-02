import { useEffect, useState } from 'react'
import { supportApi } from '../../../api/supportApi'
import { AlertCircle, TrendingUp, Star, Clock } from 'lucide-react'

/**
 * L3PerformanceMetricsPage - Detailed performance analytics
 * Agent performance tracking with trends, satisfaction, and SLA compliance
 */
export function L3PerformanceMetricsPage() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [periodFilter, setPeriodFilter] = useState('daily')
  const [dateRangeFilter, setDateRangeFilter] = useState('30')
  const [sortBy, setSortBy] = useState('satisfaction')

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await supportApi.l3.getTeamPerformance({ period: periodFilter })
        const agentsList = response?.agents || response || []
        
        // Sort agents
        const sorted = [...agentsList].sort((a, b) => {
          if (sortBy === 'satisfaction') {
            return (b.customer_satisfaction_avg || 0) - (a.customer_satisfaction_avg || 0)
          } else if (sortBy === 'response_time') {
            return (a.avg_response_hours || 0) - (b.avg_response_hours || 0)
          } else if (sortBy === 'tickets_resolved') {
            return (b.tickets_resolved || 0) - (a.tickets_resolved || 0)
          }
          return 0
        })
        
        setAgents(sorted)
      } catch (err) {
        console.error('Failed to load performance metrics:', err)
        setError('Failed to load performance data')
      } finally {
        setLoading(false)
      }
    }

    loadPerformance()
  }, [periodFilter, sortBy])

  if (loading && agents.length === 0) {
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

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.round(rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Performance Metrics</h1>
        <p className="text-white/70">Detailed agent performance tracking and analytics</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <select
          value={dateRangeFilter}
          onChange={(e) => setDateRangeFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="satisfaction">Sort by Satisfaction</option>
          <option value="response_time">Sort by Response Time</option>
          <option value="tickets_resolved">Sort by Tickets Resolved</option>
        </select>
      </div>

      {/* Agents Table */}
      {agents.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left text-white/70">
                  <th className="px-6 py-4">Agent Name</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Tickets Resolved</th>
                  <th className="px-6 py-4">Response Time</th>
                  <th className="px-6 py-4">Satisfaction</th>
                  <th className="px-6 py-4">SLA Compliance</th>
                  <th className="px-6 py-4">Quality Score</th>
                  <th className="px-6 py-4">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agents.map((agent, idx) => (
                  <tr key={agent.id || idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{agent.agent_name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        agent.agent_tier === 'L1' ? 'bg-blue-500/20 text-blue-400' :
                        agent.agent_tier === 'L2' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {agent.agent_tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80 font-medium">{agent.tickets_resolved || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-white/40" />
                        <span className="text-white/80">{(agent.avg_response_hours || 0).toFixed(1)}h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {renderStars(agent.customer_satisfaction_avg || 0)}
                        <span className="text-cyan-400 font-medium ml-2">{(agent.customer_satisfaction_avg || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${Math.min(agent.sla_compliance_percent || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-emerald-400 text-xs">{(agent.sla_compliance_percent || 0).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-400 font-medium">{(agent.quality_score || 0).toFixed(1)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {agent.trend === '↑' && <TrendingUp size={16} className="text-green-400" />}
                        {agent.trend === '↓' && <TrendingUp size={16} className="text-red-400 rotate-180" />}
                        {agent.trend === '→' && <TrendingUp size={16} className="text-yellow-400 rotate-90" />}
                        <span className="text-white/70 text-sm">{agent.trend || '→'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/70">No performance data available</p>
        </div>
      )}

      {/* Summary Stats */}
      {agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-white/70 text-sm mb-2">Avg Satisfaction</p>
            <p className="text-2xl font-bold text-cyan-400">
              {(agents.reduce((sum, a) => sum + (a.customer_satisfaction_avg || 0), 0) / agents.length).toFixed(1)}★
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-white/70 text-sm mb-2">Avg Response Time</p>
            <p className="text-2xl font-bold text-purple-400">
              {(agents.reduce((sum, a) => sum + (a.avg_response_hours || 0), 0) / agents.length).toFixed(1)}h
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-white/70 text-sm mb-2">Avg SLA Compliance</p>
            <p className="text-2xl font-bold text-emerald-400">
              {(agents.reduce((sum, a) => sum + (a.sla_compliance_percent || 0), 0) / agents.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-white/70 text-sm mb-2">Total Tickets Resolved</p>
            <p className="text-2xl font-bold text-blue-400">
              {agents.reduce((sum, a) => sum + (a.tickets_resolved || 0), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
