import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supportApi } from '../../../api/supportApi'
import { AlertCircle, BarChart3, TrendingUp, Users, Award } from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * L3ReportsPage - Multi-tab analytics dashboard
 * Tabs: Executive Summary, Performance Trends, Category Breakdown, Team Comparison, Quality Metrics
 */
export function L3ReportsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('executive')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    summary: null,
    trends: null,
    escalations: null,
    performance: null
  })

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [summary, trends, escalations, performance] = await Promise.all([
          supportApi.l3.getExecutiveSummary().catch(() => null),
          supportApi.l3.getPerformanceTrends({ period: 'daily', days: 30 }).catch(() => null),
          supportApi.l3.getEscalationAnalysis({ days: 30 }).catch(() => null),
          supportApi.l3.getTeamPerformance().catch(() => null)
        ])

        setData({
          summary: summary || {},
          trends: trends || {},
          escalations: escalations || {},
          performance: performance || {}
        })
      } catch (err) {
        console.error('Failed to load reports:', err)
        setError('Failed to load reports data')
      } finally {
        setLoading(false)
      }
    }

    loadReportData()
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
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="text-red-400" size={20} />
        <span className="text-red-400">{error}</span>
      </div>
    )
  }

  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: BarChart3 },
    { id: 'trends', label: 'Performance Trends', icon: TrendingUp },
    { id: 'category', label: 'Category Breakdown', icon: PieChart },
    { id: 'team', label: 'Team Comparison', icon: Users },
    { id: 'quality', label: 'Quality Metrics', icon: Award }
  ]

  // Process trends data for chart
  const trendChartData = data.trends?.data_points?.slice(-14) || []

  // Process category breakdown
  const categoryData = data.summary?.category_breakdown?.slice(0, 8) || []
  const categoryChartData = categoryData.map(cat => ({
    name: cat.category || 'Other',
    value: cat.count || 0
  }))

  const COLORS = ['#a855f7', '#06b6d4', '#3b82f6', '#f97316', '#eab308', '#10b981', '#ec4899', '#f43f5e']

  // Process team performance data
  const teamAgents = data.performance?.agents || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
        <p className="text-white/70">Comprehensive analysis of support metrics and team performance</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Executive Summary */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            {data.summary && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/70 text-sm mb-2">30-Day Tickets Created</p>
                    <p className="text-3xl font-bold text-purple-400">{data.summary.tickets_created_30d || 0}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/70 text-sm mb-2">Resolution Rate</p>
                    <p className="text-3xl font-bold text-cyan-400">{data.summary.resolution_rate_percent || 0}%</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/70 text-sm mb-2">Satisfaction Score</p>
                    <p className="text-3xl font-bold text-blue-400">{data.summary.avg_satisfaction_30d || 0}★</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/70 text-sm mb-2">SLA Compliance</p>
                    <p className="text-3xl font-bold text-emerald-400">{data.summary.avg_sla_compliance_30d || 0}%</p>
                  </div>
                </div>

                {/* Top Performers */}
                {data.summary.top_agents && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Top Performers (30 Days)</h3>
                    <div className="space-y-3">
                      {data.summary.top_agents.map((agent, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white">{agent.agent_name || 'Unknown'}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                                style={{ width: `${Math.min((agent.satisfaction || 0) * 20, 100)}%` }}
                              />
                            </div>
                            <span className="text-cyan-400 font-medium">{agent.satisfaction || 0}★</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Performance Trends */}
        {activeTab === 'trends' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="response_hours" stroke="#a855f7" name="Response Hours" />
                  <Line type="monotone" dataKey="resolution_hours" stroke="#06b6d4" name="Resolution Hours" />
                  <Line type="monotone" dataKey="satisfaction" stroke="#10b981" name="Satisfaction" />
                  <Line type="monotone" dataKey="sla_percent" stroke="#f97316" name="SLA %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-white/70">No trend data available</div>
            )}
          </div>
        )}

        {/* Category Breakdown */}
        {activeTab === 'category' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categoryChartData.length > 0 ? (
              <>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">Category Distribution</h3>
                  <div className="space-y-3">
                    {categoryChartData.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span className="text-white">{cat.name}</span>
                        </div>
                        <span className="text-white/70">{cat.value} tickets</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-white/70">No category data available</div>
            )}
          </div>
        )}

        {/* Team Comparison */}
        {activeTab === 'team' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            {teamAgents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-left text-white/70">
                      <th className="pb-3 px-4">Agent</th>
                      <th className="pb-3 px-4">Tickets Resolved</th>
                      <th className="pb-3 px-4">Response Time</th>
                      <th className="pb-3 px-4">Resolution Time</th>
                      <th className="pb-3 px-4">Satisfaction</th>
                      <th className="pb-3 px-4">SLA %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teamAgents.map((agent, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-white">{agent.agent_name || 'Unknown'}</td>
                        <td className="py-4 px-4 text-white/80">{agent.tickets_resolved || 0}</td>
                        <td className="py-4 px-4 text-white/80">{(agent.avg_response_hours || 0).toFixed(1)}h</td>
                        <td className="py-4 px-4 text-white/80">{(agent.avg_resolution_hours || 0).toFixed(1)}h</td>
                        <td className="py-4 px-4">
                          <span className="text-cyan-400">{(agent.customer_satisfaction_avg || 0).toFixed(1)}★</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-emerald-400">{(agent.sla_compliance_percent || 0).toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-white/70">No team data available</div>
            )}
          </div>
        )}

        {/* Quality Metrics */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            {data.escalations && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/70 text-sm mb-2">Total Escalations (30d)</p>
                    <p className="text-3xl font-bold text-purple-400">{data.escalations.total_escalations || 0}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/70 text-sm mb-2">Resolution Rate</p>
                    <p className="text-3xl font-bold text-emerald-400">{data.escalations.resolution_rate_percent || 0}%</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/70 text-sm mb-2">Avg Resolution Time</p>
                    <p className="text-3xl font-bold text-cyan-400">{(data.escalations.avg_resolution_hours || 0).toFixed(1)}h</p>
                  </div>
                </div>

                {/* Escalations by Category */}
                {data.escalations.by_category && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4">Escalations by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.escalations.by_category}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="count" fill="#a855f7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
