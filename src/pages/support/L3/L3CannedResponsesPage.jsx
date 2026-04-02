import { useEffect, useState } from 'react'
import { supportApi } from '../../../api/supportApi'
import { Modal } from '../../../components/ui/Modal'
import { Plus, Edit2, Trash2, Copy, Eye, AlertCircle, MessageSquare } from 'lucide-react'

/**
 * L3CannedResponsesPage - Canned response template management
 * CRUD for pre-written response templates and categories
 */
export function L3CannedResponsesPage() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingResponse, setEditingResponse] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewResponse, setPreviewResponse] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    response_text: ''
  })
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [responseToDelete, setResponseToDelete] = useState(null)

  const [copySuccess, setCopySuccess] = useState(null)

  const categories = ['general', 'billing', 'technical', 'account', 'escalation', 'closing']

  useEffect(() => {
    const loadResponses = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Use L2 API or mock data
        const mockResponses = [
          {
            id: '1',
            title: 'Default Greeting',
            category: 'general',
            response_text: 'Hello! Thank you for contacting support. How can I help you today?',
            usage_count: 245,
            last_updated: new Date()
          },
          {
            id: '2',
            title: 'Billing Inquiry Response',
            category: 'billing',
            response_text: 'I\'d be happy to help with your billing inquiry. Could you please provide your account details?',
            usage_count: 89,
            last_updated: new Date()
          },
          {
            id: '3',
            title: 'Technical Issue Support',
            category: 'technical',
            response_text: 'Thank you for reporting this issue. Let\'s troubleshoot together. Could you describe the steps to reproduce the problem?',
            usage_count: 156,
            last_updated: new Date()
          }
        ]
        
        setResponses(mockResponses)
      } catch (err) {
        console.error('Failed to load responses:', err)
        setError('Failed to load canned responses')
      } finally {
        setLoading(false)
      }
    }

    loadResponses()
  }, [])

  const openCreateModal = () => {
    setEditingResponse(null)
    setFormData({
      title: '',
      category: 'general',
      response_text: ''
    })
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (response) => {
    setEditingResponse(response)
    setFormData({
      title: response.title,
      category: response.category,
      response_text: response.response_text
    })
    setFormError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingResponse(null)
    setFormError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.response_text) {
      setFormError('Title and response text are required')
      return
    }

    try {
      setSubmitting(true)
      setFormError(null)

      if (editingResponse) {
        const updated = { ...editingResponse, ...formData }
        setResponses(prev => prev.map(r => r.id === editingResponse.id ? updated : r))
      } else {
        const newResponse = {
          id: Date.now().toString(),
          ...formData,
          usage_count: 0,
          last_updated: new Date()
        }
        setResponses(prev => [...prev, newResponse])
      }

      closeModal()
    } catch (err) {
      console.error('Failed to save response:', err)
      setFormError('Failed to save response')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (response) => {
    setResponseToDelete(response)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    setResponses(prev => prev.filter(r => r.id !== responseToDelete.id))
    setShowDeleteConfirm(false)
    setResponseToDelete(null)
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(text)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  const handlePreview = (response) => {
    setPreviewResponse(response)
    setShowPreviewModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  const filteredResponses = responses.filter(r => {
    let match = true
    if (categoryFilter !== 'all' && r.category !== categoryFilter) match = false
    if (searchTerm && !r.title.toLowerCase().includes(searchTerm.toLowerCase())) match = false
    return match
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Canned Responses</h1>
          <p className="text-white/70">Manage pre-written response templates ({responses.length} total)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Response
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Responses List */}
      {filteredResponses.length > 0 ? (
        <div className="space-y-4">
          {filteredResponses.map(response => (
            <div
              key={response.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-white">{response.title}</h3>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400 capitalize">
                      {response.category}
                    </span>
                  </div>
                  <p className="text-white/70 line-clamp-2">{response.response_text}</p>
                  <p className="text-white/50 text-xs mt-2">
                    Used {response.usage_count} times • Last updated {new Date(response.last_updated).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handlePreview(response)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Preview"
                >
                  <Eye size={16} className="text-cyan-400" />
                </button>
                <button
                  onClick={() => handleCopyToClipboard(response.response_text)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} className="text-emerald-400" />
                </button>
                <button
                  onClick={() => openEditModal(response)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} className="text-purple-400" />
                </button>
                <button
                  onClick={() => handleDelete(response)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>

              {/* Copy Success Message */}
              {copySuccess === response.response_text && (
                <div className="mt-4 text-sm text-emerald-400">✓ Copied to clipboard!</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <MessageSquare size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/70">No canned responses found</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingResponse ? 'Edit Response' : 'Create Canned Response'}>
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Response title"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Response Text *</label>
            <textarea
              name="response_text"
              value={formData.response_text}
              onChange={handleInputChange}
              rows="6"
              placeholder="Write your response template here..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {formError && (
            <div className="text-red-400 text-sm">{formError}</div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors"
            >
              {submitting ? 'Saving...' : editingResponse ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} title={previewResponse?.title}>
        <div className="space-y-4">
          {previewResponse && (
            <>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white whitespace-pre-wrap">{previewResponse.response_text}</p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => handleCopyToClipboard(previewResponse.response_text)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-300 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-white/80">
            Are you sure you want to delete <span className="font-semibold">"{responseToDelete?.title}"</span>?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
