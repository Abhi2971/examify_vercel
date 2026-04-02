import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { useSupportTier } from '../../hooks/useSupportTier'
import { 
  LayoutDashboard, MessageSquare, BookOpen, Settings, LogOut, Menu, X, 
  BarChart3, Users, Zap, TrendingUp, Flame, Clock, Sliders, Shield
} from 'lucide-react'

const L3_MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/support/l3/dashboard' },
  { label: 'All Tickets', icon: MessageSquare, path: '/support/l3/tickets' },
  { label: 'Reports', icon: BarChart3, path: '/support/l3/reports' },
  { label: 'Team Management', icon: Users, path: '/support/l3/team' },
  { label: 'Performance Metrics', icon: TrendingUp, path: '/support/l3/performance' },
  { label: 'Escalation Queue', icon: Flame, path: '/support/l3/escalations' },
  { label: 'Auto-Assign Config', icon: Clock, path: '/support/l3/auto-assign' },
  { label: 'Canned Responses', icon: Zap, path: '/support/l3/canned-responses' },
  { label: 'Knowledge Base', icon: BookOpen, path: '/support/l3/knowledge-base' },
  { label: 'SLA Management', icon: Sliders, path: '/support/l3/sla-config' },
  { label: 'Settings', icon: Settings, path: '/support/l3/settings' }
]

export function L3SupportLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const { config } = useSupportTier()

  return (
    <div className="min-h-screen bg-[#081120]">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#00C4B4]/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#00E5FF]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
        <div className="h-full m-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Shield size={24} className="text-amber-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#00C4B4] to-[#00E5FF] bg-clip-text text-transparent">
                  L3 Lead
                </span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className={`flex items-center gap-3 ${collapsed && 'justify-center'}`}>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'L'}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'Lead'}</p>
                  <p className="text-xs text-amber-400 font-semibold truncate">{config.label}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {L3_MENU_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${config.color} text-white`
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={20} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 transition-all"
              title={collapsed ? 'Logout' : ''}
            >
              <LogOut size={20} />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
