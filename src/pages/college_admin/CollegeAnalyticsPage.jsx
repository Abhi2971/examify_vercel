import { useEffect, useState } from 'react'
import { Card, CardBody } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { 
  BarChart3, TrendingUp, Users, GraduationCap, Book, 
  FileText, CheckCircle, BarChart
} from 'lucide-react'

export function CollegeAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await collegeAdminApi.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: 'warning',
      published: 'success',
      completed: 'info',
      active: 'success'
    }
    return colors[status] || 'default'
  }

  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0
    return Math.round((value / total) * 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => <Skeleton key={i} className="h-80" />)}
        </div>
      </div>
    )
  }

  const examsByStatus = analytics?.exams_by_status || {}
  const teacherStats = analytics?.teacher_stats || []
  const studentPerformance = analytics?.student_performance || {}
  const subjectStats = analytics?.subject_stats || []

  const totalExams = Object.values(examsByStatus).reduce((sum, val) => sum + val, 0)
  const totalTeachers = teacherStats.reduce((sum, t) => sum + (t.exams_created || 0), 0)
  const activeTeachers = teacherStats.filter(t => t.is_active).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Detailed performance insights</p>
      </div>

      {/* Exams by Status */}
      <Card>
        <CardBody className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Exams by Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(examsByStatus).map(([status, count]) => (
              <div key={status} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500 capitalize">{status}</span>
                  <Badge variant={getStatusColor(status)}>{count}</Badge>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      status === 'draft' ? 'bg-amber-500' :
                      status === 'published' ? 'bg-emerald-500' :
                      status === 'completed' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${calculatePercentage(count, totalExams)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{calculatePercentage(count, totalExams)}% of total</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Teacher Performance */}
      <Card>
        <CardBody className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> Teacher Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Teacher</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Exams Created</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Total Attempts</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {teacherStats.length > 0 ? (
                  teacherStats.map((teacher, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {teacher.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-sm text-slate-600 dark:text-slate-300">{teacher.exams_created || 0}</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-sm text-slate-600 dark:text-slate-300">{teacher.attempts || 0}</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant={teacher.is_active ? 'success' : 'secondary'}>
                          {teacher.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">No teacher data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Student Performance & Subject Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Performance */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" /> Student Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Average Score</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{studentPerformance.avg_score || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Pass Rate</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{studentPerformance.pass_rate || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Attempts</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{studentPerformance.total_attempts || 0}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Students Attempted</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{studentPerformance.students_attempted || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Subject Analysis */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Book className="w-5 h-5" /> Subject-wise Analysis
            </h3>
            <div className="space-y-3">
              {subjectStats.length > 0 ? (
                subjectStats.map((subject, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{subject.name}</span>
                      </div>
                      <Badge variant="info">{subject.exams_count || 0} exams</Badge>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-indigo-500"
                        style={{ width: `${calculatePercentage(subject.exams_count, Math.max(...subjectStats.map(s => s.exams_count), 1))}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>{subject.students_count || 0} students</span>
                      <span>{subject.attempts_count || 0} attempts</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">No subject data available</div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hover>
          <CardBody className="p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalExams}</p>
            <p className="text-sm text-slate-500">Total Exams</p>
          </CardBody>
        </Card>
        <Card hover>
          <CardBody className="p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{teacherStats.length}</p>
            <p className="text-sm text-slate-500">Total Teachers</p>
          </CardBody>
        </Card>
        <Card hover>
          <CardBody className="p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-100 flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeTeachers}</p>
            <p className="text-sm text-slate-500">Active Teachers</p>
          </CardBody>
        </Card>
        <Card hover>
          <CardBody className="p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{studentPerformance.pass_rate || 0}%</p>
            <p className="text-sm text-slate-500">Pass Rate</p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
