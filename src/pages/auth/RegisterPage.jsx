import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

// ─── Asian Paints T20 World Cup Pre-Match Palette ─────────────────────────────
// Deep Navy #081120 · Vivid Teal #00C4B4 · Electric Cyan #00E5FF
// Coral Burst #FF5733 · Amber Gold #FFB800 · Soft White #F0F6FF
// ─────────────────────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
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
        await register(formData)
        toast.success('Registration successful! Please check your email to verify.')
        navigate('/login')
      } else {
        // Fallback for demo
        toast.success('Registration successful! Please verify your email.')
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    toast('Google signup coming soon!', { icon: '🚀' })
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
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,87,51,0.1) 0%, transparent 70%)' }}
        />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#00C4B4' }}>ExamSaaS</h1>
          <p className="text-2xl mb-2" style={{ color: '#F0F6FF' }}>Start your journey today</p>
          <p className="text-sm mb-10" style={{ color: '#888' }}>Join 50,000+ students and educators</p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,229,255,0.15)', color: '#00E5FF' }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#F0F6FF' }}>Access All Exams</p>
                <p className="text-sm" style={{ color: '#666' }}>Practice with thousands of questions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(0,196,180,0.15)', color: '#00C4B4' }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#F0F6FF' }}>AI Study Coach</p>
                <p className="text-sm" style={{ color: '#666' }}>Personalized learning assistance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(255,184,0,0.15)', color: '#FFB800' }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#F0F6FF' }}>Earn Certificates</p>
                <p className="text-sm" style={{ color: '#666' }}>Verified credentials for your profile</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div 
            className="mt-12 p-5 rounded-xl"
            style={{ 
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <p className="text-sm italic mb-3" style={{ color: '#aaa' }}>
              "ExamSaaS helped me crack my competitive exams. The AI coach is like having a personal tutor!"
            </p>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #00C4B4, #00E5FF)', color: '#081120' }}
              >
                RK
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#F0F6FF' }}>Rahul K.</p>
                <p className="text-xs" style={{ color: '#666' }}>Engineering Student</p>
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
          style={{ background: 'radial-gradient(circle, rgba(0,196,180,0.1) 0%, transparent 70%)' }}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs mb-2" style={{ color: '#888' }}>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0F6FF',
                    '--tw-ring-color': 'rgba(0,196,180,0.5)'
                  }}
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-xs mb-2" style={{ color: '#888' }}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0F6FF',
                    '--tw-ring-color': 'rgba(0,196,180,0.5)'
                  }}
                />
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-xs mb-2" style={{ color: '#888' }}>Phone (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
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
                <label className="block text-xs mb-2" style={{ color: '#888' }}>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0F6FF',
                    '--tw-ring-color': 'rgba(0,196,180,0.5)'
                  }}
                />
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-xs mb-2" style={{ color: '#888' }}>Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0F6FF',
                    '--tw-ring-color': 'rgba(0,196,180,0.5)'
                  }}
                />
              </div>
              
              {/* Terms checkbox */}
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
              
              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ 
                  background: 'linear-gradient(135deg, #00C4B4 0%, #00E5FF 100%)',
                  color: '#081120'
                }}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            
            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <span className="text-xs" style={{ color: '#555' }}>or sign up with</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
            
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all hover:opacity-90"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#333' }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>
          
          {/* Login link */}
          <p className="text-center mt-6 text-sm" style={{ color: '#888' }}>
            Already have an account?{' '}
            <Link to="/login" className="hover:underline" style={{ color: '#00E5FF' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
