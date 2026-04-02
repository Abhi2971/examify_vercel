import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">Examify</Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/pricing" className="text-gray-600 hover:text-primary-600 dark:text-gray-300">Pricing</Link>
              <Link to="/login" className="text-gray-600 hover:text-primary-600 dark:text-gray-300">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Get Started</Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <Link to="/pricing" className="block text-gray-600">Pricing</Link>
            <Link to="/login" className="block text-gray-600">Login</Link>
            <Link to="/register" className="block text-primary-600 font-medium">Get Started</Link>
          </div>
        )}
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Examify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
