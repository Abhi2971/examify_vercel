import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { studentCollegeApi } from '../../api/studentCollegeApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { 
  FileText, CheckCircle, Award, Clock, TrendingUp, Calendar,
  ArrowRight, BarChart3, Play, Eye, Trophy, Target, Zap,
  AlertCircle, Timer, BookOpen, RefreshCw, Medal, Star
} from 'lucide-react'

const statCards = [
  { title: 'Available Exams', key: 'availableExams', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
  { title: 'Completed', key: 'completedExams', icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500' },
  { title: 'Average Score', key: 'avgScore', icon: TrendingUp, gradient: 'from-purple-500 to-pink-500', suffix: '%' },
  { title: 'Certificates', key: 'certificates', icon: Award, gradient: 'from-amber-500 to-orange-500' },
]

const quickActions = [
  { label: 'Take Exam', path: '/student-college/exams', icon: Play, color: 'emerald' },
  { label: 'View Results', path: '/student-college/results', icon: Eye, color: 'blue' },
  { label: 'Certificates', path: '/student-college/certificates', icon: Award, color: 'amber' },
  { label: 'Study Materials', path: '/student-college/materials', icon: BookOpen, color: 'purple' },
]

const colorClasses = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

export function StudentCollegeDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [upcomingExams, setUpcomingExams] = useState([])
  const [recentResults, setRecentResults] = useState([])
  const [subjectPerformance, setSubjectPerformance] = useState([])
  const [achievements, setAchievements] = useState([])
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
        statsData = await studentCollegeApi.getDashboardStats()
      } catch {
        await new Promise(resolve => setTimeout(resolve, 400))
        statsData = {
          availableExams: 8,
          completedExams: 15,
          avgScore: 76.5,
          certificates: 4,
          totalAttempts: 18,
          passRate: 83,
          rank: 12
        }
      }
      setStats(statsData)

      // Mock data for additional sections
      setUpcomingExams([
        { id: '1', title: 'Final Mathematics', subject: 'Mathematics', date: '2024-04-05', time: '10:00 AM', duration: 90, totalQuestions: 50 },
        { id: '2', title: 'Physics Mid-Term', subject: 'Physics', date: '2024-04-08', time: '2:00 PM', duration: 60, totalQuestions: 40 },
        { id: '3', title: 'Chemistry Unit Test', subject: 'Chemistry', date: '2024-04-12', time: '11:00 AM', duration: 45, totalQuestions: 30 },
      ])

      setRecentResults([
        { id: '1', exam: 'Quarterly Assessment', subject: 'Mathematics', score: 85, total: 100, passed: true, date: '2024-03-25', rank: 5 },
        { id: '2', exam: 'Unit Test 4', subject: 'Physics', score: 72, total: 100, passed: true, date: '2024-03-20', rank: 12 },
        { id: '3', exam: 'Lab Practical', subject: 'Chemistry', score: 90, total: 100, passed: true, date: '2024-03-18', rank: 3 },
        { id: '4', exam: 'Weekly Quiz', subject: 'Biology', score: 65, total: 100, passed: true, date: '2024-03-15', rank: 18 },
        { id: '5', exam: 'Practice Test', subject: 'Mathematics', score: 45, total: 100, passed: false, date: '2024-03-10', rank: 32 },
      ])

      setSubjectPerformance([
        { subject: 'Mathematics', avgScore: 78, examsCompleted: 5, trend: 'up' },
        { subject: 'Physics', avgScore: 72, examsCompleted: 4, trend: 'up' },
        { subject: 'Chemistry', avgScore: 85, examsCompleted: 3, trend: 'stable' },
        { subject: 'Biology', avgScore: 68, examsCompleted: 3, trend: 'down' },
      ])

      setAchievements([
        { id: '1', title: 'First Certificate', icon: '🏆', description: 'Earned your first certificate', earned: true },
        { id: '2', title: 'Perfect Score', icon: '⭐', description: 'Scored 100% on an exam', earned: true },
        { id: '3', title: 'Top 5', icon: '🥇', description: 'Ranked in top 5', earned: true },
        { id: '4', title: 'Consistent', icon: '🔥', description: 'Passed 10 exams in a row', earned: false },
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeUntil = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = date - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `${days} days`
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
    return <div className="w-4 h-4 flex items-center justify-center text-slate-400">—</div>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'Student'}! Keep up the great work!</p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Upcoming Exams
              </h3>
              <Link to="/student-college/exams" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-primary-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{exam.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{exam.subject}</p>
                    </div>
                    <Badge variant={getTimeUntil(exam.date) === 'Today' ? 'warning' : 'info'}>
                      {getTimeUntil(exam.date)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {exam.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" /> {exam.duration} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {exam.totalQuestions} Qs
                    </span>
                  </div>
                </div>
              ))}
              {upcomingExams.length === 0 && (
                <p className="text-center text-slate-500 py-4">No upcoming exams</p>
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

            {/* Achievements */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Achievements
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-2 rounded-lg text-center ${
                      achievement.earned 
                        ? 'bg-amber-50 dark:bg-amber-900/20' 
                        : 'bg-slate-100 dark:bg-slate-800 opacity-50'
                    }`}
                    title={achievement.description}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Subject Performance
            </h3>
            <div className="space-y-3">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">{subject.subject}</span>
                      {getTrendIcon(subject.trend)}
                    </div>
                    <Badge variant={subject.avgScore >= 70 ? 'success' : subject.avgScore >= 50 ? 'warning' : 'danger'}>
                      {subject.avgScore}%
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        subject.avgScore >= 70 ? 'bg-emerald-500' : 
                        subject.avgScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.avgScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{subject.examsCompleted} exams completed</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardBody className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Results
            </h3>
            <Link to="/student-college/results" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Exam</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium text-center">Score</th>
                  <th className="pb-3 font-medium text-center">Rank</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentResults.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3">
                      <span className="font-medium text-slate-900 dark:text-white">{result.exam}</span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{result.subject}</td>
                    <td className="py-3 text-center">
                      <span className={`font-bold ${result.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                        {result.score}/{result.total}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {result.rank <= 3 && <Medal className={`w-4 h-4 ${
                          result.rank === 1 ? 'text-amber-500' : 
                          result.rank === 2 ? 'text-slate-400' : 'text-amber-700'
                        }`} />}
                        <span className="text-slate-600 dark:text-slate-400">#{result.rank}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      {result.passed ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="w-3 h-3" /> Passed
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="gap-1">
                          <AlertCircle className="w-3 h-3" /> Failed
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 text-right text-slate-500 text-sm">{result.date}</td>
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
