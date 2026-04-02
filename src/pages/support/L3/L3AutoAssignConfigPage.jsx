import { useEffect, useState } from 'react'
import { supportApi } from '../../../api/supportApi'
import { AlertCircle, Save, Settings } from 'lucide-react'

/**
 * L3AutoAssignConfigPage - Auto-assignment strategy configuration
 * Configure ticket routing rules and auto-escalation settings
 */
export function L3AutoAssignConfigPage() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    tier: 'L1',
    enabled: true,
    assignment_strategy: 'round_robin',
    max_tickets_per_agent: 20,
    auto_escalate_after_hours: 4,
    auto_escalate_after_reassignments: 3,
    skill_matching_weight: 0.7,
    availability_check: true
  })

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        // Try to fetch config - may not exist yet
        const response = await supportApi.l3.saveConfiguration?.('auto_assign', 'L1', {})
          .catch(() => null)
        
        if (response) {
          setConfig(response)
          setFormData(response)
        }
      } catch (err) {
        console.error('Failed to load config:', err)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }

  const handleToggle = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      await supportApi.l3.saveConfiguration('auto_assign', formData.tier, formData)

      setConfig(formData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save config:', err)
      setError('Failed to save configuration')
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
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Auto-Assignment Configuration</h1>
        <p className="text-white/70">Configure ticket routing and auto-escalation rules</p>
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
          <span className="text-green-400">Configuration saved successfully!</span>
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8">
        {/* Tier Selection */}
        <div>
          <label className="block text-white font-medium mb-3">Support Tier</label>
          <div className="flex gap-3">
            {['L1', 'L2', 'L3'].map(tier => (
              <button
                key={tier}
                onClick={() => setFormData(prev => ({ ...prev, tier }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.tier === tier
                    ? 'bg-purple-500/30 text-purple-300'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Enable Auto-Assignment</label>
            <p className="text-white/70 text-sm">Automatically assign tickets to available agents</p>
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

        {/* Assignment Strategy */}
        <div>
          <label className="block text-white font-medium mb-3">Assignment Strategy</label>
          <div className="space-y-3">
            {[
              { value: 'round_robin', label: 'Round Robin', desc: 'Distribute tickets equally' },
              { value: 'load_balancing', label: 'Load Balancing', desc: 'Assign based on current workload' },
              { value: 'skill_based', label: 'Skill-Based', desc: 'Match skills to ticket requirements' }
            ].map(strategy => (
              <label key={strategy.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
                <input
                  type="radio"
                  name="assignment_strategy"
                  value={strategy.value}
                  checked={formData.assignment_strategy === strategy.value}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <div>
                  <p className="text-white font-medium">{strategy.label}</p>
                  <p className="text-white/60 text-sm">{strategy.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Numeric Settings */}
        <div className="space-y-6">
          {/* Max Tickets */}
          <div>
            <label className="block text-white font-medium mb-2">Max Tickets Per Agent</label>
            <input
              type="number"
              name="max_tickets_per_agent"
              value={formData.max_tickets_per_agent}
              onChange={handleInputChange}
              min="1"
              max="100"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-white/60 text-sm mt-2">Maximum concurrent tickets per agent</p>
          </div>

          {/* Auto-Escalate Hours */}
          <div>
            <label className="block text-white font-medium mb-2">Auto-Escalate After (Hours)</label>
            <input
              type="number"
              name="auto_escalate_after_hours"
              value={formData.auto_escalate_after_hours}
              onChange={handleInputChange}
              min="1"
              max="72"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-white/60 text-sm mt-2">Escalate to L2/L3 if not resolved within hours</p>
          </div>

          {/* Auto-Escalate Reassignments */}
          <div>
            <label className="block text-white font-medium mb-2">Auto-Escalate After Reassignments</label>
            <input
              type="number"
              name="auto_escalate_after_reassignments"
              value={formData.auto_escalate_after_reassignments}
              onChange={handleInputChange}
              min="1"
              max="10"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-white/60 text-sm mt-2">Escalate after this many reassignments</p>
          </div>
        </div>

        {/* Skill Matching Weight Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white font-medium">Skill Matching Weight</label>
            <span className="text-purple-400 font-semibold">{(formData.skill_matching_weight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            name="skill_matching_weight"
            min="0"
            max="1"
            step="0.1"
            value={formData.skill_matching_weight}
            onChange={(e) => handleSliderChange('skill_matching_weight', e.target.value)}
            className="w-full accent-purple-500"
          />
          <p className="text-white/60 text-sm mt-2">Higher = prioritize skill matching over availability</p>
        </div>

        {/* Availability Check */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Availability Check</label>
            <p className="text-white/70 text-sm">Only assign to available agents</p>
          </div>
          <button
            onClick={() => handleToggle('availability_check')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              formData.availability_check ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                formData.availability_check ? 'translate-x-6' : ''
              }`}
            />
          </button>
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
              Save Configuration
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
          <Settings size={20} />
          Configuration Tips
        </h3>
        <ul className="text-blue-300/80 text-sm space-y-2">
          <li>• Use Round Robin for simple distribution of equal complexity tickets</li>
          <li>• Use Load Balancing for fair workload distribution when agents have varying speeds</li>
          <li>• Use Skill-Based for specialized domains (billing, technical, account management)</li>
          <li>• Lower skill matching weight improves response time, higher ensures expertise</li>
          <li>• Enable availability check to respect agent schedules and breaks</li>
        </ul>
      </div>
    </div>
  )
}
