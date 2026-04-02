import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton, SkeletonCard } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { 
  Building2, Users, GraduationCap, FileText, DollarSign, CheckCircle,
  AlertTriangle, ArrowRight, Activity, Zap, Server, Database, Cloud, Cpu,
  HeadphonesIcon, Plus, UserCheck, Shield
} from 'lucide-react'

const statCards = [
  { title: 'Total Institutes', key: 'total_institutes', icon: Building2, gradient: 'from-violet-500 to-purple-500' },
  { title: 'Total Students', key: 'total_students', icon: GraduationCap, gradient: 'from-emerald-500 to-teal-500' },
  { title: 'Total Teachers', key: 'total_teachers', icon: Users, gradient: 'from-blue-500 to-cyan-500' },
  { title: 'Active Subscriptions', key: 'active_subscriptions', icon: CheckCircle, gradient: 'from-amber-500 to-orange-500' },
  { title: 'Monthly Revenue', key: 'monthly_revenue', icon: DollarSign, gradient: 'from-rose-500 to-pink-500', format: 'currency' },
  { title: 'Support Tickets', key: 'support_tickets_open', icon: AlertTriangle, gradient: 'from-indigo-500 to-blue-500' },
]

const quickActions = [
  { label: 'Manage Institutes', path: '/super/institutes', icon: Building2, color: 'violet' },
  { label: 'View Users', path: '/super/users', icon: Users, color: 'blue' },
  { label: 'Plans & Pricing', path: '/super/plans', icon: DollarSign, color: 'emerald' },
  { label: 'View Payments', path: '/super/payments', icon: FileText, color: 'amber' },
  { label: 'Audit Logs', path: '/super/audit-logs', icon: Activity, color: 'indigo' },
  { label: 'Support Tickets', path: '/super/tickets', icon: AlertTriangle, color: 'rose' },
]

const tierColors = {
  l1: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'L1' },
  l2: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', label: 'L2' },
  l3: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', label: 'L3 Lead' },
}

const colorClasses = {
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
}

const actionColors = {
  'user.': 'blue',
  'institute.': 'violet',
  'payment.': 'emerald',
  'exam.': 'amber',
  'plan.': 'indigo',
  default: 'slate'
}

const getActivityColor = (action) => {
  for (const [key, color] of Object.entries(actionColors)) {
    if (action.startsWith(key)) return color
  }
  return actionColors.default
}

export function SuperDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [systemHealth, setSystemHealth] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [supportAgents, setSupportAgents] = useState([])
  const [agentsLoading, setAgentsLoading] = useState(true)
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    support_tier: 'l1'
  })

  useEffect(() => {
    fetchAllData()
    fetchSupportAgents()
  }, [])

  const fetchAllData = async () => {
    try {
      const [statsData, healthData, activityData] = await Promise.all([
        superAdminApi.getDashboardStats(),
        superAdminApi.getSystemHealth(),
        superAdminApi.getRecentActivity()
      ])
      
      setStats(statsData)
      setSystemHealth(healthData)
      setRecentActivity(Array.isArray(activityData) ? activityData : (activityData?.data || []))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSupportAgents = async () => {
    try {
      const data = await superAdminApi.getSupportAgents()
      setSupportAgents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch support agents:', error)
    } finally {
      setAgentsLoading(false)
    }
  }

  const handleCreateAgent = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill all required fields')
      return
    }
    setCreating(true)
    try {
      await superAdminApi.createSupportAgent(formData)
      setShowCreateAgentModal(false)
      setFormData({ name: '', email: '', password: '', support_tier: 'l1' })
      fetchSupportAgents()
      alert('Support agent created successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create agent')
    } finally {
      setCreating(false)
    }
  }

  const handleToggleAvailability = async (agentId) => {
    try {
      await superAdminApi.toggleSupportAgentAvailability(agentId)
      fetchSupportAgents()
    } catch (error) {
      console.error('Failed to toggle availability:', error)
    }
  }

  const handleTierChange = async (agentId, newTier) => {
    try {
      await superAdminApi.updateSupportAgentTier(agentId, newTier)
      fetchSupportAgents()
    } catch (error) {
      console.error('Failed to update tier:', error)
    }
  }

  const getAgentStats = () => {
    const total = supportAgents.length
    const available = supportAgents.filter(a => a.is_available).length
    const byTier = {
      l1: supportAgents.filter(a => a.support_tier === 'l1').length,
      l2: supportAgents.filter(a => a.support_tier === 'l2').length,
      l3: supportAgents.filter(a => a.support_tier === 'l3').length,
    }
    const activeTickets = supportAgents.reduce((sum, a) => sum + (a.active_ticket_count || 0), 0)
    return { total, available, byTier, activeTickets }
  }

  const formatValue = (value, format) => {
    if (format === 'currency') {
      return `₹${(value || 0).toLocaleString('en-IN')}`
    }
    return value?.toLocaleString() || 0
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return ''
    const now = new Date()
    const date = new Date(timestamp)
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} mins ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  const getActivityIcon = (action) => {
    if (action.includes('user')) return Users
    if (action.includes('institute')) return Building2
    if (action.includes('payment')) return DollarSign
    if (action.includes('exam')) return FileText
    if (action.includes('plan')) return CheckCircle
    return Activity
  }

  const getSystemIcon = (name) => {
    if (name.toLowerCase().includes('api')) return Server
    if (name.toLowerCase().includes('database') || name.toLowerCase().includes('db')) return Database
    if (name.toLowerCase().includes('storage') || name.toLowerCase().includes('file')) return Cloud
    if (name.toLowerCase().includes('server') || name.toLowerCase().includes('load')) return Cpu
    return Zap
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening on your platform today.
          </p>
        </div>
        <Button onClick={() => navigate('/super/institutes')}>
          <Building2 className="w-4 h-4 mr-2" />
          Add Institute
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.key} 
            hover 
            className="group animate-slide-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardBody className="p-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-3 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-full h-full text-white" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatValue(stats?.[stat.key], stat.format)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-lg ${colorClasses[action.color]} flex items-center justify-center mb-3`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Support Agents Section */}
      <Card>
        <CardBody className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 p-2">
                <HeadphonesIcon className="w-full h-full text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Support Team</h3>
                <p className="text-sm text-slate-500">
                  {getAgentStats().available}/{getAgentStats().total} agents available • {getAgentStats().activeTickets} active tickets
                </p>
              </div>
            </div>
            <Button onClick={() => setShowCreateAgentModal(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Agent
            </Button>
          </div>

          {/* Tier Stats */}
          <div className="flex gap-4 mb-4">
            {Object.entries(tierColors).map(([tier, config]) => (
              <div key={tier} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg}`}>
                <Shield className={`w-4 h-4 ${config.text}`} />
                <span className={`text-sm font-medium ${config.text}`}>
                  {config.label}: {getAgentStats().byTier[tier]}
                </span>
              </div>
            ))}
          </div>

          {/* Agents List */}
          {agentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : supportAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {supportAgents.map(agent => (
                <div key={agent._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{agent.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{agent.name}</p>
                        <p className="text-xs text-slate-500">{agent.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAvailability(agent._id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        agent.is_available 
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                          : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                      }`}
                      title={agent.is_available ? 'Online - Click to go offline' : 'Offline - Click to go online'}
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <select
                      value={agent.support_tier}
                      onChange={(e) => handleTierChange(agent._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 ${tierColors[agent.support_tier]?.bg} ${tierColors[agent.support_tier]?.text}`}
                    >
                      <option value="l1">L1 Support</option>
                      <option value="l2">L2 Support</option>
                      <option value="l3">L3 Lead</option>
                    </select>
                    <span className="text-xs text-slate-500">
                      {agent.active_ticket_count || 0} tickets
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <HeadphonesIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No support agents yet</p>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/super/tickets')}>
              View All Tickets <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardBody className="p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              System Status
            </h3>
            <div className="space-y-3">
              {systemHealth ? (
                <>
                  {Object.entries(systemHealth).filter(([key]) => key !== 'server_load').map(([key, value]) => {
                    const status = value === 'healthy' || value === 'connected' || value === 'available' || value === 'operational'
                    const Icon = getSystemIcon(key)
                    return (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                        </div>
                        <Badge variant={status ? 'success' : 'danger'}>
                          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                        </Badge>
                      </div>
                    )
                  })}
                  {systemHealth.server_load !== undefined && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Server Load</span>
                      </div>
                      <Badge variant={systemHealth.server_load < 70 ? 'success' : systemHealth.server_load < 90 ? 'warning' : 'danger'}>
                        {systemHealth.server_load}%
                      </Badge>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-slate-500">
                  <p className="text-sm">System health data unavailable</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/super/audit-logs')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 6).map((log, index) => {
                  const ActivityIcon = getActivityIcon(log.action)
                  const color = getActivityColor(log.action)
                  return (
                    <div key={log._id || index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <div className={`w-9 h-9 rounded-lg ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
                        <ActivityIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-white">{log.description || log.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{log.user?.name || 'System'}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{formatTimeAgo(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Create Agent Modal */}
      <Modal 
        isOpen={showCreateAgentModal} 
        onClose={() => setShowCreateAgentModal(false)} 
        title="Add Support Agent"
      >
        <form onSubmit={handleCreateAgent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <Input 
              placeholder="Enter agent name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <Input 
              type="email"
              placeholder="agent@examify.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <Input 
              type="password"
              placeholder="Set password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Support Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'l1', label: 'L1 Support', desc: 'Handle basic queries', color: 'blue' },
                { value: 'l2', label: 'L2 Support', desc: 'Technical issues', color: 'purple' },
                { value: 'l3', label: 'L3 Lead', desc: 'Team management', color: 'amber' },
              ].map(tier => (
                <label
                  key={tier.value}
                  className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.support_tier === tier.value
                      ? tier.color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                        tier.color === 'purple' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                        'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={tier.value}
                    checked={formData.support_tier === tier.value}
                    onChange={(e) => setFormData({...formData, support_tier: e.target.value})}
                    className="sr-only"
                  />
                  <Shield className={`w-5 h-5 mb-1 ${
                    formData.support_tier === tier.value
                      ? tier.color === 'blue' ? 'text-blue-500' :
                        tier.color === 'purple' ? 'text-purple-500' :
                        'text-amber-500'
                      : 'text-slate-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    formData.support_tier === tier.value
                      ? tier.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                        tier.color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                        'text-amber-700 dark:text-amber-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>{tier.label}</span>
                  <span className="text-xs text-slate-500 text-center">{tier.desc}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowCreateAgentModal(false)}>Cancel</Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
