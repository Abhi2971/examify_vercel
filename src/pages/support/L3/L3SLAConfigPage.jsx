import { useEffect, useState } from 'react'
import { supportApi } from '../../../api/supportApi'
import { AlertCircle, Save } from 'lucide-react'

/**
 * L3SLAConfigPage - SLA configuration management
 * Set and manage Service Level Agreement targets for each tier
 */
export function L3SLAConfigPage() {
  const [configs, setConfigs] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('L1')

  const [formData, setFormData] = useState({
    first_response_minutes: 30,
    resolution_hours_urgent: 2,
    resolution_hours_standard: 4,
    resolution_hours_low: 8,
    satisfaction_target_percent: 90,
    sla_breach_escalation: true,
    enabled: true
  })

  useEffect(() => {
    const loadConfigs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load SLA config for each tier
        const l1Config = { tier: 'L1', first_response_minutes: 30, resolution_hours_urgent: 2, resolution_hours_standard: 4, resolution_hours_low: 8, satisfaction_target_percent: 90, sla_breach_escalation: true, enabled: true }
        const l2Config = { tier: 'L2', first_response_minutes: 60, resolution_hours_urgent: 4, resolution_hours_standard: 8, resolution_hours_low: 24, satisfaction_target_percent: 88, sla_breach_escalation: true, enabled: true }
        const l3Config = { tier: 'L3', first_response_minutes: 120, resolution_hours_urgent: 8, resolution_hours_standard: 24, resolution_hours_low: 72, satisfaction_target_percent: 85, sla_breach_escalation: false, enabled: true }

        const newConfigs = {}
        newConfigs['L1'] = l1Config
        newConfigs['L2'] = l2Config
        newConfigs['L3'] = l3Config

        setConfigs(newConfigs)
        setFormData(l1Config)
      } catch (err) {
        console.error('Failed to load SLA configs:', err)
        setError('Failed to load SLA configurations')
      } finally {
        setLoading(false)
      }
    }

    loadConfigs()
  }, [])

  const handleTabChange = (tier) => {
    setActiveTab(tier)
    setFormData(configs[tier] || {})
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }))
  }

  const handleToggle = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      await supportApi.l3.saveConfiguration('sla', activeTab, formData)

      setConfigs(prev => ({
        ...prev,
        [activeTab]: formData
      }))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save SLA config:', err)
      setError('Failed to save SLA configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">SLA Configuration</h1>
        <p className="text-white/70">Set Service Level Agreement targets for each support tier</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-green-400" size={20} />
          <span className="text-green-400">SLA configuration saved successfully!</span>
        </div>
      )}

      {/* Tier Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {['L1', 'L2', 'L3'].map(tier => (
          <button
            key={tier}
            onClick={() => handleTabChange(tier)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === tier
                ? 'text-purple-400 border-purple-400'
                : 'text-white/70 hover:text-white border-transparent'
            }`}
          >
            {tier} - {configs[tier]?.tier ? 'Support' : 'Loading...'}
          </button>
        ))}
      </div>

      {/* SLA Configuration Form */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
        {/* First Response Time */}
        <div>
          <label className="block text-white font-medium mb-2">First Response Time (Minutes)</label>
          <input
            type="number"
            name="first_response_minutes"
            value={formData.first_response_minutes || 30}
            onChange={handleInputChange}
            min="5"
            max="480"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
          />
          <p className="text-white/60 text-sm mt-2">Maximum time before first response to customer</p>
        </div>

        {/* Resolution Hours by Priority */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Urgent Resolution (Hours)</label>
            <input
              type="number"
              name="resolution_hours_urgent"
              value={formData.resolution_hours_urgent || 2}
              onChange={handleInputChange}
              min="1"
              max="72"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Standard Resolution (Hours)</label>
            <input
              type="number"
              name="resolution_hours_standard"
              value={formData.resolution_hours_standard || 4}
              onChange={handleInputChange}
              min="1"
              max="72"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Low Priority Resolution (Hours)</label>
            <input
              type="number"
              name="resolution_hours_low"
              value={formData.resolution_hours_low || 8}
              onChange={handleInputChange}
              min="1"
              max="72"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Satisfaction Target */}
        <div>
          <label className="block text-white font-medium mb-2">Satisfaction Target (%)</label>
          <input
            type="number"
            name="satisfaction_target_percent"
            value={formData.satisfaction_target_percent || 90}
            onChange={handleInputChange}
            min="0"
            max="100"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
          />
          <p className="text-white/60 text-sm mt-2">Target customer satisfaction rating</p>
        </div>

        {/* Enable/Disable */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <label className="text-white font-medium">Enable SLA Enforcement</label>
            <p className="text-white/60 text-sm">Enforce this SLA tier</p>
          </div>
          <button
            onClick={() => handleToggle('enabled')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              formData.enabled ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                formData.enabled ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Breach Escalation */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <label className="text-white font-medium">Escalate on SLA Breach</label>
            <p className="text-white/60 text-sm">Automatically escalate when SLA threshold is breached</p>
          </div>
          <button
            onClick={() => handleToggle('sla_breach_escalation')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              formData.sla_breach_escalation ? 'bg-orange-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                formData.sla_breach_escalation ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-blue-400 font-medium mb-3">SLA Summary for {activeTab}</h3>
        <div className="text-blue-300/80 space-y-2 text-sm">
          <p>• <strong>First Response:</strong> Within {formData.first_response_minutes} minutes</p>
          <p>• <strong>Urgent Resolution:</strong> Within {formData.resolution_hours_urgent} hours</p>
          <p>• <strong>Standard Resolution:</strong> Within {formData.resolution_hours_standard} hours</p>
          <p>• <strong>Low Priority Resolution:</strong> Within {formData.resolution_hours_low} hours</p>
          <p>• <strong>Satisfaction Target:</strong> {formData.satisfaction_target_percent}%</p>
          <p>• <strong>Status:</strong> {formData.enabled ? 'Enabled' : 'Disabled'}</p>
          <p>• <strong>Auto-Escalate on Breach:</strong> {formData.sla_breach_escalation ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors font-medium"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save SLA Configuration
            </>
          )}
        </button>
      </div>
    </div>
  )
}
