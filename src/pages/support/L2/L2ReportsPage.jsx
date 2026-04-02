import { useState, useEffect } from 'react'
import { supportApi } from '../../../api/supportApi'
import { TrendingUp, Users, Layers } from 'lucide-react'

// Tab Navigation
function TabButton({ label, icon: Icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-all ${
        isActive
          ? 'text-[#00C4B4] border-b-[#00C4B4]'
          : 'text-white/70 border-b-transparent hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}

// Overview Tab Components
function StatusCard({ label, value, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
      <p className="text-white/70 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function OverviewTab({ data }) {
  const ticketsByStatus = data?.tickets_by_status || {}
  const responseTrend = data?.response_time_trend || []
  const satisfaction = data?.avg_customer_satisfaction || 0

  return (
    <div className="space-y-6">
      {/* Tickets by Status Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Tickets by Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            label="Open"
            value={ticketsByStatus.open || 0}
            color="text-blue-400"
          />
          <StatusCard
            label="In Progress"
            value={ticketsByStatus.in_progress || 0}
            color="text-yellow-400"
          />
          <StatusCard
            label="Resolved"
            value={ticketsByStatus.resolved || 0}
            color="text-green-400"
          />
          <StatusCard
            label="Closed"
            value={ticketsByStatus.closed || 0}
            color="text-gray-400"
          />
        </div>
      </div>

      {/* Response Time Trend */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Response Time Trend (Last 7 Days)</h3>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Date</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Avg Response Time (hours)</th>
              </tr>
            </thead>
            <tbody>
              {responseTrend.length > 0 ? (
                responseTrend.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 text-sm text-white">{item.date || '-'}</td>
                    <td className="px-6 py-3 text-sm text-right text-white/70">
                      {typeof item.avg_response_hours === 'number'
                        ? item.avg_response_hours.toFixed(2)
                        : '-'}{' '}
                      hrs
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-3 text-center text-white/50">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Overall Customer Satisfaction</h3>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl font-bold text-[#00C4B4]">{satisfaction.toFixed(1)}</p>
              <p className="text-2xl text-white/70 mt-2">/ 5.0 ⭐</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Agent Performance Tab
function AgentPerformanceTab({ data }) {
  const agents = Array.isArray(data) ? data : data?.agents || []

  // Sort by satisfaction (best first)
  const sortedAgents = [...agents].sort((a, b) => {
    const satA = a.customer_satisfaction_avg || 0
    const satB = b.customer_satisfaction_avg || 0
    return satB - satA
  })

  const getSatisfactionColor = (satisfaction) => {
    if (satisfaction > 4.5) return 'text-green-400'
    if (satisfaction >= 3.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Agent Name</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Tickets Resolved</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Avg Response (hrs)</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Avg Resolution (hrs)</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">SLA Compliance</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.length > 0 ? (
              sortedAgents.map((agent, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3 text-sm text-white whitespace-nowrap">
                    {agent.agent_name || '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-white/70">
                    {agent.tickets_resolved || 0}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-white/70">
                    {typeof agent.avg_response_hours === 'number'
                      ? agent.avg_response_hours.toFixed(2)
                      : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-white/70">
                    {typeof agent.avg_resolution_hours === 'number'
                      ? agent.avg_resolution_hours.toFixed(2)
                      : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-white/70">
                    {typeof agent.sla_compliance_percent === 'number'
                      ? `${agent.sla_compliance_percent.toFixed(1)}%`
                      : '-'}
                  </td>
                  <td
                    className={`px-6 py-3 text-sm text-right font-medium whitespace-nowrap ${getSatisfactionColor(
                      agent.customer_satisfaction_avg
                    )}`}
                  >
                    {typeof agent.customer_satisfaction_avg === 'number'
                      ? `${agent.customer_satisfaction_avg.toFixed(1)} ⭐`
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-3 text-center text-white/50">
                  No agent data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Category Analysis Tab
function CategoryAnalysisTab({ data }) {
  const categories = Array.isArray(data) ? data : data?.categories || []

  // Sort by total tickets (most first)
  const sortedCategories = [...categories].sort((a, b) => {
    return (b.total_tickets || 0) - (a.total_tickets || 0)
  })

  return (
    <div>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Category</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Total Tickets</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Resolved</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Resolution Rate</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white/70">Avg Response (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3 text-sm text-white whitespace-nowrap">
                    {category.category || '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-white/70">
                    {category.total_tickets || 0}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-white/70">
                    {category.resolved_tickets || 0}
                  </td>
                  <td className="px-6 py-3 text-sm text-right">
                    <span className="text-green-400 font-medium">
                      {typeof category.resolution_rate === 'number'
                        ? `${category.resolution_rate.toFixed(1)}%`
                        : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-white/70">
                    {typeof category.avg_response_hours === 'number'
                      ? category.avg_response_hours.toFixed(2)
                      : '-'}{' '}
                    hrs
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-3 text-center text-white/50">
                  No category data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Component
export function L2ReportsPage() {
  const [reportData, setReportData] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError(null)
        const [overview, agentPerf, categoryAnalysis] = await Promise.all([
          supportApi.l2.getReportsOverview(),
          supportApi.l2.getReportsAgentPerformance(),
          supportApi.l2.getReportsCategoryAnalysis()
        ])
        setReportData({
          overview,
          agentPerformance: agentPerf,
          categoryAnalysis
        })
      } catch (err) {
        console.error('Failed to load reports:', err)
        setError(err.message || 'Failed to load reports. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-white/70">Analyze team performance and trends</p>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-white/70">Analyze team performance and trends</p>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
          <p className="text-red-400 font-medium">Error Loading Reports</p>
          <p className="text-red-400/70 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-white/70">Analyze team performance and trends</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
        <div className="flex border-b border-white/10 overflow-x-auto">
          <TabButton
            label="Overview"
            icon={TrendingUp}
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            label="Agent Performance"
            icon={Users}
            isActive={activeTab === 'agentPerformance'}
            onClick={() => setActiveTab('agentPerformance')}
          />
          <TabButton
            label="Category Analysis"
            icon={Layers}
            isActive={activeTab === 'categoryAnalysis'}
            onClick={() => setActiveTab('categoryAnalysis')}
          />
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab data={reportData.overview} />}
          {activeTab === 'agentPerformance' && (
            <AgentPerformanceTab data={reportData.agentPerformance} />
          )}
          {activeTab === 'categoryAnalysis' && (
            <CategoryAnalysisTab data={reportData.categoryAnalysis} />
          )}
        </div>
      </div>
    </div>
  )
}
