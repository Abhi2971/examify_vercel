import { useState, useEffect } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { ClipboardList, Filter, ChevronDown, ChevronUp, User, Globe, Clock } from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'

const actionIcons = {
  'user.created': { icon: User, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'user.updated': { icon: User, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  'user.role_changed': { icon: User, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  'institute.created': { icon: Globe, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
  'institute.suspended': { icon: Globe, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  'payment.received': { icon: Globe, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  'payment.failed': { icon: Globe, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  'exam.created': { icon: Globe, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
  'exam.published': { icon: Globe, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  'plan.updated': { icon: Globe, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
  'default': { icon: ClipboardList, color: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400' },
}

export function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('all')
  const [expandedLogs, setExpandedLogs] = useState(new Set())

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    try {
      const data = await superAdminApi.getAuditLogs()
      const logsArray = Array.isArray(data) ? data : (data?.data || [])
      setLogs(logsArray)
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const filteredLogs = logs.filter(log => {
    return actionFilter === 'all' || log.action.startsWith(actionFilter)
  })

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track all platform activities and changes</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {filteredLogs.length} activities
        </div>
      </div>

      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Filter by:</span>
            </div>
            <select 
              value={actionFilter} 
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Actions</option>
              <option value="user">User Actions</option>
              <option value="institute">Institute Actions</option>
              <option value="payment">Payment Actions</option>
              <option value="exam">Exam Actions</option>
            </select>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardBody className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : filteredLogs.map((log, index) => {
          const actionConfig = actionIcons[log.action] || actionIcons.default
          const ActionIcon = actionConfig.icon
          const { date, time } = formatDateTime(log.timestamp)
          const isExpanded = expandedLogs.has(log._id)
          
          return (
            <Card key={log._id}>
              <CardBody className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${actionConfig.color} flex items-center justify-center flex-shrink-0`}>
                    <ActionIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{log.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {log.user_name || 'System'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            {log.ip_address || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {date} at {time}
                          </div>
                        </div>
                      </div>
                      {log.details && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleExpand(log._id)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      )}
                    </div>
                    
                    {isExpanded && log.details && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <p className="text-xs font-medium text-slate-400 uppercase mb-2">Details</p>
                        <div className="space-y-1">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 text-sm">
                              <span className="text-slate-500">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-slate-900 dark:text-white">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {!loading && filteredLogs.length === 0 && (
        <Card>
          <CardBody className="p-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No audit logs found</p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
