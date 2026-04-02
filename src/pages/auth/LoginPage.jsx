import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

// ─── Asian Paints T20 World Cup Pre-Match Palette ─────────────────────────────
// Deep Navy #081120 · Vivid Teal #00C4B4 · Electric Cyan #00E5FF
// Coral Burst #FF5733 · Amber Gold #FFB800 · Soft White #F0F6FF
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_ROLES = [
  { role: 'super_admin', label: 'Super Admin', color: '#A855F7', path: '/super/dashboard' },
  { role: 'admin_college', label: 'College Admin', color: '#3B82F6', path: '/college/dashboard' },
  { role: 'admin_public', label: 'Platform Admin', color: '#00E5FF', path: '/platform/dashboard' },
  { role: 'teacher', label: 'Teacher', color: '#22C55E', path: '/teacher/dashboard' },
  { role: 'student_college', label: 'Student (College)', color: '#F97316', path: '/student-college/dashboard' },
  { role: 'student_public', label: 'Student (Public)', color: '#EC4899', path: '/student/dashboard' },
  { role: 'support_agent', label: 'Support Agent', color: '#6B7280', path: '/support/dashboard' },
]

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoPanel, setShowDemoPanel] = useState(false)
  const { login, loginAsRole } = useAuth()
  const navigate = useNavigate()

  const handleRealLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }
    
    setIsLoading(true)
    try {
      const data = await login(email, password)
      toast.success('Login successful!')
      
      const role = data?.user?.role
      const supportTier = data?.user?.support_tier
      
      const redirectPath = role === 'support_agent' 
        ? `/support/${supportTier || 'l1'}/dashboard`
        : getRedirectPath(role, data?.user)
      
      navigate(redirectPath)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

   const getRedirectPath = (role, user) => {
     const paths = {
       super_admin: '/super/dashboard',
       admin_college: '/college/dashboard',
       admin_public: '/platform/dashboard',
       teacher: '/teacher/dashboard',
       student_college: '/student-college/dashboard',
       student_public: '/student/dashboard',
       support_agent: `/support/${user?.support_tier || 'l1'}/dashboard`,
     }
     return paths[role] || '/super/dashboard'
   }

  const handleDemoLogin = (role, path) => {
    loginAsRole(role)
    toast.success(`Logged in as ${role.replace(/_/g, ' ')}`)
    navigate(path)
  }

  const handleGoogleLogin = () => {
    toast('Google login coming soon!', { icon: '🚀' })
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#081120' }}>
      {/* Left Panel - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #081120 0%, #0d1e36 100%)' }}
      >
        {/* Decorative glows */}
        <div 
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,196,180,0.15) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)' }}
        />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#00C4B4' }}>ExamSaaS</h1>
          <p className="text-2xl mb-2" style={{ color: '#F0F6FF' }}>The modern examination platform</p>
          <p className="text-sm mb-10" style={{ color: '#888' }}>Trusted by 500+ institutions worldwide</p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,196,180,0.15)', color: '#00C4B4' }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#F0F6FF' }}>AI-Powered Proctoring</p>
                <p className="text-sm" style={{ color: '#666' }}>Ensure exam integrity automatically</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(255,184,0,0.15)', color: '#FFB800' }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#F0F6FF' }}>Instant Results</p>
                <p className="text-sm" style={{ color: '#666' }}>Real-time grading and feedback</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(255,87,51,0.15)', color: '#FF5733' }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#F0F6FF' }}>Deep Analytics</p>
                <p className="text-sm" style={{ color: '#666' }}>Insights that drive improvement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div 
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #081120 100%)' }}
      >
        {/* Decorative element */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)' }}
        />
        
        {/* Back to Home */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: '#00C4B4' }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: '#00C4B4' }}>ExamSaaS</h1>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F0F6FF' }}>Welcome back</h2>
            <p className="text-sm" style={{ color: '#888' }}>Sign in to continue to your dashboard</p>
          </div>
          
          {/* Glassmorphism Card */}
          <div 
            className="rounded-2xl p-8"
            style={{ 
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0,229,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <form onSubmit={handleRealLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs mb-2" style={{ color: '#888' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0F6FF',
                    '--tw-ring-color': 'rgba(0,196,180,0.5)'
                  }}
                />
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-xs mb-2" style={{ color: '#888' }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0F6FF',
                    '--tw-ring-color': 'rgba(0,196,180,0.5)'
                  }}
                />
              </div>
              
              {/* Forgot password */}
              <div className="text-right">
                <button type="button" className="text-xs hover:underline" style={{ color: '#00C4B4' }}>
                  Forgot password?
                </button>
              </div>
              
              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ 
                  background: 'linear-gradient(135deg, #00C4B4 0%, #00E5FF 100%)',
                  color: '#081120'
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <span className="text-xs" style={{ color: '#555' }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
            
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all hover:opacity-90"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#333' }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>
          
          {/* Register link */}
          <p className="text-center mt-6 text-sm" style={{ color: '#888' }}>
            Don't have an account?{' '}
            <Link to="/register" className="hover:underline" style={{ color: '#00E5FF' }}>
              Create one
            </Link>
          </p>
          
          {/* Demo Login Toggle */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowDemoPanel(!showDemoPanel)}
              className="w-full text-center text-xs py-2 rounded-lg transition-all"
              style={{ color: '#666', background: 'rgba(255,255,255,0.03)' }}
            >
              {showDemoPanel ? 'Hide Demo Accounts' : 'Show Demo Accounts'} ▾
            </button>
            
            {showDemoPanel && (
              <div 
                className="mt-4 p-4 rounded-xl"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <p className="text-xs text-center mb-3" style={{ color: '#888' }}>Click to login as any role</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map(r => (
                    <button
                      key={r.role}
                      onClick={() => handleDemoLogin(r.role, r.path)}
                      className="px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all hover:scale-[1.02]"
                      style={{ 
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${r.color}30`,
                        color: r.color
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
