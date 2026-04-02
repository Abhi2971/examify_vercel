import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
import { clsx } from 'clsx'
import { 
  LayoutDashboard, Users, BookOpen, FileText, GraduationCap, 
  Building2, CreditCard, Settings, LogOut, Menu, X,
  BarChart3, ClipboardList, MessageSquare, Award, Folder, Package,
  HeadphonesIcon, BookMarked, AlertTriangle, Bell, Shield,
  BarChart, UserPlus, Book, FileBarChart, UsersRound, Ticket
} from 'lucide-react'

const MENU_ITEMS = {
  super_admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/super/dashboard' },
    { label: 'Institutes', icon: Building2, path: '/super/institutes' },
    { label: 'Users', icon: Users, path: '/super/users' },
    { label: 'Plans', icon: CreditCard, path: '/super/plans' },
    { label: 'Exams', icon: FileText, path: '/super/exams' },
    { label: 'Payments', icon: CreditCard, path: '/super/payments' },
    { label: 'Support Tickets', icon: MessageSquare, path: '/super/tickets' },
    { label: 'Audit Logs', icon: ClipboardList, path: '/super/audit-logs' },
    { label: 'Settings', icon: Settings, path: '/super/settings' },
  ],
  admin_college: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/college/dashboard' },
    { label: 'Exams', icon: FileText, path: '/college/exams' },
    { label: 'Teachers', icon: Users, path: '/college/teachers' },
    { label: 'Students', icon: GraduationCap, path: '/college/students' },
    { label: 'Subjects', icon: Book, path: '/college/subjects' },
    { label: 'Analytics', icon: BarChart, path: '/college/analytics' },
    { label: 'Tickets', icon: MessageSquare, path: '/college/tickets' },
    { label: 'Announcements', icon: Bell, path: '/college/announcements' },
    { label: 'Subscription', icon: CreditCard, path: '/college/subscription' },
    { label: 'Settings', icon: Settings, path: '/college/settings' },
  ],
  admin_public: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/platform/dashboard' },
    { label: 'Exams', icon: FileText, path: '/platform/exams' },
    { label: 'eBooks', icon: BookOpen, path: '/platform/ebooks' },
    { label: 'PDFs', icon: Folder, path: '/platform/pdfs' },
    { label: 'Bundles', icon: Package, path: '/platform/bundles' },
  ],
  teacher: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
    { label: 'Exams', icon: FileText, path: '/teacher/exams' },
    { label: 'Question Bank', icon: BookOpen, path: '/teacher/question-bank' },
    { label: 'Students', icon: GraduationCap, path: '/teacher/students' },
    { label: 'Live Monitor', icon: BarChart3, path: '/teacher/live-monitor' },
  ],
  student_college: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student-college/dashboard' },
    { label: 'Exams', icon: FileText, path: '/student-college/exams' },
    { label: 'Results', icon: BarChart3, path: '/student-college/results' },
  ],
  student_public: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'My Exams', icon: FileText, path: '/student/exams' },
    { label: 'eBooks', icon: BookOpen, path: '/student/ebooks' },
    { label: 'AI Coach', icon: MessageSquare, path: '/student/ai-coach' },
    { label: 'Wallet', icon: CreditCard, path: '/student/wallet' },
    { label: 'Certificates', icon: Award, path: '/student/certificates' },
  ],
}

const TIER_CONFIG = {
  l1: { label: 'L1 Support', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30', permissions: ['my_tickets', 'unassigned', 'knowledge_base'] },
  l2: { label: 'L2 Support', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30', permissions: ['my_tickets', 'unassigned', 'all_tickets', 'escalate', 'merge', 'knowledge_base', 'reports'] },
  l3: { label: 'L3 Lead', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30', permissions: ['my_tickets', 'unassigned', 'all_tickets', 'escalate', 'merge', 'reassign', 'knowledge_base', 'reports', 'team_management'] },
}

const getSupportMenuItems = (tier) => {
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.l1
  const items = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/support/dashboard' },
    { label: 'Tickets', icon: MessageSquare, path: '/support/tickets' },
  ]
  
  if (tierConfig.permissions.includes('team_management')) {
    items.push({ label: 'Team', icon: UsersRound, path: '/support/team' })
  }
  
  if (tierConfig.permissions.includes('reports')) {
    items.push({ label: 'Reports', icon: BarChart, path: '/support/reports' })
  }
  
  items.push({ label: 'Knowledge Base', icon: BookMarked, path: '/support/knowledge-base' })
  items.push({ label: 'Settings', icon: Settings, path: '/support/settings' })
  
  return items
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const { user, logout } = useAuth()
  const location = useLocation()
  
  let items = MENU_ITEMS[user?.role] || []
  
  if (user?.role === 'support_agent') {
    items = getSupportMenuItems(user.support_tier)
  }

  return (
    <aside className={clsx(
      'fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && <span className="text-xl font-bold text-primary-600">Examify</span>}
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      {user?.role === 'support_agent' && !collapsed && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className={clsx(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
            TIER_CONFIG[user.support_tier]?.color || 'bg-slate-100 text-slate-600'
          )}>
            <Shield className="w-3.5 h-3.5" />
            {TIER_CONFIG[user.support_tier]?.label || 'Support Agent'}
          </div>
        </div>
      )}
      
      <nav className="p-2 space-y-1">
        {items.map(item => {
          const isActive = location.pathname.startsWith(item.path.split('?')[0])
          return (
            <Link key={item.path} to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}>
              <item.icon size={20} />
              {!collapsed && (
                <span className="font-medium flex-1">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 dark:border-gray-700">
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
