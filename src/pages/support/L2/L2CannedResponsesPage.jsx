import { useEffect, useState } from 'react'
import { supportApi } from '../../../api/supportApi'
import { Copy, Plus, X, Check } from 'lucide-react'

export function L2CannedResponsesPage() {
  const [responses, setResponses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', category: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await supportApi.l2.getCannedResponses()
        setResponses(data.responses || data || [])
      } catch (err) {
        console.error('Failed to load canned responses:', err)
        setError('Failed to load canned responses. Please try again.')
        setResponses([])
      } finally {
        setLoading(false)
      }
    }

    fetchResponses()
  }, [])

  const categories = [...new Set(responses.map(r => r.category).filter(Boolean))]

  const filteredResponses = selectedCategory
    ? responses.filter(r => r.category === selectedCategory)
    : responses

  const handleCopy = async (content, responseId) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(responseId)
      setSuccessMessage('Copied to clipboard!')
      setTimeout(() => {
        setCopiedId(null)
        setSuccessMessage(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setError('Failed to copy to clipboard')
    }
  }

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsCreating(true)
      setError(null)
      await supportApi.l2.createCannedResponse(formData)
      
      // Refresh responses list
      const data = await supportApi.l2.getCannedResponses()
      setResponses(data.responses || data || [])
      
      // Clear form and close modal
      setFormData({ title: '', content: '', category: '' })
      setShowCreateModal(false)
      setSuccessMessage('Canned response created successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Failed to create canned response:', err)
      setError('Failed to create canned response: ' + (err.message || 'Unknown error'))
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Canned Responses</h1>
          <p className="text-white/70">Pre-written response templates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#00C4B4] hover:bg-[#00B3A3] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          New Response
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 text-emerald-200 flex items-center gap-2">
          <Check size={20} />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {/* Category Filter */}
      {responses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === ''
                ? 'bg-[#00C4B4] text-white'
                : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-[#00C4B4] text-white'
                  : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Responses Grid */}
      {filteredResponses.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/70">
            {responses.length === 0 ? 'No canned responses yet' : 'No responses found for selected category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResponses.map(response => (
            <div
              key={response.response_id || response.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 hover:border-[#00C4B4]/50 transition-all hover:bg-white/8"
            >
              {/* Title */}
              <h3 className="text-white font-semibold mb-2 line-clamp-2">{response.title}</h3>

              {/* Category Badge */}
              {response.category && (
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-1 bg-[#00C4B4]/20 text-[#00C4B4] text-xs rounded font-semibold">
                    {response.category}
                  </span>
                </div>
              )}

              {/* Content Preview */}
              <p className="text-white/60 text-sm mb-4 line-clamp-3">
                {response.content.length > 150
                  ? response.content.substring(0, 150) + '...'
                  : response.content}
              </p>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(response.content, response.response_id || response.id)}
                className="w-full flex items-center justify-center gap-2 bg-[#00C4B4] hover:bg-[#00B3A3] text-white py-2 rounded-lg font-semibold transition-colors"
              >
                {copiedId === (response.response_id || response.id) ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Response</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setFormData({ title: '', content: '', category: '' })
                  setError(null)
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Response title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00C4B4]"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Billing, Technical Support"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00C4B4]"
                />
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Content</label>
                <textarea
                  placeholder="Response content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#00C4B4] resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setFormData({ title: '', content: '', category: '' })
                  setError(null)
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1 bg-[#00C4B4] hover:bg-[#00B3A3] disabled:bg-[#00C4B4]/50 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
