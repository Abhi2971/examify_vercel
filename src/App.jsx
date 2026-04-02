import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { SupportLayout } from './components/layout/SupportLayout'
import { L1SupportLayout } from './components/layout/L1SupportLayout'
import { L2SupportLayout } from './components/layout/L2SupportLayout'
import { L3SupportLayout } from './components/layout/L3SupportLayout'
import { ProtectedRoute } from './components/ProtectedRoute'

import { 
  LandingPage, 
  LandingFeatures, 
  LandingAbout, 
  LandingPricing,
  LandingContact,
  LandingPrivacy,
  LandingTerms,
  LandingBlog,
  LandingCareers,
  LandingHelpCenter,
  LandingSecurity,
  LandingChangelog,
  LandingDocumentation,
  LandingStatus,
  LandingPress,
  LandingCookies,
  LandingGDPR
} from './pages/public/LandingPage'

import { AuthPage } from './pages/auth/AuthPage'

import { SuperDashboard } from './pages/super_admin/SuperDashboard'
import { CollegeDashboard } from './pages/college_admin/CollegeDashboard'
import { PlatformDashboard } from './pages/platform_admin/PlatformDashboard'
import { TeacherDashboard } from './pages/teacher/TeacherDashboard'
import { StudentCollegeDashboard } from './pages/student_college/StudentCollegeDashboard'
import { StudentPublicDashboard } from './pages/student_public/StudentPublicDashboard'
import { InstitutesPage } from './pages/super_admin/InstitutesPage'
import { UsersPage } from './pages/super_admin/UsersPage'
import { PlansPage } from './pages/super_admin/PlansPage'
import { PaymentsPage } from './pages/super_admin/PaymentsPage'
import { AuditLogsPage } from './pages/super_admin/AuditLogsPage'
import { ExamsPage } from './pages/super_admin/ExamsPage'
import { TicketsPage } from './pages/super_admin/TicketsPage'
import { SettingsPage } from './pages/super_admin/SettingsPage'
import { CollegeTeachersPage } from './pages/college_admin/CollegeTeachersPage'
import { CollegeStudentsPage } from './pages/college_admin/CollegeStudentsPage'
import { CollegeExamsPage } from './pages/college_admin/CollegeExamsPage'
import { CollegeSubscriptionPage } from './pages/college_admin/CollegeSubscriptionPage'
import { CollegeSubjectsPage } from './pages/college_admin/CollegeSubjectsPage'
import { CollegeAnalyticsPage } from './pages/college_admin/CollegeAnalyticsPage'
import { CollegeSettingsPage } from './pages/college_admin/CollegeSettingsPage'
import { CollegeTicketsPage } from './pages/college_admin/CollegeTicketsPage'
import { CollegeAnnouncementsPage } from './pages/college_admin/CollegeAnnouncementsPage'
import { PlatformExamsPage } from './pages/platform_admin/PlatformExamsPage'
import { PlatformEbooksPage } from './pages/platform_admin/PlatformEbooksPage'
import { PlatformPdfsPage } from './pages/platform_admin/PlatformPdfsPage'
import { PlatformBundlesPage } from './pages/platform_admin/PlatformBundlesPage'
import { TeacherExamsPage } from './pages/teacher/TeacherExamsPage'
import { CreateExamPage } from './pages/teacher/CreateExamPage'
import { QuestionBankPage } from './pages/teacher/QuestionBankPage'
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage'
import { LiveMonitorPage } from './pages/teacher/LiveMonitorPage'
import { StudentExamsPage } from './pages/student_college/StudentExamsPage'
import { ExamGatePage } from './pages/student_college/ExamGatePage'
import { ExamAttemptPage } from './pages/student_college/ExamAttemptPage'
import { StudentResultsPage } from './pages/student_college/StudentResultsPage'
import { StudentPublicExams } from './pages/student_public/StudentPublicExams'
import { StudentEbooks } from './pages/student_public/StudentEbooks'
import { AiCoachPage } from './pages/student_public/AiCoachPage'
import { StudentWallet } from './pages/student_public/StudentWallet'
import { StudentCertificates } from './pages/student_public/StudentCertificates'

// L1 Pages
import { L1Dashboard } from './pages/support/L1/L1Dashboard'
import { L1TicketsPage } from './pages/support/L1/L1TicketsPage'
import { L1KnowledgeBasePage } from './pages/support/L1/L1KnowledgeBasePage'
import { L1HelpResourcesPage } from './pages/support/L1/L1HelpResourcesPage'
import { L1SettingsPage } from './pages/support/L1/L1SettingsPage'

// L2 Pages
import { L2Dashboard } from './pages/support/L2/L2Dashboard'
import { L2TicketsPage } from './pages/support/L2/L2TicketsPage'
import { L2ReportsPage } from './pages/support/L2/L2ReportsPage'
import { L2TeamViewPage } from './pages/support/L2/L2TeamViewPage'
import { L2KnowledgeBasePage } from './pages/support/L2/L2KnowledgeBasePage'
import { L2CannedResponsesPage } from './pages/support/L2/L2CannedResponsesPage'
import { L2SettingsPage } from './pages/support/L2/L2SettingsPage'

// L3 Pages
import { L3Dashboard } from './pages/support/L3/L3Dashboard'
import { L3TicketsPage } from './pages/support/L3/L3TicketsPage'
import { L3ReportsPage } from './pages/support/L3/L3ReportsPage'
import { L3TeamManagementPage } from './pages/support/L3/L3TeamManagementPage'
import { L3PerformanceMetricsPage } from './pages/support/L3/L3PerformanceMetricsPage'
import { L3EscalationQueuePage } from './pages/support/L3/L3EscalationQueuePage'
import { L3AutoAssignConfigPage } from './pages/support/L3/L3AutoAssignConfigPage'
import { L3SLAConfigPage } from './pages/support/L3/L3SLAConfigPage'
import { L3CannedResponsesPage } from './pages/support/L3/L3CannedResponsesPage'
import { L3HelpResourcesPage } from './pages/support/L3/L3HelpResourcesPage'
import { L3SettingsPage } from './pages/support/L3/L3SettingsPage'

// TierProtectedRoute Component
function TierProtectedRoute({ children, allowedTiers = [] }) {
  const { user } = useAuth()
  const tier = user?.support_tier?.toLowerCase() || 'l1'

  if (!user?.support_tier) {
    return <Navigate to="/login" replace />
  }

  if (!allowedTiers.includes(tier)) {
    return <Navigate to="/support/l1/dashboard" replace />
  }

  return children
}

// SupportRouterRedirect Component
function SupportRouterRedirect() {
  const { user } = useAuth()
  const tier = user?.support_tier?.toLowerCase() || 'l1'

  const tierDashboards = {
    l1: '/support/l1/dashboard',
    l2: '/support/l2/dashboard',
    l3: '/support/l3/dashboard'
  }

  return <Navigate to={tierDashboards[tier] || '/support/l1/dashboard'} replace />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing pages have their own Header/Footer, no wrapper needed */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<LandingFeatures />} />
        <Route path="/about" element={<LandingAbout />} />
        <Route path="/pricing" element={<LandingPricing />} />
        
        {/* Footer pages */}
        <Route path="/contact" element={<LandingContact />} />
        <Route path="/privacy" element={<LandingPrivacy />} />
        <Route path="/terms" element={<LandingTerms />} />
        <Route path="/blog" element={<LandingBlog />} />
        <Route path="/careers" element={<LandingCareers />} />
        <Route path="/help" element={<LandingHelpCenter />} />
        <Route path="/security" element={<LandingSecurity />} />
        <Route path="/changelog" element={<LandingChangelog />} />
        <Route path="/docs" element={<LandingDocumentation />} />
        <Route path="/status" element={<LandingStatus />} />
        <Route path="/press" element={<LandingPress />} />
        <Route path="/cookies" element={<LandingCookies />} />
        <Route path="/gdpr" element={<LandingGDPR />} />

        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        <Route element={<ProtectedRoute allowedRoles={['super_admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/super/dashboard" element={<SuperDashboard />} />
          <Route path="/super/institutes" element={<InstitutesPage />} />
          <Route path="/super/users" element={<UsersPage />} />
          <Route path="/super/plans" element={<PlansPage />} />
          <Route path="/super/payments" element={<PaymentsPage />} />
          <Route path="/super/audit-logs" element={<AuditLogsPage />} />
          <Route path="/super/exams" element={<ExamsPage />} />
          <Route path="/super/tickets" element={<TicketsPage />} />
          <Route path="/super/settings" element={<SettingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin_college']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
          <Route path="/college/exams" element={<CollegeExamsPage />} />
          <Route path="/college/teachers" element={<CollegeTeachersPage />} />
          <Route path="/college/students" element={<CollegeStudentsPage />} />
          <Route path="/college/subjects" element={<CollegeSubjectsPage />} />
          <Route path="/college/analytics" element={<CollegeAnalyticsPage />} />
          <Route path="/college/tickets" element={<CollegeTicketsPage />} />
          <Route path="/college/announcements" element={<CollegeAnnouncementsPage />} />
          <Route path="/college/subscription" element={<CollegeSubscriptionPage />} />
          <Route path="/college/settings" element={<CollegeSettingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin_public']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/platform/dashboard" element={<PlatformDashboard />} />
          <Route path="/platform/exams" element={<PlatformExamsPage />} />
          <Route path="/platform/ebooks" element={<PlatformEbooksPage />} />
          <Route path="/platform/pdfs" element={<PlatformPdfsPage />} />
          <Route path="/platform/bundles" element={<PlatformBundlesPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/exams" element={<TeacherExamsPage />} />
          <Route path="/teacher/exams/create" element={<CreateExamPage />} />
          <Route path="/teacher/question-bank" element={<QuestionBankPage />} />
          <Route path="/teacher/students" element={<TeacherStudentsPage />} />
          <Route path="/teacher/live-monitor" element={<LiveMonitorPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student_college']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/student-college/dashboard" element={<StudentCollegeDashboard />} />
          <Route path="/student-college/exams" element={<StudentExamsPage />} />
          <Route path="/student-college/exam/:id/gate" element={<ExamGatePage />} />
          <Route path="/student-college/exam/:id/attempt" element={<ExamAttemptPage />} />
          <Route path="/student-college/results" element={<StudentResultsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student_public']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/student/dashboard" element={<StudentPublicDashboard />} />
          <Route path="/student/exams" element={<StudentPublicExams />} />
          <Route path="/student/ebooks" element={<StudentEbooks />} />
          <Route path="/student/ai-coach" element={<AiCoachPage />} />
          <Route path="/student/wallet" element={<StudentWallet />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
        </Route>

        {/* L1 Support Routes */}
        <Route element={<ProtectedRoute allowedRoles={['support_agent']}><L1SupportLayout /></ProtectedRoute>}>
          <Route path="/support/l1/dashboard" element={<L1Dashboard />} />
          <Route path="/support/l1/tickets" element={<L1TicketsPage />} />
          <Route path="/support/l1/knowledge-base" element={<L1KnowledgeBasePage />} />
          <Route path="/support/l1/help-resources" element={<L1HelpResourcesPage />} />
          <Route path="/support/l1/settings" element={<L1SettingsPage />} />
        </Route>

        {/* L2 Support Routes */}
        <Route element={<ProtectedRoute allowedRoles={['support_agent']}><L2SupportLayout /></ProtectedRoute>}>
          <Route path="/support/l2/dashboard" element={<L2Dashboard />} />
          <Route path="/support/l2/tickets" element={<L2TicketsPage />} />
          <Route path="/support/l2/reports" element={<L2ReportsPage />} />
          <Route path="/support/l2/team-view" element={<L2TeamViewPage />} />
          <Route path="/support/l2/knowledge-base" element={<L2KnowledgeBasePage />} />
          <Route path="/support/l2/canned-responses" element={<L2CannedResponsesPage />} />
          <Route path="/support/l2/settings" element={<L2SettingsPage />} />
        </Route>

        {/* L3 Support Routes */}
        <Route element={<ProtectedRoute allowedRoles={['support_agent']}><L3SupportLayout /></ProtectedRoute>}>
          <Route path="/support/l3/dashboard" element={<L3Dashboard />} />
          <Route path="/support/l3/tickets" element={<L3TicketsPage />} />
          <Route path="/support/l3/reports" element={<L3ReportsPage />} />
          <Route path="/support/l3/team-management" element={<L3TeamManagementPage />} />
          <Route path="/support/l3/performance-metrics" element={<L3PerformanceMetricsPage />} />
          <Route path="/support/l3/escalation-queue" element={<L3EscalationQueuePage />} />
          <Route path="/support/l3/auto-assign-config" element={<L3AutoAssignConfigPage />} />
          <Route path="/support/l3/sla-config" element={<L3SLAConfigPage />} />
          <Route path="/support/l3/canned-responses" element={<L3CannedResponsesPage />} />
          <Route path="/support/l3/help-resources" element={<L3HelpResourcesPage />} />
          <Route path="/support/l3/settings" element={<L3SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
