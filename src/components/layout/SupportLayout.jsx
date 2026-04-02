import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { 
  LayoutDashboard, MessageSquare, Users, BarChart3, 
  BookOpen, Settings, LogOut, Menu, X, Shield,
  Inbox, UserCog, Tags, FileText, Zap
} from 'lucide-react'

const TIER_CONFIG = {
  l1: { 
    label: 'L1 Support', 
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400'
  },
  l2: { 
    label: 'L2 Support', 
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400'
  },
  l3: { 
    label: 'L3 Lead', 
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400'
  }
}

const getMenuItems = (tier) => {
  const items = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/support/dashboard' },
    { label: 'My Tickets', icon: MessageSquare, path: '/support/tickets' },
  ]
  
  if (tier === 'l3') {
    items.push({ label: 'Team & Queue', icon: Users, path: '/support/team' })
  }
  
  if (tier === 'l2' || tier === 'l3') {
    items.push({ label: 'Reports', icon: BarChart3, path: '/support/reports' })
  }
  
  items.push(
    { label: 'Canned Responses', icon: Zap, path: '/support/canned-responses' },
    { label: 'Knowledge Base', icon: BookOpen, path: '/support/knowledge-base' },
    { label: 'Settings', icon: Settings, path: '/support/settings' }
  )
  
  return items
}

export function SupportLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  
  const tier = user?.support_tier || 'l1'
  const tierConfig = TIER_CONFIG[tier]
  const menuItems = getMenuItems(tier)

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
              <span className="text-xl font-bold bg-gradient-to-r from-[#00C4B4] to-[#00E5FF] bg-clip-text text-transparent">
                Support Hub
              </span>
            )}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-white/10 text-[#F0F6FF]/70 transition-colors"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* Tier Badge */}
          {!collapsed && (
            <div className="px-4 py-3 border-b border-white/10">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${tierConfig.bgColor} ${tierConfig.textColor}`}>
                <Shield className="w-3.5 h-3.5" />
                {tierConfig.label}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/support/dashboard' && location.pathname.startsWith(item.path))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#00C4B4]/20 to-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30' 
                      : 'text-[#F0F6FF]/70 hover:bg-white/5 hover:text-[#F0F6FF]'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-[#00E5FF]' : 'group-hover:text-[#00C4B4]'} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-3 border-t border-white/10">
            {!collapsed && (
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-medium text-[#F0F6FF]">{user?.name}</p>
                <p className="text-xs text-[#F0F6FF]/50">{user?.email}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#FF5733]/80 hover:bg-[#FF5733]/10 hover:text-[#FF5733] transition-colors"
            >
              <LogOut size={20} />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${collapsed ? 'pl-24' : 'pl-80'} pr-6 py-6`}>
        <Outlet />
      </main>
    </div>
  )
}
