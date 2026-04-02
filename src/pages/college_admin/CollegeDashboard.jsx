import { useEffect, useState } from 'react'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { 
  Users, GraduationCap, FileText, Award, TrendingUp, 
  Clock, CheckCircle, XCircle, Activity, AlertCircle,
  BarChart3, ArrowRight, Calendar, Building2
} from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'
import { Link } from 'react-router-dom'

export function CollegeDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const data = await collegeAdminApi.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">College Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Overview of your institute's performance</p>
        </div>
        {stats?.planName && (
          <Badge variant={stats?.isPlanActive ? 'success' : 'danger'} className="px-4 py-2">
            {stats.planName} Plan {stats?.isPlanActive ? 'Active' : 'Expired'}
          </Badge>
        )}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Teachers</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats?.totalTeachers || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Link to="/college/teachers" className="text-sm text-blue-600 mt-2 flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Students</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats?.totalStudents || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <Link to="/college/students" className="text-sm text-emerald-600 mt-2 flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Exams</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats?.totalExams || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <Link to="/college/exams" className="text-sm text-amber-600 mt-2 flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Exams</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats?.activeExams || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <Link to="/college/exams" className="text-sm text-purple-600 mt-2 flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Average Score</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.avgScore || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Completion Rate</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.completionRate || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Attempts</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.totalAttempts || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/college/teachers">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" /> Add New Teacher
                </Button>
              </Link>
              <Link to="/college/students">
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="w-4 h-4 mr-2" /> Add New Student
                </Button>
              </Link>
              <Link to="/college/exams">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" /> View All Exams
                </Button>
              </Link>
              <Link to="/college/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Subscription
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500">Current Plan</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{stats?.planName || 'Free'}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500">Plan Expires</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {stats?.planExpiry ? formatDate(stats.planExpiry) : 'N/A'}
                </p>
              </div>
              <Link to="/college/subscription">
                <Button variant="outline" className="w-full mt-2">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activities */}
      {stats?.recentActivities?.length > 0 && (
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Activities
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.action?.includes('created') ? 'bg-emerald-100' :
                    activity.action?.includes('updated') ? 'bg-blue-100' :
                    activity.action?.includes('deleted') ? 'bg-red-100' : 'bg-slate-100'
                  }`}>
                    {activity.action?.includes('created') ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : activity.action?.includes('updated') ? (
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Activity className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.user_name} • {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
