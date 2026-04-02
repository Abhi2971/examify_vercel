import { useState, useEffect } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Building2, Plus, Search, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'

export function InstitutesPage() {
  const [institutes, setInstitutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedInstitute, setSelectedInstitute] = useState(null)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    institute_name: '',
    admin_name: '',
    admin_email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => { fetchInstitutes() }, [])

  const fetchInstitutes = async () => {
    try {
      const data = await superAdminApi.getInstitutes()
      setInstitutes(data || [])
    } catch (error) {
      console.error('Failed to fetch institutes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInstitute = async (e) => {
    e.preventDefault()
    
    if (!formData.password) {
      alert('Please set a password for the institute admin')
      return
    }
    
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match')
      return
    }
    
    setCreating(true)
    try {
      await superAdminApi.createInstitute(formData)
      setShowCreateModal(false)
      setFormData({ institute_name: '', admin_name: '', admin_email: '', phone: '', address: '', city: '', state: '', password: '', confirm_password: '' })
      fetchInstitutes()
      alert('Institute created successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create institute')
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

  const passwordStrength = getPasswordStrength(formData.password)

  const handleToggleStatus = async (id) => {
    try {
      await superAdminApi.toggleInstituteStatus(id)
      fetchInstitutes()
    } catch (error) {
      setInstitutes(prev => prev.map(inst => inst._id === id ? { ...inst, is_active: !inst.is_active } : inst))
    }
  }

  const filteredInstitutes = institutes.filter(inst => {
    const matchesSearch = inst.name?.toLowerCase().includes(search.toLowerCase()) || inst.email?.toLowerCase().includes(search.toLowerCase())
    const status = inst.is_active ? 'active' : 'inactive'
    const matchesFilter = filter === 'all' || status === filter
    return matchesSearch && matchesFilter
  })

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Institutes</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all registered colleges and institutions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Institute
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search institutes..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Institute</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-20" /></td>
                    </tr>
                  ))
                ) : filteredInstitutes.map((institute) => (
                  <tr key={institute._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{institute.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{institute.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary">{institute.plan || 'Basic'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      <div>{institute.usage?.teachers_count || 0} Teachers</div>
                      <div className="text-slate-500">{institute.usage?.students_count || 0} Students</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(institute.plan_expiry)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={institute.is_active ? 'success' : 'danger'}>
                        {institute.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedInstitute(institute)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(institute._id)}>
                          {institute.is_active ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filteredInstitutes.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No institutes found</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Institute">
        <form onSubmit={handleCreateInstitute} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Institute Name</label>
            <Input 
              placeholder="Enter institute name" 
              value={formData.institute_name}
              onChange={(e) => setFormData({...formData, institute_name: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Admin Name</label>
            <Input 
              placeholder="Enter admin name" 
              value={formData.admin_name}
              onChange={(e) => setFormData({...formData, admin_name: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Admin Email</label>
            <Input 
              type="email" 
              placeholder="admin@institute.edu" 
              value={formData.admin_email}
              onChange={(e) => setFormData({...formData, admin_email: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Admin Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Set admin password" 
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
                  <span className="text-xs text-slate-500">Password strength</span>
                  <span className={`text-xs font-medium ${passwordStrength.strength === 100 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
                <ul className="mt-2 text-xs text-slate-500 space-y-1">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>One uppercase letter</li>
                  <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>One number</li>
                  <li className={/[!@#$%^&*]/.test(formData.password) ? 'text-green-600' : ''}>One special character</li>
                </ul>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Confirm password" 
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                className="pr-10"
                required 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
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
            {formData.confirm_password && (
              <p className={`mt-1 text-xs ${formData.password === formData.confirm_password ? 'text-green-600' : 'text-red-600'}`}>
                {formData.password === formData.confirm_password ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
              <Input 
                placeholder="Phone number" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">City</label>
              <Input 
                placeholder="City" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              The institute can select and purchase a plan after registration from their dashboard.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={creating || !formData.password || formData.password !== formData.confirm_password || formData.password.length < 8}
            >
              {creating ? 'Creating...' : 'Create Institute'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedInstitute && (
        <Modal isOpen={!!selectedInstitute} onClose={() => setSelectedInstitute(null)} title="Institute Details">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedInstitute.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{selectedInstitute.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Plan</p>
                <Badge variant="primary" className="mt-1">{selectedInstitute.plan || 'Basic'}</Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <Badge variant={selectedInstitute.is_active ? 'success' : 'danger'} className="mt-1">
                  {selectedInstitute.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Teachers</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedInstitute.usage?.teachers_count || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Students</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedInstitute.usage?.students_count || 0}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedInstitute(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
