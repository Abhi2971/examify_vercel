import { useState, useEffect } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Users, Plus, Search, Eye, CheckCircle, XCircle, Shield, GraduationCap, HeadphonesIcon, Building2, UserCheck, UserPlus } from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'

const roleConfig = {
  super_admin: { label: 'Super Admin', color: 'danger' },
  admin_college: { label: 'College Admin', color: 'purple' },
  admin_public: { label: 'Platform Admin', color: 'info' },
  teacher: { label: 'Teacher', color: 'orange' },
  student_college: { label: 'College Student', color: 'success' },
  student_public: { label: 'Public Student', color: 'info' },
  support_agent: { label: 'Support Agent', color: 'warning' },
}

const creatableRoles = [
  { value: 'admin_public', label: 'Platform Admin', description: 'Manages platform settings and configurations', icon: Shield, color: 'text-blue-600' },
  { value: 'support_agent', label: 'Support Agent', description: 'Handles support tickets and user queries', icon: HeadphonesIcon, color: 'text-yellow-600' },
]

const tierConfig = {
  l1: { label: 'L1 Support', desc: 'Handle basic queries and common issues', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-500' },
  l2: { label: 'L2 Support', desc: 'Technical issues and complex problems', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', icon: 'text-purple-500' },
  l3: { label: 'L3 Lead', desc: 'Team management and escalations', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', icon: 'text-amber-500' },
}

const roleIcons = {
  super_admin: Shield,
  admin_college: Shield,
  admin_public: Shield,
  teacher: Users,
  student_college: GraduationCap,
  student_public: GraduationCap,
  support_agent: HeadphonesIcon,
}

const statsConfig = [
  { key: 'total', label: 'Total Users', icon: Users, gradient: 'from-blue-500 to-indigo-500' },
  { key: 'admin_college', label: 'College Admins', icon: Building2, gradient: 'from-purple-500 to-pink-500' },
  { key: 'admin_public', label: 'Platform Admins', icon: Shield, gradient: 'from-cyan-500 to-blue-500' },
  { key: 'teacher', label: 'Teachers', icon: UserCheck, gradient: 'from-emerald-500 to-teal-500' },
  { key: 'student_college', label: 'College Students', icon: GraduationCap, gradient: 'from-amber-500 to-orange-500' },
  { key: 'support_agent', label: 'Support Agents', icon: HeadphonesIcon, gradient: 'from-rose-500 to-pink-500' },
]

export function UsersPage() {
  const [users, setUsers] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'admin_public',
    support_tier: 'l1'
  })

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const data = await superAdminApi.getUsers()
      setUsers(data?.users || [])
      setCounts(data?.counts || {})
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields')
      return
    }
    
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }
    
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match')
      return
    }
    
    setCreating(true)
    try {
      const payload = { ...formData }
      if (formData.role !== 'support_agent') {
        delete payload.support_tier
      }
      await superAdminApi.createUser(payload)
      setShowCreateModal(false)
      setFormData({ name: '', email: '', password: '', confirm_password: '', role: 'admin_public', support_tier: 'l1' })
      fetchUsers()
      alert('User created successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*]/.test(password)) strength++
    if (strength <= 1) return { strength: 25, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 2) return { strength: 50, label: 'Fair', color: 'bg-orange-500' }
    if (strength <= 3) return { strength: 75, label: 'Good', color: 'bg-yellow-500' }
    return { strength: 100, label: 'Strong', color: 'bg-green-500' }
  }

  const handleToggleStatus = async (id) => {
    try {
      await superAdminApi.toggleUserStatus(id)
      fetchUsers()
    } catch (error) {
      setUsers(prev => prev.map(u => u._id === id ? { ...u, is_active: !u.is_active } : u))
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const userStatus = user.is_active ? 'active' : 'inactive'
    const matchesStatus = statusFilter === 'all' || userStatus === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all users across the platform</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add User
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
        ) : statsConfig.map((stat, index) => (
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
                {(counts[stat.key] || 0).toLocaleString()}
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
                placeholder="Search users..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Roles</option>
              {Object.entries(roleConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Institute</th>
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
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-20" /></td>
                    </tr>
                  ))
                ) : filteredUsers.map((user) => {
                  const RoleIcon = roleIcons[user.role] || Users
                  return (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <RoleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={roleConfig[user.role]?.color || 'secondary'}>
                          {roleConfig[user.role]?.label || user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {user.institute_name || (user.role === 'student_public' ? '—' : 'N/A')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.is_active ? 'success' : 'danger'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user._id)}>
                            {user.is_active ? (
                              <XCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No users found</p>
            </div>
          )}
          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create User Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <Input 
              placeholder="Enter full name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <Input 
              type="email" 
              placeholder="user@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Role</label>
            <div className="space-y-2">
              {creatableRoles.map(role => {
                const RoleIcon = role.icon
                return (
                  <label 
                    key={role.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.role === role.value 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <RoleIcon className={`w-4 h-4 ${role.color}`} />
                        <span className="font-medium text-slate-900 dark:text-white">{role.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {formData.role === 'support_agent' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Support Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(tierConfig).map(([tier, config]) => (
                  <label
                    key={tier}
                    className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.support_tier === tier
                        ? `${config.border} ${config.bg}`
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="support_tier"
                      value={tier}
                      checked={formData.support_tier === tier}
                      onChange={(e) => setFormData({...formData, support_tier: e.target.value})}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${formData.support_tier === tier ? config.text : 'text-slate-700 dark:text-slate-300'}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-slate-500 text-center mt-1">{config.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Set password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="pr-10"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Strength</span>
                  <span className={`text-xs font-medium ${passwordStrength.strength === 100 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
            <Input 
              type="password" 
              placeholder="Confirm password" 
              value={formData.confirm_password}
              onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              required 
            />
            {formData.confirm_password && (
              <p className={`mt-1 text-xs ${formData.password === formData.confirm_password ? 'text-green-600' : 'text-red-600'}`}>
                {formData.password === formData.confirm_password ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={creating || !formData.name || !formData.email || !formData.password || formData.password !== formData.confirm_password}
            >
              {creating ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedUser && (
        <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                {(() => {
                  const RoleIcon = roleIcons[selectedUser.role] || Users
                  return <RoleIcon className="w-8 h-8 text-white" />
                })()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
                <Badge variant={roleConfig[selectedUser.role]?.color || 'secondary'} className="mt-1">
                  {roleConfig[selectedUser.role]?.label || selectedUser.role}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <Badge variant={selectedUser.is_active ? 'success' : 'danger'} className="mt-1">
                  {selectedUser.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {selectedUser.role === 'support_agent' && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-sm text-amber-600 dark:text-amber-400">Support Tier</p>
                  <Badge variant="warning" className="mt-1">
                    {(selectedUser.support_tier || 'l1').toUpperCase()} - {selectedUser.support_tier === 'l3' ? 'Lead' : selectedUser.support_tier === 'l2' ? 'Technical' : 'Basic'}
                  </Badge>
                </div>
              )}
              {selectedUser.role === 'support_agent' && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Availability</p>
                  <Badge variant={selectedUser.is_available ? 'success' : 'secondary'} className="mt-1">
                    {selectedUser.is_available ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              )}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Institute</p>
                <p className="font-medium text-slate-900 dark:text-white mt-1">{selectedUser.institute_name || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Joined</p>
                <p className="font-medium text-slate-900 dark:text-white mt-1">{formatDate(selectedUser.created_at)}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
