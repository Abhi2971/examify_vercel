import { useState, useEffect } from 'react'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { 
  FileText, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Eye, 
  ArrowRight, 
  Calendar
} from 'lucide-react'

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary', color: 'text-slate-500 bg-slate-100' },
  published: { label: 'Published', variant: 'info', color: 'text-blue-600 bg-blue-100' },
  live: { label: 'Live', variant: 'success', color: 'text-emerald-600 bg-emerald-100' },
  completed: { label: 'Completed', variant: 'secondary', color: 'text-gray-600 bg-gray-100' },
}

export function CollegeExamsPage() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [examDetail, setExamDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [teacherFilter, setTeacherFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('all')
  
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchExams()
    fetchFilters()
  }, [pagination.page, pagination.limit])

  const fetchExams = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        teacher_id: teacherFilter !== 'all' ? teacherFilter : undefined,
        subject_id: subjectFilter !== 'all' ? subjectFilter : undefined,
      }
      const response = await collegeAdminApi.getExams(params)
      const examsData = Array.isArray(response) ? response : (response?.data || [])
      const meta = response?.meta || {}
      setExams(examsData)
      setPagination(prev => ({
        ...prev,
        total: meta.total || 0,
        totalPages: meta.total_pages || Math.ceil((meta.total || 0) / pagination.limit)
      }))
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const [teachersResponse, subjectsResponse] = await Promise.all([
        collegeAdminApi.getTeachers(),
        collegeAdminApi.getSubjects()
      ])
      const teachersData = Array.isArray(teachersResponse) ? teachersResponse : (teachersResponse?.data || [])
      const subjectsData = Array.isArray(subjectsResponse) ? subjectsResponse : (subjectsResponse?.data || [])
      setTeachers(teachersData)
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Failed to fetch filters:', error)
    }
  }

  const fetchExamDetail = async (examId) => {
    setDetailLoading(true)
    try {
      const data = await collegeAdminApi.getExamDetail(examId)
      setExamDetail(data)
    } catch (error) {
      console.error('Failed to fetch exam detail:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleViewExam = async (exam) => {
    setShowDetailModal(true)
    await fetchExamDetail(exam._id)
  }

  const handleFilterChange = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchExams()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== '') {
        handleFilterChange()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    handleFilterChange()
  }, [statusFilter, teacherFilter, subjectFilter])

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getTotalAttempts = () => exams.reduce((sum, e) => sum + (e.analytics?.total_attempts || 0), 0)
  const getCompletionRate = () => {
    const total = exams.reduce((sum, e) => sum + (e.analytics?.total_attempts || 0), 0)
    const completed = exams.reduce((sum, e) => sum + (e.analytics?.completed_attempts || 0), 0)
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }
  const getAverageScore = () => {
    const validExams = exams.filter(e => e.analytics?.average_score > 0)
    if (validExams.length === 0) return 0
    const sum = validExams.reduce((s, e) => s + (e.analytics?.average_score || 0), 0)
    return Math.round(sum / validExams.length)
  }

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500">
          Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{getTotalAttempts()}</p>
                <p className="text-sm text-slate-500">Total Attempts</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{getCompletionRate()}%</p>
                <p className="text-sm text-slate-500">Completion Rate</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{getAverageScore()}%</p>
                <p className="text-sm text-slate-500">Average Score</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Exams</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage all college exams</p>
        </div>
      </div>

      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search exams..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
              <select 
                value={teacherFilter} 
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="all">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name || teacher.email}
                  </option>
                ))}
              </select>
              <select 
                value={subjectFilter} 
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardBody className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : exams.length > 0 ? (
        <Card>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {exams.map((exam) => (
              <CardBody key={exam._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusConfig[exam.status]?.color || 'text-slate-500 bg-slate-100'}`}>
                          {statusConfig[exam.status]?.label || exam.status}
                        </span>
                        {exam.subject?.name && (
                          <Badge variant="outline" size="sm">{exam.subject.name}</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                        {exam.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                        {exam.teacher?.name && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" /> {exam.teacher.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {exam.config?.duration_minutes || 60} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {formatDate(exam.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 md:items-center">
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{exam.analytics?.total_attempts || 0}</p>
                        <p className="text-xs text-slate-500">Attempts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{exam.analytics?.average_score || 0}%</p>
                        <p className="text-xs text-slate-500">Avg Score</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewExam(exam)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            ))}
          </div>
          {renderPagination()}
        </Card>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No exams found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
          </CardBody>
        </Card>
      )}

      <Modal isOpen={showDetailModal} onClose={() => { setShowDetailModal(false); setExamDetail(null) }} title="Exam Details" size="xl">
        {detailLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        ) : examDetail ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{examDetail.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{examDetail.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusConfig[examDetail.status]?.color || 'text-slate-500 bg-slate-100'}`}>
                    {statusConfig[examDetail.status]?.label || examDetail.status}
                  </span>
                  {examDetail.subject?.name && (
                    <Badge variant="outline" size="sm">{examDetail.subject.name}</Badge>
                  )}
                  {examDetail.teacher?.name && (
                    <Badge variant="secondary" size="sm">{examDetail.teacher.name}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{examDetail.analytics?.total_attempts || 0}</p>
                <p className="text-sm text-slate-500">Total Attempts</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <CheckCircle className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{examDetail.analytics?.completed_attempts || 0}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-center">
                <TrendingUp className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{examDetail.analytics?.average_score || 0}%</p>
                <p className="text-sm text-slate-500">Avg Score</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                <Clock className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{examDetail.config?.duration_minutes || 60}</p>
                <p className="text-sm text-slate-500">Minutes</p>
              </div>
            </div>

            {examDetail.attempts && examDetail.attempts.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Attempt History</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {examDetail.attempts.map((attempt, idx) => (
                    <div key={attempt._id || idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
                          {attempt.student?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{attempt.student?.name || 'Student'}</p>
                          <p className="text-xs text-slate-500">{formatDate(attempt.submitted_at || attempt.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">{attempt.score || 0}%</p>
                        <p className="text-xs text-slate-500">{attempt.status || 'Completed'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => { setShowDetailModal(false); setExamDetail(null) }}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">Failed to load exam details</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
