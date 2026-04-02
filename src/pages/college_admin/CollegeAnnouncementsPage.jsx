import { useState, useEffect, useCallback } from 'react'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'
import { 
  Bell, 
  Plus, 
  Send, 
  Clock, 
  User, 
  AlertTriangle, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'

const ITEMS_PER_PAGE = 10

const priorityColors = {
  high: 'danger',
  medium: 'warning',
  normal: 'info'
}

const audienceLabels = {
  all: 'All Users',
  students: 'Students',
  teachers: 'Teachers'
}

function Textarea({ label, error, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed transition-all duration-200 resize-none min-h-[120px]"
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export function CollegeAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [creating, setCreating] = useState(false)
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0
  })

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_audience: 'all',
    priority: 'normal'
  })

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      }
      const data = await collegeAdminApi.getAnnouncements(params)
      setAnnouncements(data?.data || [])
      setPagination(prev => ({
        ...prev,
        total: data?.total || 0,
        totalPages: data?.totalPages || Math.ceil((data?.total || 0) / pagination.limit)
      }))
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.message) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)
    try {
      await collegeAdminApi.createAnnouncement(formData)
      setShowCreateModal(false)
      setFormData({
        title: '',
        message: '',
        target_audience: 'all',
        priority: 'normal'
      })
      fetchAnnouncements()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create announcement')
    } finally {
      setCreating(false)
    }
  }

  const handleViewDetail = (announcement) => {
    setSelectedAnnouncement(announcement)
    setShowDetailModal(true)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'students', label: 'Students Only' },
    { value: 'teachers', label: 'Teachers Only' }
  ]

  const priorityOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6" /> Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage college announcements and notifications
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Announcement
        </Button>
      </div>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No Announcements Yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Create your first announcement to communicate with your college
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Create Announcement
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetail(announcement)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                          {announcement.title}
                        </h3>
                        <Badge variant={priorityColors[announcement.priority] || 'secondary'}>
                          {announcement.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {announcement.priority?.charAt(0).toUpperCase() + announcement.priority?.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {announcement.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {announcement.creator_name || announcement.created_by?.name || 'Admin'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(announcement.created_at)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {audienceLabels[announcement.target_audience] || announcement.target_audience}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetail(announcement)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} announcements
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
            <span className="text-sm text-slate-600 dark:text-slate-400 px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setFormData({
            title: '',
            message: '',
            target_audience: 'all',
            priority: 'normal'
          })
        }}
        title="Create New Announcement"
        size="lg"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter announcement title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <Textarea
            label="Message"
            placeholder="Enter your announcement message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Target Audience"
              options={audienceOptions}
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            />
            
            <Select
              label="Priority"
              options={priorityOptions}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              <Send className="w-4 h-4 mr-2" />
              {creating ? 'Creating...' : 'Publish Announcement'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedAnnouncement(null)
        }}
        title="Announcement Details"
        size="lg"
      >
        {selectedAnnouncement && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedAnnouncement.title}
              </h3>
              <Badge variant={priorityColors[selectedAnnouncement.priority] || 'secondary'}>
                {selectedAnnouncement.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {selectedAnnouncement.priority?.charAt(0).toUpperCase() + selectedAnnouncement.priority?.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-700">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Created by: {selectedAnnouncement.creator_name || selectedAnnouncement.created_by?.name || 'Admin'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(selectedAnnouncement.created_at)}
              </span>
            </div>
            
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {selectedAnnouncement.message}
              </p>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-sm text-slate-500 dark:text-slate-400">Target Audience:</span>
              <Badge variant="secondary">
                {audienceLabels[selectedAnnouncement.target_audience] || selectedAnnouncement.target_audience}
              </Badge>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
