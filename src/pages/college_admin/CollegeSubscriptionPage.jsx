import { useState, useEffect } from 'react'
import { Card, CardBody, Button, Badge, Skeleton } from '../../components/ui'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import { CreditCard, Building2, Users, GraduationCap, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export function CollegeSubscriptionPage() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      const data = await collegeAdminApi.getSubscription()
      setSubscription(data)
      setError(null)
    } catch (err) {
      setError('Failed to load subscription details')
    } finally {
      setLoading(false)
    }
  }

  const getUsagePercentage = (used, limit) => {
    if (!limit || limit === 0) return 0
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const isExpiringSoon = () => {
    if (!subscription?.institute?.plan_expiry) return false
    const expiryDate = new Date(subscription.institute.plan_expiry)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription</h1>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  const { institute, plan, usage } = subscription || {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <CreditCard className="w-4 h-4" />
            View Invoice
          </Button>
          <a href="/college/upgrade">
            <Button className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Upgrade Plan
            </Button>
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {institute?.name || 'College'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {institute?.email || 'college@example.com'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {institute?.plan_name || 'Basic Plan'}
                </p>
              </div>
                <Badge variant={subscription?.plan ? 'success' : 'warning'}>
                  {subscription?.plan ? 'Active' : 'No Plan'}
                </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Plan Expires</span>
                <span className={`font-medium ${isExpiringSoon() ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                  {formatDate(institute?.plan_expiry)}
                </span>
              </div>
              {isExpiringSoon() && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    Your plan is expiring soon. Renew to avoid interruption.
                  </span>
                </div>
              )}
            </div>

            <a href="/college/renew">
              <Button variant="outline" className="w-full gap-2">
                <CheckCircle className="w-4 h-4" />
                Renew Plan
              </Button>
            </a>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Usage Overview
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Teachers</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {usage?.teachers?.used || 0} / {usage?.teachers?.limit || 0}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageColor(getUsagePercentage(usage?.teachers?.used, usage?.teachers?.limit))} transition-all duration-300`}
                    style={{ width: `${getUsagePercentage(usage?.teachers?.used, usage?.teachers?.limit)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Students</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {usage?.students?.used || 0} / {usage?.students?.limit || 0}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageColor(getUsagePercentage(usage?.students?.used, usage?.students?.limit))} transition-all duration-300`}
                    style={{ width: `${getUsagePercentage(usage?.students?.used, usage?.students?.limit)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exams</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {usage?.exams?.used || 0} / {usage?.exams?.limit || 0}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageColor(getUsagePercentage(usage?.exams?.used, usage?.exams?.limit))} transition-all duration-300`}
                    style={{ width: `${getUsagePercentage(usage?.exams?.used, usage?.exams?.limit)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need more resources? Upgrade your plan to get additional teachers, students, and exam allocations.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan Features
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plan?.features ? Object.entries(plan.features).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {key === 'max_teachers' ? `Up to ${value} Teachers` :
                   key === 'max_students' ? `Up to ${value} Students` :
                   key === 'max_exams' ? `Up to ${value} Exams` :
                   key === 'queries_per_day' ? `${value} AI Queries/Day` :
                   `${key}: ${value}`}
                </span>
              </div>
            )) : [
              'Teacher Management',
              'Student Management',
              'Exam Creation',
              'Analytics Dashboard',
              'Priority Support',
              'Custom Branding'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
