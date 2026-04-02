import { clsx } from 'clsx'

export function Card({ 
  children, 
  className, 
  hover = false,
  gradientBorder = false,
  ...props 
}) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-800 rounded-xl shadow-card',
        'border border-slate-200/50 dark:border-slate-700/50',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200',
        gradientBorder && 'card-gradient-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={clsx('text-lg font-semibold text-slate-900 dark:text-white', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={clsx('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={clsx('px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50', className)} {...props}>
      {children}
    </div>
  )
}
