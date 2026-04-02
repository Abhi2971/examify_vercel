import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

const DEMO_USERS = {
  super_admin: { id: '1', name: 'Super Admin', email: 'super@examify.com', role: 'super_admin', institute_id: null },
  admin_college: { id: '2', name: 'College Admin', email: 'admin@college.com', role: 'admin_college', institute_id: 'inst1' },
  admin_public: { id: '3', name: 'Platform Admin', email: 'admin@platform.com', role: 'admin_public', institute_id: null },
  teacher: { id: '4', name: 'John Teacher', email: 'teacher@college.com', role: 'teacher', institute_id: 'inst1' },
  student_college: { id: '5', name: 'Student College', email: 'student@college.com', role: 'student_college', institute_id: 'inst1' },
  student_public: { id: '6', name: 'Public Student', email: 'student@public.com', role: 'student_public', institute_id: null },
  support_agent: { id: '7', name: 'Support Agent', email: 'support@examify.com', role: 'support_agent', institute_id: null, support_tier: 'l1' },
  support_l2: { id: '9', name: 'Support Manager', email: 'support.l2@examify.com', role: 'support_agent', institute_id: null, support_tier: 'l2' },
  support_l3: { id: '8', name: 'Support Lead', email: 'support.l3@examify.com', role: 'support_agent', institute_id: null, support_tier: 'l3' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('examify_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('examify_token'))
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const data = await authApi.login(email, password)
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('examify_token', data.token)
      localStorage.setItem('examify_user', JSON.stringify(data.user))
      return data
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginAsRole = useCallback((role) => {
    const demoUser = DEMO_USERS[role]
    if (demoUser) {
      setUser(demoUser)
      localStorage.setItem('examify_user', JSON.stringify(demoUser))
      localStorage.setItem('examify_token', `demo_token_${role}`)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('examify_token')
    localStorage.removeItem('examify_user')
  }, [])

  const isSupportTier = useMemo(() => {
    return user?.role === 'support_agent' && user?.support_tier
  }, [user])

  const canViewAllTickets = useMemo(() => {
    return user?.role === 'support_agent' && ['l2', 'l3'].includes(user?.support_tier)
  }, [user])

  const canReassignTickets = useMemo(() => {
    return user?.role === 'support_agent' && user?.support_tier === 'l3'
  }, [user])

  const canManageTeam = useMemo(() => {
    return user?.role === 'support_agent' && user?.support_tier === 'l3'
  }, [user])

  const canMergeTickets = useMemo(() => {
    return user?.role === 'support_agent' && ['l2', 'l3'].includes(user?.support_tier)
  }, [user])

  const value = useMemo(() => ({
    user,
    token,
    login,
    loginAsRole,
    logout,
    isLoading,
    isSupportTier,
    canViewAllTickets,
    canReassignTickets,
    canManageTeam,
    canMergeTickets
  }), [user, token, login, loginAsRole, logout, isLoading, isSupportTier, canViewAllTickets, canReassignTickets, canManageTeam, canMergeTickets])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
