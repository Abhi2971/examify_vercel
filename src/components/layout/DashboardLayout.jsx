import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { Topbar } from '../Topbar'
import { SidebarProvider, useSidebar } from '../../context/SidebarContext'

function DashboardContent() {
  const { collapsed } = useSidebar()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`min-h-screen transition-all duration-300 ${collapsed ? 'pl-16' : 'pl-64'}`}>
        <Topbar />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  )
}
