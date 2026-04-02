import { useState, useEffect } from 'react'
import { superAdminApi } from '../../api/superAdminApi'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { 
  DollarSign, 
  Search, 
  Eye, 
  Download, 
  Building2, 
  Clock, 
  FileText,
  TrendingUp,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCcw,
  Receipt,
  Calendar,
  User,
  Hash,
  Copy
} from 'lucide-react'
import { Skeleton } from '../../components/ui/Skeleton'

const statusConfig = {
  success: { label: 'Success', variant: 'success', color: 'text-emerald-600 bg-emerald-100' },
  pending: { label: 'Pending', variant: 'warning', color: 'text-amber-600 bg-amber-100' },
  failed: { label: 'Failed', variant: 'danger', color: 'text-red-600 bg-red-100' },
  refunded: { label: 'Refunded', variant: 'secondary', color: 'text-slate-600 bg-slate-100' },
}

export function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      const data = await superAdminApi.getPayments()
      setPayments(data?.data || data || [])
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      payment.institute_name?.toLowerCase().includes(searchLower) ||
      payment.email?.toLowerCase().includes(searchLower) ||
      payment.order_id?.toLowerCase().includes(searchLower) ||
      payment.razorpay_id?.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesType = typeFilter === 'all' || payment.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0)
  const failedAmount = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + (p.amount || 0), 0)
  const successCount = payments.filter(p => p.status === 'success').length
  const pendingCount = payments.filter(p => p.status === 'pending').length

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatTime = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatAmount = (amount) => {
    if (!amount) return 0
    return (amount / 100).toLocaleString('en-IN')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400">Track all payments and subscriptions</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{formatAmount(totalRevenue)}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {successCount} successful
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3">
                <DollarSign className="w-full h-full text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Payments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{formatAmount(pendingAmount)}</p>
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {pendingCount} pending
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-3">
                <AlertCircle className="w-full h-full text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Failed Payments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{formatAmount(failedAmount)}</p>
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Needs attention
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 p-3">
                <XCircle className="w-full h-full text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{payments.length}</p>
                <p className="text-xs text-slate-500 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                <Receipt className="w-full h-full text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search by institute, email, or order ID..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="plan_purchase">Plan Purchase</option>
              <option value="plan_upgrade">Plan Upgrade</option>
              <option value="renewal">Renewal</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Payments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardBody className="p-5">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment._id} hover className="transition-all hover:shadow-md">
              <CardBody className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      payment.status === 'success' ? 'bg-emerald-100' :
                      payment.status === 'pending' ? 'bg-amber-100' :
                      payment.status === 'failed' ? 'bg-red-100' : 'bg-slate-100'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        payment.status === 'success' ? 'text-emerald-600' :
                        payment.status === 'pending' ? 'text-amber-600' :
                        payment.status === 'failed' ? 'text-red-600' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {payment.institute_name || payment.institute || 'Unknown Institute'}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[payment.status]?.color || 'text-slate-600 bg-slate-100'}`}>
                          {statusConfig[payment.status]?.label || payment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {payment.email || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(payment.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">₹{formatAmount(payment.amount)}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Plan</p>
                      <Badge variant="secondary">{payment.plan_name || payment.plan || 'N/A'}</Badge>
                    </div>
                    
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <Receipt className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No payments found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search query</p>
          </CardBody>
        </Card>
      )}

      {/* Detail Modal */}
      {selectedPayment && (
        <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Payment Details" size="lg">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                selectedPayment.status === 'success' ? 'bg-emerald-100' :
                selectedPayment.status === 'pending' ? 'bg-amber-100' :
                selectedPayment.status === 'failed' ? 'bg-red-100' : 'bg-slate-100'
              }`}>
                <DollarSign className={`w-8 h-8 ${
                  selectedPayment.status === 'success' ? 'text-emerald-600' :
                  selectedPayment.status === 'pending' ? 'text-amber-600' :
                  selectedPayment.status === 'failed' ? 'text-red-600' : 'text-slate-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    ₹{formatAmount(selectedPayment.amount)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedPayment.status]?.color || 'text-slate-600 bg-slate-100'}`}>
                    {statusConfig[selectedPayment.status]?.label || selectedPayment.status}
                  </span>
                </div>
                <p className="text-slate-500 mt-1">
                  {selectedPayment.institute_name || selectedPayment.institute || 'Unknown Institute'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Customer Email
                </p>
                <p className="font-medium text-slate-900 dark:text-white">{selectedPayment.email || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Plan
                </p>
                <p className="font-medium text-slate-900 dark:text-white">{selectedPayment.plan_name || selectedPayment.plan || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date & Time
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatDate(selectedPayment.created_at)} at {formatTime(selectedPayment.created_at)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Payment Type
                </p>
                <p className="font-medium text-slate-900 dark:text-white capitalize">
                  {selectedPayment.type?.replace('_', ' ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Order ID
                </p>
                <button 
                  onClick={() => copyToClipboard(selectedPayment.order_id)}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedId === selectedPayment.order_id ? (
                    <><CheckCircle className="w-3 h-3" /> Copied!</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
              </div>
              <p className="font-mono text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                {selectedPayment.order_id || 'N/A'}
              </p>
            </div>

            {selectedPayment.razorpay_id && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Razorpay ID
                  </p>
                  <button 
                    onClick={() => copyToClipboard(selectedPayment.razorpay_id)}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {copiedId === selectedPayment.razorpay_id ? (
                      <><CheckCircle className="w-3 h-3" /> Copied!</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                </div>
                <p className="font-mono text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                  {selectedPayment.razorpay_id}
                </p>
              </div>
            )}

            {selectedPayment.method && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                <p className="font-medium text-slate-900 dark:text-white capitalize">{selectedPayment.method}</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => setSelectedPayment(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
