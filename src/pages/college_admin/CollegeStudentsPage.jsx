import { useEffect, useState } from 'react'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { 
  GraduationCap, Plus, Search, Filter, Edit, Trash2, Key, 
  CheckCircle, XCircle, Mail, Award, TrendingUp, Eye, User,
  Copy, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react'

const ITEMS_PER_PAGE = 10

export function CollegeStudentsPage() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [createdStudent, setCreatedStudent] = useState(null)
  const [resetPassword, setResetPassword] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentHistory, setStudentHistory] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    teacher_id: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchTeachers()
  }, [pagination.page, searchQuery, statusFilter])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }
      const response = await collegeAdminApi.getStudents(params)
      const studentsData = Array.isArray(response) ? response : (response?.data || [])
      const meta = response?.meta || {}
      setStudents(studentsData)
      setPagination(prev => ({
        ...prev,
        total: meta.total || 0,
        totalPages: meta.total_pages || Math.ceil((meta.total || 0) / ITEMS_PER_PAGE)
      }))
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await collegeAdminApi.getTeachers({ limit: 100 })
      const teachersData = Array.isArray(response) ? response : (response?.data || [])
      setTeachers(teachersData)
    } catch (error) {
      console.error('Failed to fetch teachers:', error)
    }
  }

  const handleCreateStudent = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.teacher_id) errors.teacher_id = 'Teacher is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setSubmitting(true)
      const result = await collegeAdminApi.createStudent(formData)
      setCreatedStudent(result)
      setIsCreateModalOpen(false)
      setIsPasswordModalOpen(true)
      setFormData({ name: '', email: '', phone: '', teacher_id: '' })
      setFormErrors({})
      fetchStudents()
    } catch (error) {
      console.error('Failed to create student:', error)
      setFormErrors({ submit: error.response?.data?.message || 'Failed to create student' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (student) => {
    try {
      const newStatus = student.status === 'active' ? 'inactive' : 'active'
      await collegeAdminApi.updateStudent(student.id, { status: newStatus })
      fetchStudents()
    } catch (error) {
      console.error('Failed to update student status:', error)
    }
  }

  const handleResetPassword = async () => {
    try {
      const result = await collegeAdminApi.resetStudentPassword(selectedStudent.id)
      setResetPassword(result)
      setIsResetModalOpen(false)
      setIsPasswordModalOpen(true)
    } catch (error) {
      console.error('Failed to reset password:', error)
    }
  }

  const handleViewHistory = async (student) => {
    setSelectedStudent(student)
    setStudentHistory([
      { id: 1, exam_name: 'Mathematics Midterm', score: 85, passed: true, date: '2026-03-15' },
      { id: 2, exam_name: 'Physics Final', score: 72, passed: true, date: '2026-03-10' },
      { id: 3, exam_name: 'Chemistry Quiz', score: 45, passed: false, date: '2026-03-05' },
    ])
    setIsHistoryModalOpen(true)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false)
    setCreatedStudent(null)
    setResetPassword(null)
  }

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge variant="success">Active</Badge> 
      : <Badge variant="danger">Inactive</Badge>
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your institute's students</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Student
        </Button>
      </div>

      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No students found</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{student.teacher_name || 'Not assigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          <span className={`text-sm font-medium ${getScoreColor(student.avg_score)}`}>
                            {student.avg_score || 0}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {student.exams_passed || 0}/{student.total_attempts || 0}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewHistory(student)}
                          title="View History"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student)
                            setIsResetModalOpen(true)
                          }}
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(student)}
                          title={student.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {student.status === 'active' ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && students.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((pagination.page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} students
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setFormData({ name: '', email: '', phone: '', teacher_id: '' })
          setFormErrors({})
        }}
        title="Add New Student"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter student name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter student email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
          />
          <Input
            label="Phone (Optional)"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Assigned Teacher
            </label>
            <select
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {formErrors.teacher_id && (
              <p className="mt-1.5 text-sm text-red-500">{formErrors.teacher_id}</p>
            )}
          </div>
          {formErrors.submit && (
            <p className="text-sm text-red-500">{formErrors.submit}</p>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setFormData({ name: '', email: '', phone: '', teacher_id: '' })
                setFormErrors({})
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create Student
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        title={createdStudent ? "Student Created Successfully" : "Password Reset"}
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                {createdStudent ? "Student created successfully!" : "Password reset successfully!"}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {createdStudent ? "Please copy the login credentials below." : "The new password is:"}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="flex gap-2">
              <Input
                value={createdStudent?.password || resetPassword?.password || ''}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(createdStudent?.password || resetPassword?.password)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Click copy to copy password</p>
          </div>

          {createdStudent && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">Student ID:</span> {createdStudent.student_id}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={closePasswordModal}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Password"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to reset the password for <strong>{selectedStudent?.name}</strong>?
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            A new random password will be generated and displayed.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              <RefreshCw className="w-4 h-4" /> Reset Password
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={`Exam History - ${selectedStudent?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          {studentHistory.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No exam history available</p>
          ) : (
            <div className="space-y-3">
              {studentHistory.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      exam.passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {exam.passed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{exam.exam_name}</p>
                      <p className="text-sm text-slate-500">{exam.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getScoreColor(exam.score)}`}>{exam.score}%</p>
                    <Badge variant={exam.passed ? 'success' : 'danger'}>
                      {exam.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsHistoryModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
