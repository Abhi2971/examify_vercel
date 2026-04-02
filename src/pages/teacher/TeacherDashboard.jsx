import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { teacherApi } from '../../api/teacherApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { 
  FileText, Users, Activity, Award, TrendingUp, Clock, 
  CheckCircle, Plus, BarChart3, ArrowRight, Calendar,
  ClipboardList, BookOpen, PenTool, RefreshCw, Eye,
  AlertCircle, Target, Zap
} from 'lucide-react'

const statCards = [
  { title: 'Total Exams', key: 'totalExams', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
  { title: 'My Students', key: 'totalStudents', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
  { title: 'Active Exams', key: 'activeExams', icon: Activity, gradient: 'from-amber-500 to-orange-500' },
  { title: 'Average Score', key: 'avgScore', icon: Award, gradient: 'from-purple-500 to-pink-500', suffix: '%' },
]

const quickActions = [
  { label: 'Create Exam', path: '/teacher/exams/create', icon: Plus, color: 'emerald' },
  { label: 'Question Bank', path: '/teacher/question-bank', icon: ClipboardList, color: 'blue' },
  { label: 'View Results', path: '/teacher/results', icon: BarChart3, color: 'purple' },
  { label: 'My Exams', path: '/teacher/exams', icon: FileText, color: 'amber' },
]

const colorClasses = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
}

export function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentExams, setRecentExams] = useState([])
  const [recentSubmissions, setRecentSubmissions] = useState([])
  const [performanceBySubject, setPerformanceBySubject] = useState([])
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
        statsData = await teacherApi.getDashboardStats()
      } catch {
        await new Promise(resolve => setTimeout(resolve, 400))
        statsData = {
          totalExams: 12,
          totalStudents: 156,
          activeExams: 3,
          avgScore: 72.5,
          passRate: 78,
          questionsCreated: 245,
          examsTaken: 892
        }
      }
      setStats(statsData)

      // Mock data for additional sections
      setRecentExams([
        { id: '1', title: 'Mid-Term Mathematics', status: 'ongoing', students: 45, dueDate: '2024-04-05', avgScore: 68 },
        { id: '2', title: 'Physics Unit Test 3', status: 'published', students: 38, dueDate: '2024-04-08', avgScore: null },
        { id: '3', title: 'Chemistry Lab Final', status: 'draft', students: 0, dueDate: '2024-04-15', avgScore: null },
        { id: '4', title: 'Science Quiz Week 12', status: 'completed', students: 52, dueDate: '2024-03-28', avgScore: 74 },
      ])

      setRecentSubmissions([
        { id: '1', student: 'Rahul Kumar', exam: 'Mid-Term Mathematics', score: 82, time: '10 mins ago', passed: true },
        { id: '2', student: 'Priya Singh', exam: 'Mid-Term Mathematics', score: 65, time: '25 mins ago', passed: true },
        { id: '3', student: 'Amit Sharma', exam: 'Mid-Term Mathematics', score: 45, time: '1 hour ago', passed: false },
        { id: '4', student: 'Sneha Patel', exam: 'Physics Unit Test 2', score: 88, time: '2 hours ago', passed: true },
        { id: '5', student: 'Vikram Das', exam: 'Physics Unit Test 2', score: 71, time: '3 hours ago', passed: true },
      ])

      setPerformanceBySubject([
        { subject: 'Mathematics', avgScore: 72, students: 45, exams: 4 },
        { subject: 'Physics', avgScore: 68, students: 38, exams: 3 },
        { subject: 'Chemistry', avgScore: 75, students: 42, exams: 3 },
        { subject: 'Biology', avgScore: 80, students: 31, exams: 2 },
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      draft: { variant: 'secondary', label: 'Draft' },
      published: { variant: 'info', label: 'Published' },
      ongoing: { variant: 'warning', label: 'Ongoing' },
      completed: { variant: 'success', label: 'Completed' },
    }
    const { variant, label } = config[status] || config.draft
    return <Badge variant={variant}>{label}</Badge>
  }

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'Teacher'}! Here's your teaching overview.</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.key} hover>
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                    {stats?.[card.key] || 0}{card.suffix || ''}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Performance & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Performance Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Pass Rate</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.passRate || 78}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Questions Created</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.questionsCreated || 245}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Exam Attempts</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats?.examsTaken || 892}</p>
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
          </CardBody>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Subject Performance
            </h3>
            <div className="space-y-3">
              {performanceBySubject.map((subject) => (
                <div key={subject.subject} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-white">{subject.subject}</span>
                    <Badge variant={subject.avgScore >= 70 ? 'success' : subject.avgScore >= 50 ? 'warning' : 'danger'}>
                      {subject.avgScore}%
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        subject.avgScore >= 70 ? 'bg-emerald-500' : 
                        subject.avgScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.avgScore}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{subject.students} students</span>
                    <span>{subject.exams} exams</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Exams & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams */}
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> My Recent Exams
              </h3>
              <Link to="/teacher/exams" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{exam.title}</p>
                      {getStatusBadge(exam.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {exam.students} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {exam.dueDate}
                      </span>
                    </div>
                  </div>
                  {exam.avgScore !== null && (
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{exam.avgScore}%</p>
                      <p className="text-xs text-slate-500">Avg Score</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recent Submissions
              </h3>
              <Link to="/teacher/results" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    submission.passed ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    {submission.passed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white">{submission.student}</p>
                    <p className="text-xs text-slate-500 truncate">{submission.exam}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${submission.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                      {submission.score}%
                    </p>
                    <p className="text-xs text-slate-500">{submission.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
