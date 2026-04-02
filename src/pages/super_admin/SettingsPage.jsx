import { useState } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Settings, Shield, Bell, Puzzle, Save, Eye, EyeOff, Check } from 'lucide-react'
import { clsx } from 'clsx'

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState({
    platform_name: 'Examify',
    platform_logo: 'https://examify.com/logo.png',
    timezone: 'Asia/Kolkata',
    maintenance_mode: false,
    session_timeout: 24,
    razorpay_key: 'rzp_test_xxxxxxxxxx',
    razorpay_secret: 'xxxxxxxxxxxxxxxxxxxx',
    cloudinary_name: 'examify',
    cloudinary_api_key: 'xxxxxxxxxxxxxxxx',
    cloudinary_secret: 'xxxxxxxxxxxxxxxx',
    groq_api_key: 'gsk_xxxxxxxxxxxxxxxxxxxx',
  })

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const maskApiKey = (key) => {
    if (key.length <= 8) return '***'
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4)
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your platform configuration</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-6">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6 space-y-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">Platform Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Platform Name</label>
                  <Input 
                    value={settings.platform_name} 
                    onChange={(e) => setSettings({...settings, platform_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Logo URL</label>
                  <Input 
                    value={settings.platform_logo} 
                    onChange={(e) => setSettings({...settings, platform_logo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Timezone</label>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Maintenance Mode</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Enable Maintenance Mode</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">When enabled, users will see a maintenance page</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, maintenance_mode: !settings.maintenance_mode})}
                  className={clsx(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.maintenance_mode ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                  )}
                >
                  <span className={clsx(
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.maintenance_mode ? 'left-7' : 'left-1'
                  )} />
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6 space-y-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">API Keys</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">JWT Secret</label>
                  <div className="flex gap-2">
                    <Input 
                      type={showApiKey ? 'text' : 'password'}
                      value="super-secret-jwt-key-12345678"
                      className="flex-1"
                      disabled
                    />
                    <Button variant="outline" onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Session Timeout (hours)</label>
                  <Input 
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => setSettings({...settings, session_timeout: parseInt(e.target.value)})}
                    className="w-32"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Razorpay</h3>
                <Badge variant={settings.razorpay_key ? 'success' : 'danger'}>
                  {settings.razorpay_key ? 'Connected' : 'Not Configured'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Key ID</label>
                  <Input 
                    value={settings.razorpay_key}
                    onChange={(e) => setSettings({...settings, razorpay_key: e.target.value})}
                    placeholder="rzp_test_xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Key Secret</label>
                  <Input 
                    type="password"
                    value={settings.razorpay_secret}
                    onChange={(e) => setSettings({...settings, razorpay_secret: e.target.value})}
                    placeholder="xxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Cloudinary</h3>
                <Badge variant={settings.cloudinary_name ? 'success' : 'danger'}>
                  {settings.cloudinary_name ? 'Connected' : 'Not Configured'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cloud Name</label>
                  <Input 
                    value={settings.cloudinary_name}
                    onChange={(e) => setSettings({...settings, cloudinary_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">API Key</label>
                  <Input 
                    value={settings.cloudinary_api_key}
                    onChange={(e) => setSettings({...settings, cloudinary_api_key: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">API Secret</label>
                  <Input 
                    type="password"
                    value={settings.cloudinary_secret}
                    onChange={(e) => setSettings({...settings, cloudinary_secret: e.target.value})}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Groq AI</h3>
                <Badge variant={settings.groq_api_key ? 'success' : 'danger'}>
                  {settings.groq_api_key ? 'Connected' : 'Not Configured'}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">API Key</label>
                <Input 
                  type="password"
                  value={settings.groq_api_key}
                  onChange={(e) => setSettings({...settings, groq_api_key: e.target.value})}
                  placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
