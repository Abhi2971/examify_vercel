import { useState, useEffect } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Plus, Edit, Trash2, Check, CreditCard, Sparkles, Users, BookOpen, FileText, Zap, Shield, Database, Headphones } from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'

const planColors = {
  college: 'from-blue-500 to-violet-500',
  student_ai: 'from-purple-500 to-pink-500',
}

const collegeFeaturesList = [
  { key: 'max_teachers', label: 'Teachers', icon: Users },
  { key: 'max_students', label: 'Students', icon: Users },
  { key: 'max_exams', label: 'Exams', icon: FileText },
  { key: 'max_storage_gb', label: 'Storage (GB)', icon: Database },
  { key: 'ai_assistant', label: 'AI Assistant', icon: Zap },
  { key: 'custom_branding', label: 'Custom Branding', icon: Shield },
  { key: 'priority_support', label: 'Priority Support', icon: Headphones },
  { key: 'analytics', label: 'Analytics Dashboard', icon: BookOpen },
]

const aiFeaturesList = [
  { key: 'queries_per_day', label: 'Queries/Day', icon: Zap },
  { key: 'max_exams', label: 'Practice Exams', icon: FileText },
  { key: 'study_materials', label: 'Study Materials', icon: BookOpen },
  { key: 'ai_tutor', label: 'AI Tutor', icon: Users },
]

export function PlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planType, setPlanType] = useState('college')
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    validity_days: '30',
    type: 'college',
    features: {
      max_teachers: '5',
      max_students: '100',
      max_exams: '20',
      max_storage_gb: '10',
      ai_assistant: false,
      custom_branding: false,
      priority_support: false,
      analytics: false,
    }
  })

  useEffect(() => { fetchPlans() }, [])

  const fetchPlans = async () => {
    try {
      const data = await superAdminApi.getPlans()
      setPlans(data?.plans || [])
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = (type) => {
    setPlanType(type)
    setEditingPlan(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      validity_days: '30',
      type,
      features: {
        max_teachers: '5',
        max_students: '100',
        max_exams: '20',
        max_storage_gb: '10',
        ai_assistant: false,
        custom_branding: false,
        priority_support: false,
        analytics: false,
      }
    })
    setShowCreateModal(true)
  }

  const openEditModal = (plan) => {
    setEditingPlan(plan)
    setPlanType(plan.type)
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price?.toString() || '',
      validity_days: plan.validity_days?.toString() || '30',
      type: plan.type,
      features: {
        max_teachers: plan.features?.max_teachers?.toString() || '5',
        max_students: plan.features?.max_students?.toString() || '100',
        max_exams: plan.features?.max_exams?.toString() || '20',
        max_storage_gb: plan.features?.max_storage_gb?.toString() || '10',
        ai_assistant: plan.features?.ai_assistant || false,
        custom_branding: plan.features?.custom_branding || false,
        priority_support: plan.features?.priority_support || false,
        analytics: plan.features?.analytics || false,
      }
    })
    setShowCreateModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price) {
      alert('Please fill in plan name and price')
      return
    }
    
    const features = {}
    if (planType === 'college') {
      features.max_teachers = formData.features.max_teachers === '' ? -1 : parseInt(formData.features.max_teachers)
      features.max_students = formData.features.max_students === '' ? -1 : parseInt(formData.features.max_students)
      features.max_exams = formData.features.max_exams === '' ? -1 : parseInt(formData.features.max_exams)
      features.max_storage_gb = formData.features.max_storage_gb === '' ? -1 : parseInt(formData.features.max_storage_gb)
      features.ai_assistant = formData.features.ai_assistant
      features.custom_branding = formData.features.custom_branding
      features.priority_support = formData.features.priority_support
      features.analytics = formData.features.analytics
    } else {
      features.queries_per_day = formData.features.max_teachers === '' ? -1 : parseInt(formData.features.max_teachers)
    }
    
    const planData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      validity_days: parseInt(formData.validity_days) || 30,
      type: planType,
      features,
      is_active: true
    }
    
    setSaving(true)
    try {
      if (editingPlan) {
        await superAdminApi.updatePlan(editingPlan._id, planData)
        alert('Plan updated successfully!')
      } else {
        await superAdminApi.createPlan(planData)
        alert('Plan created successfully!')
      }
      setShowCreateModal(false)
      setEditingPlan(null)
      fetchPlans()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      try {
        await superAdminApi.deletePlan(id)
        fetchPlans()
        alert('Plan deleted successfully!')
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete plan')
      }
    }
  }

  const formatFeatures = (features, type) => {
    if (!features) return null
    const featureList = type === 'college' ? collegeFeaturesList : aiFeaturesList
    return featureList
      .filter(f => features[f.key] !== undefined && features[f.key] !== null && features[f.key] !== 0 && features[f.key] !== false)
      .map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{label}: {features[key] === -1 ? 'Unlimited' : typeof features[key] === 'boolean' ? 'Included' : features[key]}</span>
        </div>
      ))
  }

  const collegePlans = plans.filter(p => p.type === 'college')
  const aiPlans = plans.filter(p => p.type === 'student_ai')

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Plans & Pricing</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage subscription plans for institutes and students</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => openCreateModal('student_ai')}>
            <Sparkles className="w-4 h-4 mr-2" /> Add AI Plan
          </Button>
          <Button onClick={() => openCreateModal('college')}>
            <CreditCard className="w-4 h-4 mr-2" /> Add College Plan
          </Button>
        </div>
      </div>

      {/* College Plans */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-500" /> College Plans
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardBody className="p-6">
                  <Skeleton className="h-6 w-20 mb-4" />
                  <Skeleton className="h-10 w-32 mb-4" />
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : collegePlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collegePlans.map((plan) => (
              <Card key={plan._id} hover className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${planColors.college}`} />
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant="info">{plan.name}</Badge>
                      {plan.description && <p className="text-xs text-slate-500 mt-1">{plan.description}</p>}
                    </div>
                    <Badge variant={plan.is_active ? 'success' : 'danger'}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400">/{plan.validity_days} days</span>
                  </div>
                  <div className="space-y-2 mb-6 min-h-[120px]">
                    {formatFeatures(plan.features, 'college')}
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(plan)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(plan._id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <CreditCard className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No college plans yet</p>
              <Button variant="outline" className="mt-4" onClick={() => openCreateModal('college')}>
                <Plus className="w-4 h-4 mr-2" /> Create First Plan
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* AI Plans */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" /> AI Study Plans
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map(i => (
              <Card key={i}>
                <CardBody className="p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-10 w-28 mb-4" />
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : aiPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiPlans.map((plan) => (
              <Card key={plan._id} hover className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${planColors.student_ai}`} />
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant="purple">{plan.name}</Badge>
                      {plan.description && <p className="text-xs text-slate-500 mt-1">{plan.description}</p>}
                    </div>
                    <Badge variant={plan.is_active ? 'success' : 'danger'}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400">/{plan.validity_days} days</span>
                  </div>
                  <div className="space-y-2 mb-6 min-h-[100px]">
                    {formatFeatures(plan.features, 'student_ai')}
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(plan)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(plan._id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <Sparkles className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No AI plans yet</p>
              <Button variant="outline" className="mt-4" onClick={() => openCreateModal('student_ai')}>
                <Plus className="w-4 h-4 mr-2" /> Create First AI Plan
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => { setShowCreateModal(false); setEditingPlan(null); }} 
        title={editingPlan ? 'Edit Plan' : `Create New ${planType === 'college' ? 'College' : 'AI'} Plan`}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Plan Name</label>
              <Input 
                placeholder="e.g., Professional" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description (Optional)</label>
              <Input 
                placeholder="Brief description of the plan" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price (₹)</label>
              <Input 
                type="number" 
                placeholder="2999" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Validity (Days)</label>
              <Input 
                type="number" 
                placeholder="30" 
                value={formData.validity_days}
                onChange={(e) => setFormData({...formData, validity_days: e.target.value})}
              />
            </div>
          </div>

          {planType === 'college' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Max Teachers (-1 for unlimited)</label>
                    <Input 
                      type="number" 
                      placeholder="-1 for unlimited"
                      value={formData.features.max_teachers}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, max_teachers: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Max Students (-1 for unlimited)</label>
                    <Input 
                      type="number" 
                      placeholder="-1 for unlimited"
                      value={formData.features.max_students}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, max_students: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Max Exams (-1 for unlimited)</label>
                    <Input 
                      type="number" 
                      placeholder="-1 for unlimited"
                      value={formData.features.max_exams}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, max_exams: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Storage GB (-1 for unlimited)</label>
                    <Input 
                      type="number" 
                      placeholder="-1 for unlimited"
                      value={formData.features.max_storage_gb}
                      onChange={(e) => setFormData({...formData, features: {...formData.features, max_storage_gb: e.target.value}})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'ai_assistant', label: 'AI Assistant', desc: 'AI-powered exam assistance' },
                    { key: 'analytics', label: 'Analytics Dashboard', desc: 'Advanced reporting & insights' },
                    { key: 'custom_branding', label: 'Custom Branding', desc: 'Logo & color customization' },
                    { key: 'priority_support', label: 'Priority Support', desc: '24/7 dedicated support' },
                  ].map(feature => (
                    <label 
                      key={feature.key}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.features[feature.key] 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={formData.features[feature.key]}
                        onChange={(e) => setFormData({...formData, features: {...formData.features, [feature.key]: e.target.checked}})}
                        className="mt-1 rounded"
                      />
                      <div>
                        <span className="font-medium text-sm text-slate-900 dark:text-white">{feature.label}</span>
                        <p className="text-xs text-slate-500">{feature.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {planType === 'student_ai' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Plan Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Queries Per Day (-1 for unlimited)</label>
                  <Input 
                    type="number" 
                    placeholder="-1 for unlimited"
                    value={formData.features.max_teachers}
                    onChange={(e) => setFormData({...formData, features: {...formData.features, max_teachers: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Practice Exams</label>
                  <Input 
                    type="number" 
                    placeholder="Unlimited"
                    value={formData.features.max_exams}
                    onChange={(e) => setFormData({...formData, features: {...formData.features, max_exams: e.target.value}})}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" type="button" onClick={() => { setShowCreateModal(false); setEditingPlan(null); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
