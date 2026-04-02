import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import { collegeAdminApi } from '../../api/collegeAdminApi'
import {
  Settings,
  Building2,
  FileText,
  Users,
  Bell,
  Shield,
  Save,
  Clock
} from 'lucide-react'

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start justify-between cursor-pointer group">
      <div className="flex-1">
        {label && (
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {label}
          </span>
        )}
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="relative ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 transition-colors"></div>
        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
      </div>
    </label>
  )
}

export function CollegeSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  })

  const [examRules, setExamRules] = useState({
    defaultDuration: 60,
    maxAttempts: 3,
    negativeMarking: false,
    showResults: true
  })

  const [userPolicies, setUserPolicies] = useState({
    studentRegistration: true,
    teacherCreateExam: true,
    teacherEditExam: true,
    teacherDeleteExam: false
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    examNotifications: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileData, settingsData] = await Promise.all([
        collegeAdminApi.getProfile(),
        collegeAdminApi.getSettings()
      ])

      if (profileData?.institute) {
        setProfile({
          name: profileData.institute.name || '',
          phone: profileData.institute.phone || '',
          address: profileData.institute.address || '',
          city: profileData.institute.city || '',
          state: profileData.institute.state || ''
        })
      }

      if (settingsData) {
        setExamRules({
          defaultDuration: settingsData.defaultDuration || 60,
          maxAttempts: settingsData.maxAttempts || 3,
          negativeMarking: settingsData.negativeMarking || false,
          showResults: settingsData.showResults !== false
        })

        setUserPolicies({
          studentRegistration: settingsData.studentRegistration !== false,
          teacherCreateExam: settingsData.teacherCreateExam !== false,
          teacherEditExam: settingsData.teacherEditExam !== false,
          teacherDeleteExam: settingsData.teacherDeleteExam || false
        })

        setNotifications({
          emailAlerts: settingsData.emailAlerts !== false,
          examNotifications: settingsData.examNotifications !== false
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    try {
      await collegeAdminApi.updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state
      })

      await collegeAdminApi.updateSettings({
        ...examRules,
        ...userPolicies,
        ...notifications
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">College Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your institute configuration</p>
        </div>
        {success && (
          <Badge variant="success" className="px-4 py-2">
            Settings saved successfully!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Institute Profile
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="College Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter college name"
            />
            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Enter phone number"
            />
            <Input
              label="Address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="Enter address"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="Enter city"
              />
              <Input
                label="State"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                placeholder="Enter state"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Exam Rules
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                    Default Duration (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={examRules.defaultDuration}
                    onChange={(e) => setExamRules({ ...examRules, defaultDuration: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={examRules.maxAttempts}
                    onChange={(e) => setExamRules({ ...examRules, maxAttempts: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
              <Toggle
                label="Negative Marking"
                description="Deduct marks for wrong answers"
                checked={examRules.negativeMarking}
                onChange={(checked) => setExamRules({ ...examRules, negativeMarking: checked })}
              />
              <Toggle
                label="Show Results"
                description="Students can view their results after exam"
                checked={examRules.showResults}
                onChange={(checked) => setExamRules({ ...examRules, showResults: checked })}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              User Policies
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
              <Toggle
                label="Student Registration"
                description="Allow students to register themselves"
                checked={userPolicies.studentRegistration}
                onChange={(checked) => setUserPolicies({ ...userPolicies, studentRegistration: checked })}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
                Teacher Permissions
              </h4>
              <div className="space-y-4">
                <Toggle
                  label="Create Exam"
                  description="Teachers can create new exams"
                  checked={userPolicies.teacherCreateExam}
                  onChange={(checked) => setUserPolicies({ ...userPolicies, teacherCreateExam: checked })}
                />
                <Toggle
                  label="Edit Exam"
                  description="Teachers can edit existing exams"
                  checked={userPolicies.teacherEditExam}
                  onChange={(checked) => setUserPolicies({ ...userPolicies, teacherEditExam: checked })}
                />
                <Toggle
                  label="Delete Exam"
                  description="Teachers can delete exams"
                  checked={userPolicies.teacherDeleteExam}
                  onChange={(checked) => setUserPolicies({ ...userPolicies, teacherDeleteExam: checked })}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-6">
            <Toggle
              label="Email Alerts"
              description="Receive important updates via email"
              checked={notifications.emailAlerts}
              onChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
            />
            <Toggle
              label="Exam Notifications"
              description="Get notified about exam activities"
              checked={notifications.examNotifications}
              onChange={(checked) => setNotifications({ ...notifications, examNotifications: checked })}
            />
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={saving}
          size="lg"
          className="gap-2"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
