import { Card, CardBody } from './Card'
import { clsx } from 'clsx'

export function StatCard({ title, value, change, changeType, icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20',
    success: 'bg-green-50 text-green-600 dark:bg-green-900/20',
    warning: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20',
    danger: 'bg-red-50 text-red-600 dark:bg-red-900/20',
  }

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            {change && (
              <p className={clsx('text-sm mt-1', changeType === 'positive' ? 'text-green-600' : 'text-red-600')}>
                {change}
              </p>
            )}
          </div>
          {Icon && (
            <div className={clsx('p-3 rounded-xl', colors[color])}>
              <Icon size={24} />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
