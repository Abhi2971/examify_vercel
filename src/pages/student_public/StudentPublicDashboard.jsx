import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { studentPublicApi } from '../../api/studentPublicApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { 
  FileText, MessageSquare, Wallet, Award, Package, BookOpen,
  TrendingUp, ArrowRight, Brain, Zap, Clock, Play, Eye,
  CreditCard, Plus, RefreshCw, Sparkles, ShoppingBag,
  ArrowUpRight, ArrowDownRight, CheckCircle, Star
} from 'lucide-react'

const statCards = [
  { title: 'My Exams', key: 'bundleExams', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
  { title: 'AI Queries', key: 'aiQueries', icon: Brain, gradient: 'from-purple-500 to-pink-500' },
  { title: 'Wallet Balance', key: 'walletBalance', icon: Wallet, gradient: 'from-emerald-500 to-teal-500', format: 'currency' },
  { title: 'Certificates', key: 'certificates', icon: Award, gradient: 'from-amber-500 to-orange-500' },
]

const quickActions = [
  { label: 'Browse Exams', path: '/student/exams', icon: FileText, color: 'blue' },
  { label: 'AI Coach', path: '/student/ai-coach', icon: Sparkles, color: 'purple' },
  { label: 'eBooks', path: '/student/ebooks', icon: BookOpen, color: 'emerald' },
  { label: 'Add Money', path: '/student/wallet', icon: Plus, color: 'amber' },
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
}

export function StudentPublicDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [purchasedBundles, setPurchasedBundles] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [walletTransactions, setWalletTransactions] = useState([])
  const [learningProgress, setLearningProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Try API first, fallback to mock data
      let statsData
      try {
        statsData = await studentPublicApi.getDashboardStats()
      } catch {
        await new Promise(resolve => setTimeout(resolve, 400))
        statsData = {
          bundleExams: 24,
          aiQueriesUsed: 45,
          aiQueriesLimit: 100,
          walletBalance: 1250,
          certificates: 7,
          completedExams: 18,
          totalSpent: 4500
        }
      }
      setStats(statsData)

      // Mock data for additional sections
      setPurchasedBundles([
        { id: '1', title: 'UPSC Complete Package', exams: 12, completed: 5, progress: 42, expiresIn: '89 days' },
        { id: '2', title: 'Banking Aptitude Master', exams: 8, completed: 8, progress: 100, expiresIn: '120 days' },
        { id: '3', title: 'SSC CGL Preparation', exams: 15, completed: 3, progress: 20, expiresIn: '45 days' },
      ])

      setRecentActivity([
        { id: '1', type: 'exam_completed', title: 'UPSC Prelims Mock 5', score: 78, time: '2 hours ago' },
        { id: '2', type: 'ai_query', title: 'Asked about Indian Constitution', time: '5 hours ago' },
        { id: '3', type: 'purchase', title: 'Bought Banking Aptitude eBook', amount: 299, time: '1 day ago' },
        { id: '4', type: 'exam_started', title: 'Started GK Quiz Week 12', time: '2 days ago' },
        { id: '5', type: 'certificate', title: 'Earned SSC CGL Certificate', time: '3 days ago' },
      ])

      setWalletTransactions([
        { id: '1', type: 'credit', description: 'Added via UPI', amount: 500, date: '2024-03-28' },
        { id: '2', type: 'debit', description: 'Banking eBook Purchase', amount: -299, date: '2024-03-27' },
        { id: '3', type: 'credit', description: 'Refund - SSC Bundle', amount: 150, date: '2024-03-25' },
        { id: '4', type: 'debit', description: 'UPSC Package Subscription', amount: -999, date: '2024-03-20' },
      ])

      setLearningProgress([
        { category: 'General Knowledge', completed: 45, total: 60, color: 'emerald' },
        { category: 'Mathematics', completed: 28, total: 40, color: 'blue' },
        { category: 'Reasoning', completed: 32, total: 50, color: 'purple' },
        { category: 'English', completed: 15, total: 30, color: 'amber' },
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'exam_completed': return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'exam_started': return <Play className="w-4 h-4 text-blue-600" />
      case 'ai_query': return <Brain className="w-4 h-4 text-purple-600" />
      case 'purchase': return <ShoppingBag className="w-4 h-4 text-amber-600" />
      case 'certificate': return <Award className="w-4 h-4 text-amber-500" />
      default: return <Clock className="w-4 h-4 text-slate-600" />
    }
  }

  const aiQueriesPercent = stats ? Math.round((stats.aiQueriesUsed / stats.aiQueriesLimit) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'Learner'}! Continue your learning journey.</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.key} hover>
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  {card.key === 'aiQueries' ? (
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {stats?.aiQueriesUsed || 0}/{stats?.aiQueriesLimit || 100}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {card.format === 'currency' ? `₹${(stats?.[card.key] || 0).toLocaleString()}` : stats?.[card.key] || 0}
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              {card.key === 'aiQueries' && (
                <div className="mt-3">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${aiQueriesPercent >= 80 ? 'bg-red-500' : aiQueriesPercent >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${aiQueriesPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Bundles */}
        <Card className="lg:col-span-2">
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Package className="w-4 h-4" /> My Purchased Bundles
              </h3>
              <Link to="/student/bundles" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {purchasedBundles.map((bundle) => (
                <div key={bundle.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{bundle.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {bundle.completed}/{bundle.exams} exams completed • Expires in {bundle.expiresIn}
                      </p>
                    </div>
                    {bundle.progress === 100 ? (
                      <Badge variant="success">Completed</Badge>
                    ) : (
                      <Badge variant="info">{bundle.progress}%</Badge>
                    )}
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        bundle.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${bundle.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <Link to={`/student/bundles/${bundle.id}`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        Continue <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {purchasedBundles.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No bundles purchased yet</p>
                  <Link to="/student/bundles">
                    <Button size="sm" className="mt-3">Browse Bundles</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path}>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <div className={`w-8 h-8 rounded-lg ${colorClasses[action.color]} flex items-center justify-center`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span>{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* AI Coach Card */}
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">AI Study Coach</span>
              </div>
              <p className="text-sm text-white/80 mb-3">Get instant answers to your study questions</p>
              <Link to="/student/ai-coach">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                  Ask AI Coach
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Learning Progress
            </h3>
            <div className="space-y-4">
              {learningProgress.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.category}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.completed}/{item.total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${item.color}-500`}
                      style={{ width: `${(item.completed / item.total) * 100}%` }}
                    />
                  </div>
                </div>
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
                    <p className="text-sm text-slate-900 dark:text-white">{activity.title}</p>
                    {activity.score && (
                      <p className="text-xs text-emerald-600">Scored {activity.score}%</p>
                    )}
                    {activity.amount && (
                      <p className="text-xs text-amber-600">₹{activity.amount}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Wallet Overview */}
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Wallet
              </h3>
              <Link to="/student/wallet" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-4">
              <p className="text-sm text-white/80">Available Balance</p>
              <p className="text-2xl font-bold">₹{(stats?.walletBalance || 0).toLocaleString()}</p>
              <Link to="/student/wallet/add">
                <Button size="sm" variant="outline" className="mt-3 border-white/30 text-white hover:bg-white/20 gap-1">
                  <Plus className="w-3 h-3" /> Add Money
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Recent Transactions</p>
              {walletTransactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownRight className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                      {tx.description}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
