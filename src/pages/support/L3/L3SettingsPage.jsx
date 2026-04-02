import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { AlertCircle, Save, Eye, EyeOff, Lock, Bell, Palette, Shield, Server } from 'lucide-react'

/**
 * L3SettingsPage - User profile and preferences
 * Profile info, preferences, notifications, security, and system settings
 */
export function L3SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'L3 Leader',
    tier: 'L3',
    join_date: user?.created_at || new Date().toISOString()
  })

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notification_frequency: 'immediate',
    report_delivery: 'daily'
  })

  // Notifications
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    escalation_alerts: true,
    sla_breach_alerts: true,
    team_updates: true,
    system_notifications: true
  })

  // Security
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNotificationToggle = (name) => {
    setNotifications(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.current_password || !passwordData.new_password) {
      setError('All password fields are required')
      return
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match')
      return
    }

    try {
      setSaving(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setShowPasswordModal(false)
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleTwoFaToggle = async () => {
    try {
      setSaving(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTwoFaEnabled(!twoFaEnabled)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to update 2FA setting')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: Server }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/70">Manage your profile, preferences, and account security</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-green-400" size={20} />
          <span className="text-green-400">Settings saved successfully!</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/70 opacity-60 cursor-not-allowed"
              />
              <p className="text-white/60 text-sm mt-2">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={profileData.role}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/70 opacity-60 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Support Tier</label>
                <input
                  type="text"
                  value={profileData.tier}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/70 opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Join Date</label>
              <input
                type="text"
                value={formatDate(profileData.join_date)}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/70 opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors"
              >
                <Save size={16} />
                Save Profile
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Theme</label>
              <select
                name="theme"
                value={preferences.theme}
                onChange={handlePreferenceChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Notification Frequency</label>
              <select
                name="notification_frequency"
                value={preferences.notification_frequency}
                onChange={handlePreferenceChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Report Delivery</label>
              <select
                name="report_delivery"
                value={preferences.report_delivery}
                onChange={handlePreferenceChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors"
              >
                <Save size={16} />
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-white/60 text-sm">Enable or disable this notification type</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    value ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors"
              >
                <Save size={16} />
                Save Notifications
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
              <h3 className="text-lg font-bold text-white">Password</h3>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 rounded-lg transition-colors"
              >
                <Lock size={16} />
                Change Password
              </button>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Enable 2FA</p>
                    <p className="text-white/60 text-sm">Add an extra layer of security</p>
                  </div>
                  <button
                    onClick={handleTwoFaToggle}
                    disabled={saving}
                    className={`relative w-14 h-8 rounded-full transition-colors disabled:opacity-50 ${
                      twoFaEnabled ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        twoFaEnabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 space-y-4">
                  <h2 className="text-xl font-bold text-white">Change Password</h2>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Current Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center gap-2 text-white/70 hover:text-white text-sm"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPassword ? 'Hide' : 'Show'} passwords
                  </button>

                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      disabled={saving}
                      className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors"
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">System Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/70">Application Version</span>
                  <span className="text-white font-mono">v3.0.0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/70">API Version</span>
                  <span className="text-white font-mono">v1.2.0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/70">Database Status</span>
                  <span className="text-emerald-400 font-medium">Connected</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-bold text-white mb-4">Session Management</h3>
              <button className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                Logout All Sessions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
