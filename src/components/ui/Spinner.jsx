import { clsx } from 'clsx'

export function Spinner({ size = 'md', className, ...props }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={clsx('animate-spin rounded-full border-2 border-gray-200 border-t-primary-600', sizes[size], className)} {...props} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner size="lg" />
    </div>
  )
}
