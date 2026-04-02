import { forwardRef } from 'react'
import { clsx } from 'clsx'

export const Input = forwardRef(({ 
  label, 
  error, 
  className, 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700',
          'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
          'placeholder-slate-400 dark:placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
