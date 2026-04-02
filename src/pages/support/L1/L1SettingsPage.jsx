import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useSupportTier } from '../../../hooks/useSupportTier'
import { supportApi } from '../../../api/supportApi'
import { Mail, Phone, MapPin, Calendar, Shield, Copy, AlertCircle, CheckCircle, Loader, MessageSquare, Clock, TrendingUp } from 'lucide-react'

export function L1SettingsPage() {
  const { user } = useAuth()
  const { config } = useSupportTier()
  
  // Profile data
  const [profileData, setProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState(null)
  
  // Canned responses
  const [cannedResponses, setCannedResponses] = useState([])
  const [loadingResponses, setLoadingResponses] = useState(true)
  const [responsesError, setResponsesError] = useState(null)
  
  // Form state for profile preferences
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    preferred_category: '',
    working_status: 'online'
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateMessage, setUpdateMessage] = useState(null)
  const [updateError, setUpdateError] = useState(null)
  
  // Canned responses filtering
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedResponseId, setExpandedResponseId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  // Fetch profile data on mount
  useEffect(() => {
    const loadProfileData = async () => {
      setLoadingProfile(true)
      setProfileError(null)
      try {
        const data = await supportApi.l1.getProfile()
        setProfileData(data)
        // Initialize form with fetched data
        setFormData({
          preferred_category: data.preferred_category || '',
          working_status: data.working_status || 'online'
        })
      } catch (error) {
        console.error('Failed to load profile:', error)
        setProfileError('Failed to load profile data. Please try again.')
      } finally {
        setLoadingProfile(false)
      }
    }
    
    loadProfileData()
  }, [])

  // Fetch canned responses on mount
  useEffect(() => {
    const loadCannedResponses = async () => {
      setLoadingResponses(true)
      setResponsesError(null)
      try {
        const data = await supportApi.l1.getCannedResponses()
        setCannedResponses(Array.isArray(data) ? data : data.responses || [])
      } catch (error) {
        console.error('Failed to load canned responses:', error)
        setResponsesError('Failed to load canned responses. Please try again.')
      } finally {
        setLoadingResponses(false)
      }
    }
    
    loadCannedResponses()
  }, [])

  // Handle profile update
  const handleUpdateProfile = async () => {
    setUpdateLoading(true)
    setUpdateError(null)
    setUpdateMessage(null)
    
    try {
      await supportApi.l1.updateProfile({
        preferred_category: formData.preferred_category,
        working_status: formData.working_status
      })
      setUpdateMessage('Profile preferences updated successfully!')
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateMessage(null), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      setUpdateError('Failed to update profile. Please try again.')
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/70">Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
        
        {loadingProfile ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
          </div>
        ) : profileError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-400">{profileError}</span>
          </div>
        ) : profileData ? (
          <>
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-3xl">
                  {profileData.agent_name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{profileData.agent_name || user?.name || 'Support Agent'}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Shield size={16} className="text-blue-400" />
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-400`}>
                    L1 Support
                  </span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={18} className="text-white/60" />
                  <label className="text-white/60 text-sm font-medium">Email</label>
                </div>
                <p className="text-white font-medium">{profileData.email || '-'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={18} className="text-white/60" />
                  <label className="text-white/60 text-sm font-medium">Support Tier</label>
                </div>
                <p className="text-white font-medium">L1</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={18} className="text-white/60" />
                  <label className="text-white/60 text-sm font-medium">Tickets Handled</label>
                </div>
                <p className="text-white font-medium">{profileData.tickets_handled || 0}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-white/60" />
                  <label className="text-white/60 text-sm font-medium">Avg Resolution Time</label>
                </div>
                <p className="text-white font-medium">{profileData.avg_resolution_time ? `${Math.round(profileData.avg_resolution_time)} min` : '-'}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-white/60" />
                  <label className="text-white/60 text-sm font-medium">Customer Satisfaction</label>
                </div>
                <p className="text-white font-medium">{profileData.customer_satisfaction_score ? `${Math.round(profileData.customer_satisfaction_score)}%` : '-'}</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Profile Preferences */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Profile Preferences</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#00C4B4] hover:bg-[#00C4B4]/80 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Edit
            </button>
          )}
        </div>

        {updateMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="text-emerald-400">{updateMessage}</span>
          </div>
        )}

        {updateError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-400">{updateError}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={(e) => {
            e.preventDefault()
            handleUpdateProfile()
          }} className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Preferred Category</label>
              <select
                value={formData.preferred_category}
                onChange={(e) => setFormData({ ...formData, preferred_category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select a category</option>
                {[...new Set(cannedResponses.map(r => r.category))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Working Status</label>
              <select
                value={formData.working_status}
                onChange={(e) => setFormData({ ...formData, working_status: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="busy">Busy</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateLoading}
                className="px-4 py-2 bg-[#00C4B4] hover:bg-[#00C4B4]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                {updateLoading && <Loader size={16} className="animate-spin" />}
                {updateLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setUpdateMessage(null)
                  setUpdateError(null)
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/70 text-sm font-medium block mb-2">Preferred Category</label>
              <p className="text-white font-medium">{formData.preferred_category || 'Not set'}</p>
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium block mb-2">Working Status</label>
              <p className="text-white font-medium capitalize">{formData.working_status}</p>
            </div>
          </div>
        )}
      </div>

      {/* SLA Information */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">SLA Targets for L1 Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <p className="text-white/70 text-sm mb-2">First Response Time</p>
            <p className="text-3xl font-bold text-emerald-400">30 minutes</p>
            <p className="text-white/60 text-xs mt-2">For all ticket priorities</p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <p className="text-white/70 text-sm mb-2">Resolution Time</p>
            <p className="text-3xl font-bold text-blue-400">2-4 hours</p>
            <p className="text-white/60 text-xs mt-2">Depending on ticket complexity</p>
          </div>
        </div>
      </div>

      {/* Canned Responses */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Canned Responses</h2>
        
        {loadingResponses ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
          </div>
        ) : responsesError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <span className="text-red-400">{responsesError}</span>
          </div>
        ) : cannedResponses.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-white/40 mb-4" />
            <p className="text-white/70">No canned responses available</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-white/70 text-sm font-medium mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Categories</option>
                {[...new Set(cannedResponses.map(r => r.category))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {cannedResponses
                .filter(response => selectedCategory === 'all' || response.category === selectedCategory)
                .map(response => (
                  <div key={response.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 cursor-pointer" onClick={() => setExpandedResponseId(expandedResponseId === response.id ? null : response.id)}>
                        <h4 className="text-white font-semibold mb-1">{response.title}</h4>
                        <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded inline-block mb-2">{response.category}</span>
                        <p className="text-white/60 text-sm">{response.content.substring(0, 100)}{response.content.length > 100 ? '...' : ''}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(response.content)
                          setCopiedId(response.id)
                          setTimeout(() => setCopiedId(null), 2000)
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedId === response.id ? (
                          <CheckCircle className="text-emerald-400" size={20} />
                        ) : (
                          <Copy className="text-white/60 hover:text-white" size={20} />
                        )}
                      </button>
                    </div>

                    {expandedResponseId === response.id && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-white/80 text-sm whitespace-pre-wrap">{response.content}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(response.content)
                            setCopiedId(response.id)
                            setTimeout(() => setCopiedId(null), 2000)
                          }}
                          className="mt-3 px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded text-xs transition-colors flex items-center gap-2"
                        >
                          {copiedId === response.id ? (
                            <>
                              <CheckCircle size={14} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy Full Response
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {/* Note */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <p className="text-white/70 text-sm">
          You can manage your profile preferences above. For account changes or tier updates, contact an L3 Lead.
        </p>
      </div>
    </div>
  )
}
