import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { supportApi } from '../../../api/supportApi'
import { Modal } from '../../../components/ui/Modal'
import { Plus, Edit2, Trash2, AlertCircle, Users, CheckCircle } from 'lucide-react'

/**
 * L3TeamManagementPage - Team member CRUD
 * Create, read, update, delete team members with skills and workload management
 */
export function L3TeamManagementPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tierFilter, setTierFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Create/Edit modal
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tier: 'L1',
    role: 'agent',
    skills: [],
    max_tickets: 20,
    notes: ''
  })
  const [formError, setFormError] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)

  const skillOptions = ['billing', 'technical', 'account', 'billing_expert', 'senior_tech', 'team_management']
  const tierOptions = ['L1', 'L2', 'L3']
  const roleOptions = ['agent', 'supervisor', 'leader']

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await supportApi.l3.getTeamMembers()
        setMembers(response || [])
      } catch (err) {
        console.error('Failed to load team members:', err)
        setError('Failed to load team members')
      } finally {
        setLoading(false)
      }
    }

    loadMembers()
  }, [])

  const openCreateModal = () => {
    setEditingMember(null)
    setFormData({
      name: '',
      email: '',
      tier: 'L1',
      role: 'agent',
      skills: [],
      max_tickets: 20,
      notes: ''
    })
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name || '',
      email: member.email || '',
      tier: member.tier || 'L1',
      role: member.role || 'agent',
      skills: member.skills || [],
      max_tickets: member.max_tickets || 20,
      notes: member.notes || ''
    })
    setFormError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMember(null)
    setFormError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_tickets' ? parseInt(value) : value
    }))
  }

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setFormError('Name and email are required')
      return
    }

    try {
      setSubmitLoading(true)
      setFormError(null)

      if (editingMember) {
        await supportApi.l3.updateTeamMember(editingMember.id, formData)
        setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...formData } : m))
      } else {
        const newMember = await supportApi.l3.createTeamMember(formData)
        setMembers(prev => [...prev, newMember])
      }

      closeModal()
    } catch (err) {
      console.error('Failed to save member:', err)
      setFormError('Failed to save member. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = (member) => {
    setMemberToDelete(member)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      await supportApi.l3.deleteTeamMember(memberToDelete.id)
      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id))
      setShowDeleteConfirm(false)
      setMemberToDelete(null)
    } catch (err) {
      console.error('Failed to delete member:', err)
      setError('Failed to delete member')
    }
  }

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Filter members
  const filteredMembers = members.filter(member => {
    let match = true
    if (tierFilter !== 'all' && member.tier !== tierFilter) match = false
    if (roleFilter !== 'all' && member.role !== roleFilter) match = false
    if (searchTerm && !member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !member.email.toLowerCase().includes(searchTerm.toLowerCase())) match = false
    return match
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
          <p className="text-white/70">Manage support team members and their assignments</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="all">All Tiers</option>
          {tierOptions.map(tier => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="all">All Roles</option>
          {roleOptions.map(role => (
            <option key={role} value={role}>{role}</option>
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

      {/* Team Members Table */}
      {filteredMembers.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left text-white/70">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Skills</th>
                  <th className="px-6 py-4">Workload</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{member.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70 text-xs">{member.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        member.tier === 'L1' ? 'bg-blue-500/20 text-blue-400' :
                        member.tier === 'L2' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {member.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80 capitalize">{member.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {member.skills?.slice(0, 3).map(skill => (
                          <span key={skill} className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {member.skills?.length > 3 && (
                          <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                            style={{ width: `${Math.min(member.workload_percentage || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-white/70 text-xs">{member.workload_percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {member.performance_rating > 0 && (
                          <>
                            <span className="text-yellow-400">★</span>
                            <span className="text-white/80">{(member.performance_rating || 0).toFixed(1)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Edit2 size={16} className="text-purple-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <Users size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/70">No team members found</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingMember ? 'Edit Team Member' : 'Add Team Member'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Tier</label>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
              >
                {tierOptions.map(tier => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Max Tickets</label>
            <input
              type="number"
              name="max_tickets"
              value={formData.max_tickets}
              onChange={handleInputChange}
              min="1"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Skills</label>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map(skill => (
                <label key={skill} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="rounded border-white/20 text-purple-500"
                  />
                  <span className="text-white text-sm capitalize">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Additional notes..."
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
              disabled={submitLoading}
              className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 disabled:opacity-50 text-purple-300 rounded-lg transition-colors flex items-center gap-2"
            >
              {submitLoading ? (
                <div className="w-4 h-4 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              {editingMember ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-white/80">
            Are you sure you want to delete <span className="font-semibold">{memberToDelete?.name}</span>? This will mark them as inactive.
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
