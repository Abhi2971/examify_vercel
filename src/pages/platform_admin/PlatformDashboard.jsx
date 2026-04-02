import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { platformAdminApi } from '../../api/platformAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { 
  Users, FileText, Award, CreditCard, BookOpen, Package, 
  TrendingUp, ArrowRight, BarChart3, Clock, CheckCircle, 
  Activity, Eye, Download, Star, RefreshCw, FileType, Layers
} from 'lucide-react'

const statCards = [
  { title: 'Public Students', key: 'publicStudents', icon: Users, gradient: 'from-blue-500 to-cyan-500', format: 'number' },
  { title: 'Platform Exams', key: 'platformExams', icon: FileText, gradient: 'from-emerald-500 to-teal-500', format: 'number' },
  { title: 'eBooks', key: 'ebooks', icon: BookOpen, gradient: 'from-purple-500 to-pink-500', format: 'number' },
  { title: 'Bundles', key: 'bundles', icon: Package, gradient: 'from-amber-500 to-orange-500', format: 'number' },
  { title: 'Certificates Issued', key: 'certificates', icon: Award, gradient: 'from-rose-500 to-red-500', format: 'number' },
  { title: 'Platform Revenue', key: 'revenue', icon: CreditCard, gradient: 'from-indigo-500 to-violet-500', format: 'currency' },
]

const quickActions = [
  { label: 'Manage Exams', path: '/platform/exams', icon: FileText, color: 'emerald' },
  { label: 'Manage eBooks', path: '/platform/ebooks', icon: BookOpen, color: 'purple' },
  { label: 'Manage PDFs', path: '/platform/pdfs', icon: FileType, color: 'blue' },
  { label: 'Manage Bundles', path: '/platform/bundles', icon: Package, color: 'amber' },
  { label: 'View Reports', path: '/platform/reports', icon: BarChart3, color: 'indigo' },
  { label: 'View Students', path: '/platform/students', icon: Users, color: 'cyan' },
]

const colorClasses = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
}

export function PlatformDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [topExams, setTopExams] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Using mock data for now since backend routes aren't fully implemented
      await new Promise(resolve => setTimeout(resolve, 500))
      setStats({
        publicStudents: 2847,
        platformExams: 156,
        ebooks: 48,
        bundles: 24,
        certificates: 892,
        revenue: 145000,
        completionRate: 78.5,
        avgScore: 72.3,
        totalAttempts: 4521
      })
      setTopExams([
        { id: '1', title: 'UPSC Prelims Mock Test', attempts: 1245, avgScore: 68, rating: 4.5 },
        { id: '2', title: 'SSC CGL Full Practice', attempts: 892, avgScore: 71, rating: 4.3 },
        { id: '3', title: 'Banking Aptitude Master', attempts: 756, avgScore: 65, rating: 4.6 },
        { id: '4', title: 'Quantitative Reasoning', attempts: 634, avgScore: 74, rating: 4.4 },
        { id: '5', title: 'Current Affairs 2024', attempts: 589, avgScore: 82, rating: 4.7 },
      ])
      setRecentActivity([
        { id: '1', action: 'Exam Published', description: 'Railway RRB Group D Set 5', time: '2 hours ago', type: 'exam' },
        { id: '2', action: 'eBook Added', description: 'Complete GK Encyclopedia 2024', time: '4 hours ago', type: 'ebook' },
        { id: '3', action: 'Bundle Created', description: 'Banking Complete Package', time: '1 day ago', type: 'bundle' },
        { id: '4', action: 'PDF Uploaded', description: 'Previous Year Question Papers', time: '1 day ago', type: 'pdf' },
        { id: '5', action: 'Exam Updated', description: 'SSC MTS Practice Set 3', time: '2 days ago', type: 'exam' },
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatValue = (value, format) => {
    if (format === 'currency') return `₹${(value || 0).toLocaleString()}`
    if (format === 'number') return (value || 0).toLocaleString()
    return value || 0
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'exam': return <FileText className="w-4 h-4 text-emerald-600" />
      case 'ebook': return <BookOpen className="w-4 h-4 text-purple-600" />
      case 'bundle': return <Package className="w-4 h-4 text-amber-600" />
      case 'pdf': return <FileType className="w-4 h-4 text-blue-600" />
      default: return <Activity className="w-4 h-4 text-slate-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-72" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'Admin'}! Manage your platform content here.</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Card key={card.key} hover className="overflow-hidden">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatValue(stats?.[card.key], card.format)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Performance Metrics & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Platform Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Completion Rate</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.completionRate || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Average Score</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.avgScore || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Attempts</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{(stats?.totalAttempts || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path}>
                  <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1 hover:border-slate-400">
                    <div className={`w-8 h-8 rounded-lg ${colorClasses[action.color]} flex items-center justify-center`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Activity
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Performing Exams */}
      <Card>
        <CardBody className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Top Performing Exams
            </h3>
            <Link to="/platform/exams" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Exam Title</th>
                  <th className="pb-3 font-medium text-center">Attempts</th>
                  <th className="pb-3 font-medium text-center">Avg Score</th>
                  <th className="pb-3 font-medium text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topExams.map((exam, idx) => (
                  <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                          idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                          idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                          'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{exam.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-slate-600 dark:text-slate-400">{exam.attempts.toLocaleString()}</span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={exam.avgScore >= 70 ? 'success' : exam.avgScore >= 50 ? 'warning' : 'danger'}>
                        {exam.avgScore}%
                      </Badge>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-slate-600 dark:text-slate-400">{exam.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
