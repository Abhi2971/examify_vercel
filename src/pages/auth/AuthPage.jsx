import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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

// Branding content for each mode
const brandingContent = {
  login: {
    title: 'Welcome back',
    subtitle: 'The modern examination platform',
    tagline: 'Trusted by 500+ institutions worldwide',
    features: [
      { icon: 'shield', title: 'AI-Powered Proctoring', desc: 'Ensure exam integrity automatically', color: '#00C4B4', bg: 'rgba(0,196,180,0.15)' },
      { icon: 'bolt', title: 'Instant Results', desc: 'Real-time grading and feedback', color: '#FFB800', bg: 'rgba(255,184,0,0.15)' },
      { icon: 'chart', title: 'Deep Analytics', desc: 'Insights that drive improvement', color: '#FF5733', bg: 'rgba(255,87,51,0.15)' },
    ]
  },
  register: {
    title: 'Start your journey',
    subtitle: 'Join thousands of learners today',
    tagline: 'Join 50,000+ students and educators',
    features: [
      { icon: 'book', title: 'Access All Exams', desc: 'Practice with thousands of questions', color: '#00E5FF', bg: 'rgba(0,229,255,0.15)' },
      { icon: 'bulb', title: 'AI Study Coach', desc: 'Personalized learning assistance', color: '#00C4B4', bg: 'rgba(0,196,180,0.15)' },
      { icon: 'badge', title: 'Earn Certificates', desc: 'Verified credentials for your profile', color: '#FFB800', bg: 'rgba(255,184,0,0.15)' },
    ]
  }
}

const FeatureIcon = ({ type, color }) => {
  const icons = {
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    bolt: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    bulb: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    badge: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  }
  return (
    <svg fill="none" stroke={color} viewBox="0 0 24 24" width="22" height="22">
      {icons[type]}
    </svg>
  )
}

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, loginAsRole, register } = useAuth()
  
  // Determine initial mode from URL
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register')
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    name: '', email: '', phone: '', password: '', confirmPassword: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoPanel, setShowDemoPanel] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false)

  // Sync URL with mode
  useEffect(() => {
    const path = isLogin ? '/login' : '/register'
    if (location.pathname !== path) {
      navigate(path, { replace: true })
    }
  }, [isLogin, location.pathname, navigate])

  // Handle mode toggle with animation
  const toggleMode = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsLogin(!isLogin)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const getRedirectPath = (role, supportTier) => {
    if (role === 'support_agent') {
      return `/support/${supportTier || 'l1'}/dashboard`
    }
    const paths = {
      super_admin: '/super/dashboard',
      admin_college: '/college/dashboard',
      admin_public: '/platform/dashboard',
      teacher: '/teacher/dashboard',
      student_college: '/student-college/dashboard',
      student_public: '/student/dashboard',
    }
    return paths[role] || '/super/dashboard'
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginData.email || !loginData.password) {
      toast.error('Please enter email and password')
      return
    }
    
    setIsLoading(true)
    try {
      const data = await login(loginData.email, loginData.password)
      toast.success('Login successful!')
      const role = data?.user?.role || data?.role
      const supportTier = data?.user?.support_tier
      navigate(getRedirectPath(role, supportTier))
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (registerData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (!agreeToTerms) {
      toast.error('Please agree to the Terms & Privacy Policy')
      return
    }
    
    setIsLoading(true)
    try {
      if (register) {
        await register(registerData)
      }
      toast.success('Registration successful! Please verify your email.')
      setIsLogin(true)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role, path) => {
    loginAsRole(role)
    toast.success(`Logged in as ${role.replace(/_/g, ' ')}`)
    navigate(path)
  }

  const handleGoogleAuth = () => {
    toast('Google authentication coming soon!', { icon: '🚀' })
  }

  const content = isLogin ? brandingContent.login : brandingContent.register

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: '#081120' }}>
      {/* Container for both panels */}
      <div className="min-h-screen flex relative">
        
        {/* Branding Panel - Slides left/right */}
        <div 
          className="absolute inset-y-0 w-1/2 hidden lg:flex flex-col justify-center p-12 z-20 transition-transform duration-[600ms]"
          style={{ 
            background: 'linear-gradient(135deg, #081120 0%, #0d1e36 100%)',
            transform: isLogin ? 'translateX(0%)' : 'translateX(100%)',
            transitionTimingFunction: 'cubic-bezier(0.68, -0.05, 0.32, 1.05)',
            left: 0,
          }}
        >
          {/* Decorative glows */}
          <div 
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full transition-all duration-700"
            style={{ 
              background: isLogin 
                ? 'radial-gradient(circle, rgba(0,196,180,0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)'
            }}
          />
          <div 
            className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full transition-all duration-700"
            style={{ 
              background: isLogin
                ? 'radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,87,51,0.1) 0%, transparent 70%)'
            }}
          />
          
          <div className="relative z-10">
            <h1 
              className="text-4xl font-bold mb-3 transition-all duration-500"
              style={{ color: '#00C4B4' }}
            >
              ExamSaaS
            </h1>
            <p 
              className="text-2xl mb-2 transition-all duration-500"
              style={{ color: '#F0F6FF', opacity: isAnimating ? 0 : 1 }}
            >
              {content.subtitle}
            </p>
            <p 
              className="text-sm mb-10 transition-all duration-500"
              style={{ color: '#888', opacity: isAnimating ? 0 : 1 }}
            >
              {content.tagline}
            </p>
            
            <div className="space-y-5">
              {content.features.map((feature, idx) => (
                <div 
                  key={feature.title}
                  className="flex items-center gap-4 transition-all duration-500"
                  style={{ 
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating ? 'translateX(-20px)' : 'translateX(0)',
                    transitionDelay: `${idx * 100}ms`
                  }}
                >
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: feature.bg }}
                  >
                    <FeatureIcon type={feature.icon} color={feature.color} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#F0F6FF' }}>{feature.title}</p>
                    <p className="text-sm" style={{ color: '#666' }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Toggle button on branding panel */}
            <div className="mt-12">
              <p className="text-sm mb-3" style={{ color: '#888' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                onClick={toggleMode}
                disabled={isAnimating}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50"
                style={{ 
                  background: 'transparent',
                  border: '2px solid #00C4B4',
                  color: '#00C4B4'
                }}
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>

        {/* Form Panel - Always on right for desktop, switches content */}
        <div 
          className="w-full lg:w-1/2 lg:ml-auto min-h-screen flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-hidden transition-all duration-[600ms]"
          style={{ 
            background: 'linear-gradient(180deg, #0a1628 0%, #081120 100%)',
            transform: isLogin ? 'translateX(0%)' : 'translateX(-100%)',
            transitionTimingFunction: 'cubic-bezier(0.68, -0.05, 0.32, 1.05)',
          }}
        >
          {/* Decorative element */}
          <div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)' }}
          />
          
          {/* Back to Home */}
          <Link 
            to="/" 
            className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-colors hover:opacity-80 z-30"
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
            
            {/* Login Form */}
            <div 
              className="transition-all duration-500"
              style={{ 
                opacity: isLogin ? 1 : 0,
                transform: isLogin ? 'translateX(0)' : 'translateX(50px)',
                position: isLogin ? 'relative' : 'absolute',
                pointerEvents: isLogin ? 'auto' : 'none',
                width: '100%'
              }}
            >
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
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888' }}>Email</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                      style={{ 
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F6FF'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888' }}>Password</label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                      style={{ 
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F6FF'
                      }}
                    />
                  </div>
                  
                  <div className="text-right">
                    <button type="button" className="text-xs hover:underline" style={{ color: '#00C4B4' }}>
                      Forgot password?
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(135deg, #00C4B4 0%, #00E5FF 100%)',
                      color: '#081120'
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <span className="text-xs" style={{ color: '#555' }}>or continue with</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                </div>
                
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all hover:opacity-90"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#333' }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </div>
              
              {/* Mobile toggle */}
              <p className="lg:hidden text-center mt-6 text-sm" style={{ color: '#888' }}>
                Don't have an account?{' '}
                <button onClick={toggleMode} className="hover:underline" style={{ color: '#00E5FF' }}>
                  Create one
                </button>
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
                    className="mt-4 p-4 rounded-xl animate-fadeIn"
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

            {/* Register Form */}
            <div 
              className="transition-all duration-500"
              style={{ 
                opacity: !isLogin ? 1 : 0,
                transform: !isLogin ? 'translateX(0)' : 'translateX(-50px)',
                position: !isLogin ? 'relative' : 'absolute',
                pointerEvents: !isLogin ? 'auto' : 'none',
                width: '100%',
                top: 0
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F0F6FF' }}>Create your account</h2>
                <p className="text-sm" style={{ color: '#888' }}>Start learning and achieving your goals</p>
              </div>
              
              {/* Glassmorphism Card */}
              <div 
                className="rounded-2xl p-6 lg:p-8"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,229,255,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888' }}>Full Name *</label>
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                      style={{ 
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F6FF'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888' }}>Email *</label>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                      style={{ 
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F6FF'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888' }}>Phone (Optional)</label>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                      style={{ 
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F6FF'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888' }}>Password *</label>
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                      style={{ 
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F6FF'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888' }}>Confirm Password *</label>
                    <input
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                      style={{ 
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F0F6FF'
                      }}
                    />
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded"
                      style={{ accentColor: '#00C4B4' }}
                    />
                    <label htmlFor="terms" className="text-xs" style={{ color: '#888' }}>
                      I agree to the{' '}
                      <Link to="/terms" className="hover:underline" style={{ color: '#00C4B4' }}>Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="hover:underline" style={{ color: '#00C4B4' }}>Privacy Policy</Link>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(135deg, #00C4B4 0%, #00E5FF 100%)',
                      color: '#081120'
                    }}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
                
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <span className="text-xs" style={{ color: '#555' }}>or sign up with</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                </div>
                
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all hover:opacity-90"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#333' }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </div>
              
              {/* Mobile toggle */}
              <p className="lg:hidden text-center mt-6 text-sm" style={{ color: '#888' }}>
                Already have an account?{' '}
                <button onClick={toggleMode} className="hover:underline" style={{ color: '#00E5FF' }}>
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
