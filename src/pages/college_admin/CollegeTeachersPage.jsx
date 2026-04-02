import { useState, useEffect, useCallback } from 'react'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Key, 
  CheckCircle, 
  XCircle, 
  Mail, 
  BookOpen, 
  FileText, 
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const ITEMS_PER_PAGE = 10

export function CollegeTeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [createdPassword, setCreatedPassword] = useState('')
  const [copied, setCopied] = useState(false)
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0
  })

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalExams: 0,
    totalSubjects: 0,
    totalStudents: 0
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  })

  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }
      const response = await collegeAdminApi.getTeachers(params)
      const teachersData = Array.isArray(response) ? response : (response?.data || [])
      const meta = response?.meta || {}
      setTeachers(teachersData)
      setPagination(prev => ({
        ...prev,
        total: meta.total || 0,
        totalPages: meta.total_pages || Math.ceil((meta.total || 0) / pagination.limit)
      }))
    } catch (error) {
      console.error('Failed to fetch teachers:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, statusFilter])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  const handleCreateTeacher = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)
    try {
      const result = await collegeAdminApi.createTeacher(formData)
      setCreatedPassword(result?.password || '')
      setShowCreateModal(false)
      setShowPasswordModal(true)
      setFormData({ name: '', email: '', phone: '', department: '' })
      fetchTeachers()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create teacher')
    } finally {
      setCreating(false)
    }
  }

  const handleToggleStatus = async (teacherId) => {
    const teacher = teachers.find(t => t._id === teacherId)
    if (!teacher) return

    setActionLoading(teacherId)
    try {
      await collegeAdminApi.updateTeacher(teacherId, { is_active: !teacher.is_active })
      fetchTeachers()
    } catch (error) {
      setTeachers(prev => prev.map(t => 
        t._id === teacherId ? { ...t, is_active: !t.is_active } : t
      ))
    } finally {
      setActionLoading(null)
    }
  }

  const handleResetPassword = async (teacherId) => {
    if (!confirm('Are you sure you want to reset this teacher\'s password?')) return

    setActionLoading(teacherId)
    try {
      const result = await collegeAdminApi.resetTeacherPassword(teacherId)
      setCreatedPassword(result?.password || '')
      setShowPasswordModal(true)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return

    setActionLoading(selectedTeacher._id)
    try {
      await collegeAdminApi.deleteTeacher(selectedTeacher._id)
      setShowDeleteModal(false)
      setSelectedTeacher(null)
      fetchTeachers()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete teacher')
    } finally {
      setActionLoading(null)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getPageNumbers = () => {
    const pages = []
    const total = pagination.totalPages
    const current = pagination.page
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total)
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total)
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total)
      }
    }
    return pages
  }

  const statsCards = [
    { key: 'total', label: 'Total Teachers', icon: Users, gradient: 'from-blue-500 to-indigo-500' },
    { key: 'active', label: 'Active', icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500' },
    { key: 'inactive', label: 'Inactive', icon: XCircle, gradient: 'from-red-500 to-rose-500' },
    { key: 'totalExams', label: 'Exams Created', icon: FileText, gradient: 'from-amber-500 to-orange-500' },
    { key: 'totalSubjects', label: 'Subjects', icon: BookOpen, gradient: 'from-purple-500 to-pink-500' },
    { key: 'totalStudents', label: 'Students', icon: Users, gradient: 'from-cyan-500 to-blue-500' },
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Teachers</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage teachers and their activities</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Teacher
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardBody className="p-4">
                <Skeleton className="h-10 w-10 rounded-lg mb-3" />
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </CardBody>
            </Card>
          ))
        ) : statsCards.map((stat, index) => (
          <Card 
            key={stat.key} 
            hover 
            className="animate-slide-up" 
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardBody className="p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} p-2 mb-3 shadow-md`}>
                <stat.icon className="w-full h-full text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(stats[stat.key] || 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search teachers by name or email..." 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-28" /></td>
                    </tr>
                  ))
                ) : teachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">No teachers found</p>
                    </td>
                  </tr>
                ) : teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{teacher.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                        {teacher.email}
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                          <span>{teacher.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {teacher.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <FileText className="w-4 h-4" />
                          {teacher.exams_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <BookOpen className="w-4 h-4" />
                          {teacher.subjects_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Users className="w-4 h-4" />
                          {teacher.students_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(teacher.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={teacher.is_active ? 'success' : 'danger'}>
                        {teacher.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedTeacher(teacher)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleResetPassword(teacher._id)}
                          disabled={actionLoading === teacher._id}
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleStatus(teacher._id)}
                          disabled={actionLoading === teacher._id}
                          title={teacher.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {teacher.is_active ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setSelectedTeacher(teacher); setShowDeleteModal(true); }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} teachers
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={index} className="px-2 text-slate-400">...</span>
                  ) : (
                    <Button
                      key={index}
                      variant={pagination.page === page ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                    >
                      {page}
                    </Button>
                  )
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Teacher Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Teacher" size="md">
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Enter full name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input 
              type="email" 
              placeholder="teacher@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number
            </label>
            <Input 
              type="tel" 
              placeholder="Enter phone number" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Department
            </label>
            <Input 
              placeholder="e.g., Computer Science, Mathematics" 
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={creating || !formData.name || !formData.email}
            >
              {creating ? 'Creating...' : 'Create Teacher'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Teacher Created Successfully" size="sm">
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please copy and save this password. You won't be able to see it again!
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Generated Password
            </label>
            <div className="flex gap-2">
              <Input 
                value={createdPassword}
                readOnly
                className="font-mono"
              />
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(createdPassword)}
                className="px-3"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowPasswordModal(false)}>Done</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Teacher" size="sm">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-800 dark:text-red-200">
              Are you sure you want to delete this teacher? This action cannot be undone.
            </p>
          </div>
          {selectedTeacher && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <p className="font-medium text-slate-900 dark:text-white">{selectedTeacher.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTeacher.email}</p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteTeacher}
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Delete Teacher'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Teacher Detail Modal */}
      <Modal isOpen={!!selectedTeacher && !showDeleteModal} onClose={() => setSelectedTeacher(null)} title="Teacher Details" size="md">
        {selectedTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedTeacher.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{selectedTeacher.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <Badge variant={selectedTeacher.is_active ? 'success' : 'danger'} className="mt-1">
                  {selectedTeacher.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
                <p className="font-medium text-slate-900 dark:text-white mt-1">{selectedTeacher.department || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                <p className="font-medium text-slate-900 dark:text-white mt-1">{selectedTeacher.phone || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Joined</p>
                <p className="font-medium text-slate-900 dark:text-white mt-1">{formatDate(selectedTeacher.created_at)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <FileText className="w-5 h-5 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTeacher.exams_count || 0}</p>
                <p className="text-xs text-slate-500">Exams</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <BookOpen className="w-5 h-5 mx-auto text-purple-500 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTeacher.subjects_count || 0}</p>
                <p className="text-xs text-slate-500">Subjects</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                <Users className="w-5 h-5 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTeacher.students_count || 0}</p>
                <p className="text-xs text-slate-500">Students</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => handleResetPassword(selectedTeacher._id)}>
                <Key className="w-4 h-4 mr-2" /> Reset Password
              </Button>
              <Button variant="outline" onClick={() => setSelectedTeacher(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
