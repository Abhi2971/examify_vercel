import { useState, useEffect } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { 
  FileText, 
  Search, 
  Clock, 
  HelpCircle, 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Archive,
  BookOpen,
  FileQuestion,
  Timer,
  Target,
  Eye,
  Lock,
  Shuffle,
  XCircle
} from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary', color: 'text-slate-500 bg-slate-100' },
  published: { label: 'Published', variant: 'info', color: 'text-blue-600 bg-blue-100' },
  live: { label: 'Live', variant: 'success', color: 'text-emerald-600 bg-emerald-100' },
  completed: { label: 'Completed', variant: 'secondary', color: 'text-gray-600 bg-gray-100' },
  flagged: { label: 'Flagged', variant: 'danger', color: 'text-red-600 bg-red-100' },
}

const difficultyColors = {
  easy: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
  medium: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
  hard: 'text-red-600 bg-red-100 dark:bg-red-900/30',
}

export function ExamsPage() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [adminFilter, setAdminFilter] = useState('all')
  const [selectedExam, setSelectedExam] = useState(null)

  useEffect(() => { fetchExams() }, [])

  const fetchExams = async () => {
    try {
      const data = await superAdminApi.getExams()
      setExams(data?.data || data || [])
    } catch (error) {
      console.error('Failed to fetch exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(search.toLowerCase()) || 
                         exam.description?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter
    const matchesType = typeFilter === 'all' || exam.type === typeFilter
    const matchesAdmin = adminFilter === 'all' || exam.scope === adminFilter
    return matchesSearch && matchesStatus && matchesType && matchesAdmin
  })

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getPassRate = (exam) => {
    if (!exam.analytics) return 0
    const { pass_count = 0, completed_attempts = 0 } = exam.analytics
    if (completed_attempts === 0) return 0
    const rate = (pass_count / completed_attempts) * 100
    return Math.min(100, Math.round(rate))
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{exams.length}</p>
                <p className="text-sm text-slate-500">Total Exams</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {exams.filter(e => e.status === 'live' || e.status === 'published').length}
                </p>
                <p className="text-sm text-slate-500">Active Exams</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {exams.reduce((sum, e) => sum + (e.analytics?.total_attempts || 0), 0)}
                </p>
                <p className="text-sm text-slate-500">Total Attempts</p>
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
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {exams.length > 0 ? Math.round(exams.reduce((sum, e) => sum + (e.analytics?.average_score || 0), 0) / exams.length) : 0}%
                </p>
                <p className="text-sm text-slate-500">Avg Score</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Exams</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor and manage all platform exams</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search exams by title or description..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged</option>
            </select>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="manual">Manual</option>
              <option value="ai">AI Generated</option>
              <option value="quiz">Quiz</option>
            </select>
            <select 
              value={adminFilter} 
              onChange={(e) => setAdminFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Exams</option>
              <option value="college">College Admin Exams</option>
              <option value="public">Platform Admin Exams</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Exams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardBody className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const passRate = getPassRate(exam)
            const scopeLabel = exam.scope === 'college' ? 'College' : 'Platform'
            const scopeColor = exam.scope === 'college' ? 'text-purple-600 bg-purple-100' : 'text-cyan-600 bg-cyan-100'
            
            return (
              <Card key={exam._id} hover className="overflow-hidden">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusConfig[exam.status]?.color || 'text-slate-500 bg-slate-100'}`}>
                        {statusConfig[exam.status]?.label || exam.status}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${scopeColor}`}>
                        {scopeLabel}
                      </span>
                    </div>
                    {exam.config?.difficulty && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[exam.config.difficulty] || difficultyColors.medium}`}>
                        {exam.config.difficulty}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {exam.description || 'No description'}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <Timer className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {exam.config?.duration_minutes || 60} min
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <FileQuestion className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {exam.config?.total_questions || 0} Q
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <Users className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {exam.analytics?.total_attempts || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Pass Rate</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{passRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${passRate >= 70 ? 'bg-emerald-500' : passRate >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500">
                      {formatDate(exam.created_at)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedExam(exam)}>
                      <BarChart3 className="w-4 h-4 mr-1" /> Analytics
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No exams found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or create a new exam</p>
          </CardBody>
        </Card>
      )}

      {/* Analytics Modal */}
      {selectedExam && (
        <Modal isOpen={!!selectedExam} onClose={() => setSelectedExam(null)} title="Exam Analytics" size="lg">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedExam.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{selectedExam.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusConfig[selectedExam.status]?.color || 'text-slate-500 bg-slate-100'}`}>
                    {statusConfig[selectedExam.status]?.label || selectedExam.status}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedExam.scope === 'college' ? 'text-purple-600 bg-purple-100' : 'text-cyan-600 bg-cyan-100'}`}>
                    {selectedExam.scope === 'college' ? 'College Admin' : 'Platform Admin'}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs font-medium text-slate-600 bg-slate-100">
                    {selectedExam.type}
                  </span>
                  {selectedExam.config?.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[selectedExam.config.difficulty]}`}>
                      {selectedExam.config.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedExam.analytics?.total_attempts || 0}</p>
                <p className="text-sm text-slate-500">Total Attempts</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <CheckCircle className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedExam.analytics?.completed_attempts || 0}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-center">
                <TrendingUp className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedExam.analytics?.average_score || 0}%</p>
                <p className="text-sm text-slate-500">Avg Score</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                <Target className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{getPassRate(selectedExam)}%</p>
                <p className="text-sm text-slate-500">Pass Rate</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Exam Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Timer className="w-4 h-4" /> Duration</span>
                    <span className="font-medium">{selectedExam.config?.duration_minutes || 60} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><FileQuestion className="w-4 h-4" /> Questions</span>
                    <span className="font-medium">{selectedExam.config?.total_questions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Target className="w-4 h-4" /> Total Marks</span>
                    <span className="font-medium">{selectedExam.config?.total_marks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Passing Marks</span>
                    <span className="font-medium">{selectedExam.config?.passing_marks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Attempts Allowed</span>
                    <span className="font-medium">{selectedExam.config?.attempt_limit || 1}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Security Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Eye className="w-4 h-4" /> Full Screen</span>
                    <Badge variant={selectedExam.config?.full_screen_mode ? 'success' : 'secondary'} size="sm">
                      {selectedExam.config?.full_screen_mode ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Shuffle className="w-4 h-4" /> Randomize</span>
                    <Badge variant={selectedExam.config?.is_randomized ? 'success' : 'secondary'} size="sm">
                      {selectedExam.config?.is_randomized ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><XCircle className="w-4 h-4" /> Negative Marking</span>
                    <Badge variant={selectedExam.config?.negative_marking ? 'danger' : 'secondary'} size="sm">
                      {selectedExam.config?.negative_marking ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Lock className="w-4 h-4" /> Tab Switch Limit</span>
                    <span className="font-medium">{selectedExam.config?.tab_switch_limit || 0} times</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Eye className="w-4 h-4" /> Show Result</span>
                    <Badge variant={selectedExam.config?.show_result_immediately ? 'success' : 'secondary'} size="sm">
                      {selectedExam.config?.show_result_immediately ? 'Immediate' : 'Later'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedExam(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
