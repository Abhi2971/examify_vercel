import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Bell, Moon, Sun, User } from 'lucide-react'
import { clsx } from 'clsx'

export function Topbar() {
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Welcome, <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <User size={18} className="text-primary-600" />
        </div>
      </div>
    </header>
  )
}
